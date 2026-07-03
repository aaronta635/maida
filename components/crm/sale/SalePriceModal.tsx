'use client';

import { useEffect, useState, type ReactNode } from 'react';
import type { SaleGroup, SaleItem } from '@/data/sale-types';
import { BANK_DEFAULT } from '@/lib/crm/sale/constants';
import type { SaleToolState } from '@/hooks/useSaleTool';

function holiToLines(holi: Set<string>) {
  return [...holi]
    .sort()
    .map((s) => {
      const [y, m, d] = s.split('-');
      return `${d}/${m}/${y}`;
    })
    .join('\n');
}

export default function SalePriceModal({
  tool,
  open,
  onClose,
}: {
  tool: SaleToolState;
  open: boolean;
  onClose: () => void;
}) {
  const { data, holi, bank, savePrices, restoreDefaults } = tool;
  const [edits, setEdits] = useState<Record<string, Partial<SaleItem>>>({});
  const [holiLines, setHoliLines] = useState('');
  const [bankEdit, setBankEdit] = useState({ ...BANK_DEFAULT });

  useEffect(() => {
    if (!open) return;
    const initial: Record<string, Partial<SaleItem>> = {};
    data.forEach((g) =>
      g.cats.forEach((c) =>
        c.items.forEach((it) => {
          if (it.rates) initial[it.id] = { rates: { ...it.rates } };
          else initial[it.id] = { price: it.price };
        }),
      ),
    );
    setEdits(initial);
    setHoliLines(holiToLines(holi));
    setBankEdit({ ...bank });
  }, [open, data, holi, bank]);

  function patchItem(id: string, patch: Partial<SaleItem>) {
    setEdits((prev) => {
      const cur = prev[id] || {};
      if (patch.rates && cur.rates) {
        return { ...prev, [id]: { rates: { ...cur.rates, ...patch.rates } } };
      }
      return { ...prev, [id]: { ...cur, ...patch } };
    });
  }

  function renderRows(groups: SaleGroup[]) {
    const rows: ReactNode[] = [];
    groups.forEach((g) =>
      g.cats.forEach((c) => {
        if (!c.items.length) return;
        rows.push(
          <div key={g.group + c.cat} className="pe-cat">
            {g.group} — {c.cat}
          </div>,
        );
        c.items.forEach((it) => {
          const e = edits[it.id];
          if (it.rates && e?.rates) {
            rows.push(
              <div key={it.id} className="pe-row">
                <div className="pe-name">{it.name}</div>
                <div className="pe-rates">
                  {(['wd', 'sat', 'hol'] as const).map((t) => (
                    <input
                      key={t}
                      type="number"
                      min={0}
                      value={e.rates![t] ?? ''}
                      title={t}
                      onChange={(ev) =>
                        patchItem(it.id, {
                          rates: { ...e.rates!, [t]: parseInt(ev.target.value) || 0 },
                        })
                      }
                    />
                  ))}
                </div>
              </div>,
            );
          } else {
            rows.push(
              <div key={it.id} className="pe-row">
                <div className="pe-name">{it.name}</div>
                <input
                  type="number"
                  min={0}
                  value={e?.price ?? it.price ?? ''}
                  onChange={(ev) =>
                    patchItem(it.id, { price: parseInt(ev.target.value) || 0 })
                  }
                />
              </div>,
            );
          }
        });
      }),
    );
    return rows;
  }

  return (
    <div className={`modal ${open ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <div className="modal-head">
          <h3>⚙︎ Sửa bảng giá</h3>
          <button type="button" className="x" onClick={onClose}>
            ×
          </button>
        </div>
        <p className="hint">
          Nhập giá VNĐ (không dấu chấm). Phòng có 3 ô = Trong tuần / T7 / Lễ-Tết. Số lưu
          trên trình duyệt máy này.
        </p>
        <div
          style={{
            margin: '4px 0 14px',
            padding: '11px 12px',
            background: '#fff',
            border: '1px solid var(--line)',
            borderRadius: 11,
          }}
        >
          <label style={{ fontWeight: 700, fontSize: 13, display: 'block', marginBottom: 7 }}>
            Tài khoản nhận tiền (in trên Phiếu thu + mã QR)
          </label>
          <div className="grid2">
            <div className="field">
              <label>Tên tài khoản</label>
              <input
                value={bankEdit.name}
                onChange={(e) => setBankEdit((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="field">
              <label>Số tài khoản</label>
              <input
                inputMode="numeric"
                value={bankEdit.acc}
                onChange={(e) => setBankEdit((p) => ({ ...p, acc: e.target.value }))}
              />
            </div>
            <div className="field">
              <label>Ngân hàng (hiển thị)</label>
              <input
                value={bankEdit.bank}
                onChange={(e) => setBankEdit((p) => ({ ...p, bank: e.target.value }))}
              />
            </div>
            <div className="field">
              <label>Mã NH VietQR (BIN)</label>
              <input
                inputMode="numeric"
                placeholder="970418 = BIDV"
                value={bankEdit.bin}
                onChange={(e) => setBankEdit((p) => ({ ...p, bin: e.target.value }))}
              />
            </div>
          </div>
          <p className="hint" style={{ margin: '6px 0 0' }}>
            BIN: BIDV 970418 · Vietcombank 970436 · Vietinbank 970415 · MB 970422 · ACB
            970416 · Techcombank 970407 · Agribank 970405. Sai BIN thì QR không quét đúng
            ngân hàng.
          </p>
        </div>
        <div
          style={{
            margin: '4px 0 14px',
            padding: '11px 12px',
            background: 'var(--cream)',
            border: '1px solid var(--line)',
            borderRadius: 11,
          }}
        >
          <label style={{ fontWeight: 700, fontSize: 13, display: 'block', marginBottom: 5 }}>
            Ngày Lễ / Tết — mỗi dòng một ngày (NGÀY/THÁNG/NĂM)
          </label>
          <textarea
            className="hol-edit"
            value={holiLines}
            onChange={(e) => setHoliLines(e.target.value)}
            placeholder={'30/04/2026\n01/05/2026\n02/09/2026'}
          />
          <p className="hint" style={{ margin: '5px 0 0' }}>
            Đêm rơi vào các ngày này tự tính mức <b>Lễ/Tết</b>. Đêm <b>Thứ 7</b> tự nhận
            mức T7 — không cần nhập. Cập nhật danh sách mỗi năm tại đây (gồm cả Tết Nguyên
            đán).
          </p>
        </div>
        <div id="priceEditList">{renderRows(data)}</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <button
            type="button"
            className="btn-primary"
            onClick={() => savePrices(edits, holiLines, bankEdit)}
          >
            Lưu giá
          </button>
          <button type="button" className="btn-ghost" onClick={restoreDefaults}>
            Khôi phục mặc định
          </button>
        </div>
      </div>
    </div>
  );
}
