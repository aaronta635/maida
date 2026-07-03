'use client';

import { useState } from 'react';
import type { SaleGroup, SaleItem } from '@/data/sale-types';
import { TIERS, type RoomTier } from '@/lib/crm/sale/constants';
import { fmt, norm } from '@/lib/crm/sale/engine';
import type { SaleToolState } from '@/hooks/useSaleTool';
import SaleAuditBanner, { TierChips } from './SaleAuditBanner';

export default function SaleGroupPanel({
  tool,
  group,
}: {
  tool: SaleToolState;
  group: SaleGroup;
}) {
  const {
    roomTier,
    setRoomTier,
    cart,
    chg,
    setQ,
    chgRoom,
    setQRoom,
    addRoomByCalendar,
    addCustom,
    addAsk,
    customItems,
    setCustomItems,
    search,
    setSearch,
    items,
    audit,
  } = tool;

  const [customName, setCustomName] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [customQty, setCustomQty] = useState('1');
  const [askPrices, setAskPrices] = useState<Record<string, { price: string; qty: string }>>({});

  const hasRooms = group.cats.some((c) => c.rooms);

  function matchesSearch(it: SaleItem) {
    if (!search) return true;
    const q = norm(search);
    return norm(it.name + ' ' + (it.desc || '')).includes(q);
  }

  function customForSect(sect: string) {
    return customItems.filter((x) => x.sect === sect);
  }

  return (
    <>
      {hasRooms && (
        <>
          <div className="tier-bar">
            <span className="tier-lbl">Áp dụng giá phòng:</span>
            <div className="seg">
              {(['wd', 'sat', 'hol'] as RoomTier[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`seg-b ${roomTier === t ? 'active' : ''}`}
                  onClick={() => setRoomTier(t)}
                >
                  {TIERS[t]}
                </button>
              ))}
            </div>
          </div>
          <SaleAuditBanner audit={audit} />
          <div className="hint" style={{ margin: '-2px 0 8px' }}>
            Chọn <b>Ngày đến / Ngày đi</b> ở trên, rồi bấm <b>“📅 Theo lịch”</b> ở phòng cần đặt.
          </div>
        </>
      )}

      <input
        className="search"
        placeholder={`🔎 Tìm trong ${group.group}…`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {group.cats.map((cat) => {
        const visibleItems = cat.custom
          ? []
          : cat.items.filter((it) => matchesSearch(items[it.id] || it));

        if (!cat.custom && !visibleItems.length) return null;

        return (
          <div key={cat.cat} className="cat-block" data-cat={cat.cat}>
            <div className="subhead">{cat.cat}</div>
            <div className="panel">
              {cat.custom ? (
                <>
                  <div className="hint" style={{ marginBottom: 9 }}>
                    Gõ tên món/đồ uống chưa có sẵn + đơn giá để cộng vào phiếu.
                  </div>
                  <div className="custom-add">
                    <div className="field" style={{ flex: '1 1 170px' }}>
                      <label>Tên món / mục</label>
                      <input
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="VD: Rượu cần"
                      />
                    </div>
                    <div className="field" style={{ flex: '0 0 120px' }}>
                      <label>Đơn giá (đ)</label>
                      <input
                        type="number"
                        min={0}
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                      />
                    </div>
                    <div className="field" style={{ flex: '0 0 64px' }}>
                      <label>SL</label>
                      <input
                        type="number"
                        min={1}
                        value={customQty}
                        onChange={(e) => setCustomQty(e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      className="addbtn"
                      onClick={() => {
                        addCustom(
                          customName,
                          parseInt(customPrice) || 0,
                          Math.max(1, parseInt(customQty) || 1),
                        );
                        setCustomName('');
                        setCustomPrice('');
                        setCustomQty('1');
                      }}
                    >
                      + Thêm
                    </button>
                  </div>
                  <CustomList
                    list={customForSect('NHÀ HÀNG')}
                    onChangeQty={(id, qty) =>
                      setCustomItems((prev) =>
                        prev.map((x) => (x.id === id ? { ...x, qty } : x)),
                      )
                    }
                    onRemove={(id) =>
                      setCustomItems((prev) => prev.filter((x) => x.id !== id))
                    }
                  />
                </>
              ) : (
                visibleItems.map((it) => {
                  const item = items[it.id] || it;
                  if (item.room) {
                    const key = item.id + '@' + roomTier;
                    const q = cart[key] || 0;
                    return (
                      <div key={item.id} className="cat-item">
                        <div className="ci-main">
                          <div className="ci-name">{item.name}</div>
                          <div className="ci-meta">
                            {fmt(item.rates![roomTier])}/đêm · {TIERS[roomTier]}
                          </div>
                          <TierChips itemId={item.id} cart={cart} />
                        </div>
                        <div className="ctrl-wrap">
                          {q > 0 ? (
                            <QtyControl
                              value={q}
                              onDec={() => chgRoom(item.id, -1)}
                              onInc={() => chgRoom(item.id, 1)}
                              onChange={(v) => setQRoom(item.id, v)}
                            />
                          ) : (
                            <button type="button" className="addbtn" onClick={() => chgRoom(item.id, 1)}>
                              + Thêm
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn-cal"
                            onClick={() => addRoomByCalendar(item.id)}
                          >
                            📅 Theo lịch
                          </button>
                        </div>
                      </div>
                    );
                  }

                  if (item.askPrice) {
                    const ap = askPrices[item.id] || { price: '', qty: '1' };
                    return (
                      <div key={item.id}>
                        <div className="cat-item">
                          <div className="ci-main">
                            <div className="ci-name">{item.name}</div>
                            <div className="ci-meta">{item.note || 'Sale điền giá'}</div>
                          </div>
                        </div>
                        <div className="custom-add" style={{ marginTop: 8 }}>
                          <div className="field" style={{ flex: '0 0 140px' }}>
                            <label>Đơn giá (đ)</label>
                            <input
                              type="number"
                              min={0}
                              value={ap.price}
                              onChange={(e) =>
                                setAskPrices((p) => ({
                                  ...p,
                                  [item.id]: { ...ap, price: e.target.value },
                                }))
                              }
                            />
                          </div>
                          <div className="field" style={{ flex: '0 0 60px' }}>
                            <label>SL</label>
                            <input
                              type="number"
                              min={1}
                              value={ap.qty}
                              onChange={(e) =>
                                setAskPrices((p) => ({
                                  ...p,
                                  [item.id]: { ...ap, qty: e.target.value },
                                }))
                              }
                            />
                          </div>
                          <button
                            type="button"
                            className="addbtn"
                            onClick={() => {
                              addAsk(
                                item,
                                parseInt(ap.price) || 0,
                                Math.max(1, parseInt(ap.qty) || 1),
                              );
                              setAskPrices((p) => ({
                                ...p,
                                [item.id]: { price: '', qty: '1' },
                              }));
                            }}
                          >
                            + Thêm
                          </button>
                        </div>
                        <CustomList
                          list={customForSect(item.sect || '')}
                          onChangeQty={(id, qty) =>
                            setCustomItems((prev) =>
                              prev.map((x) => (x.id === id ? { ...x, qty } : x)),
                            )
                          }
                          onRemove={(id) =>
                            setCustomItems((prev) => prev.filter((x) => x.id !== id))
                          }
                        />
                      </div>
                    );
                  }

                  const q = cart[item.id] || 0;
                  const priceTxt = (item.price || 0) > 0 ? fmt(item.price!) : item.note || '—';
                  return (
                    <div key={item.id} className="cat-item">
                      <div className="ci-main">
                        <div className="ci-name">{item.name}</div>
                        <div className="ci-meta">
                          {priceTxt} {item.unit}
                          {item.perNight ? ' · × số đêm' : ''}
                        </div>
                        {item.desc && <div className="ci-desc">{item.desc}</div>}
                      </div>
                      {q > 0 ? (
                        <QtyControl
                          value={q}
                          onDec={() => chg(item.id, -1)}
                          onInc={() => chg(item.id, 1)}
                          onChange={(v) => setQ(item.id, v)}
                        />
                      ) : (
                        <button type="button" className="addbtn" onClick={() => chg(item.id, 1)}>
                          + Thêm
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}

function QtyControl({
  value,
  onDec,
  onInc,
  onChange,
}: {
  value: number;
  onDec: () => void;
  onInc: () => void;
  onChange: (v: number) => void;
}) {
  return (
    <div className="qty">
      <button type="button" className="qbtn" onClick={onDec}>
        −
      </button>
      <input
        className="qval"
        value={value}
        inputMode="numeric"
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
      />
      <button type="button" className="qbtn" onClick={onInc}>
        +
      </button>
    </div>
  );
}

function CustomList({
  list,
  onChangeQty,
  onRemove,
}: {
  list: { id: string; name: string; price: number; qty: number }[];
  onChangeQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) {
  if (!list.length)
    return <div className="empty" style={{ marginTop: 8 }}>Chưa thêm mục nào.</div>;
  return (
    <div style={{ marginTop: 8 }}>
      {list.map((it) => (
        <div key={it.id} className="cat-item">
          <div className="ci-main">
            <div className="ci-name">{it.name}</div>
            <div className="ci-meta">
              {fmt(it.price)} × {it.qty} = {fmt(it.price * it.qty)}
            </div>
          </div>
          <QtyControl
            value={it.qty}
            onDec={() => onChangeQty(it.id, Math.max(1, it.qty - 1))}
            onInc={() => onChangeQty(it.id, it.qty + 1)}
            onChange={(v) => onChangeQty(it.id, Math.max(1, v))}
          />
          <button type="button" className="addbtn ci-rm" onClick={() => onRemove(it.id)}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
