'use client';

import { useMemo, useState } from 'react';
import { ZONES } from '@/data/zones';
import type { SelectedItem, ZoneItem } from '@/data/types';
import { submitGuestOrder } from '@/lib/crm/orders';
import type { RoomRateType } from '@/lib/crm/types';
import '@/app/order.css';

const fmt = (n: number) => n.toLocaleString('vi-VN') + ' ₫';
const RATE_LABEL: Record<string, string> = {
  wd: 'Trong tuần',
  we: 'Cuối tuần (T7)',
  hol: 'Lễ / Tết',
};

function getItem(k: string) {
  const [zi, si, ii] = k.split('-').map(Number);
  return ZONES[zi].sections[si].items[ii];
}

function zoneOfKey(k: string) {
  return ZONES[+k.split('-')[0]];
}

function priceOf(it: ZoneItem, roomRate: string): number | null {
  const v = it.rates ? it.rates[roomRate as keyof typeof it.rates] : it.p;
  return v ?? null;
}

export default function OrderApp() {
  const [qty, setQty] = useState<Record<string, number>>({});
  const [activeZone, setActiveZone] = useState(0);
  const [roomRate, setRoomRate] = useState<RoomRateType | 'we'>('wd');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [guest, setGuest] = useState({ name: '', phone: '', pax: '', when: '', note: '' });
  const [submitting, setSubmitting] = useState(false);

  const selected = useMemo((): SelectedItem[] => {
    return Object.keys(qty)
      .filter((k) => qty[k] > 0)
      .map((k) => {
        const it = getItem(k);
        const up = priceOf(it, roomRate);
        return { key: k, it, q: qty[k], up, line: up === null ? null : up * qty[k] };
      });
  }, [qty, roomRate]);

  const grandTotal = selected.reduce((s, x) => s + (x.line || 0), 0);
  const contactCount = selected.filter((x) => x.up === null).length;
  const unitCount = selected.reduce((s, x) => s + x.q, 0);

  function bump(k: string, d: number) {
    setQty((prev) => {
      const next = Math.max(0, (prev[k] || 0) + d);
      const copy = { ...prev };
      if (next <= 0) delete copy[k];
      else copy[k] = next;
      return copy;
    });
  }

  function showToast(m: string) {
    setToast(m);
    setTimeout(() => setToast(''), 2400);
  }

  function orderText() {
    let t = '— MAIDA LODGE · YÊU CẦU ĐẶT TRƯỚC —\n';
    if (guest.name) t += 'Khách: ' + guest.name + '\n';
    if (guest.phone) t += 'SĐT/Zalo: ' + guest.phone + '\n';
    if (guest.when) t += 'Ngày: ' + guest.when + '\n';
    if (guest.pax) t += 'Số khách: ' + guest.pax + '\n';
    if (selected.some((x) => x.it.rates)) t += 'Loại ngày (phòng): ' + RATE_LABEL[roomRate] + '\n';
    t += 'Gửi lúc: ' + new Date().toLocaleString('vi-VN') + '\n';
    ZONES.forEach((zone, zi) => {
      const z = selected.filter((x) => +x.key.split('-')[0] === zi);
      if (!z.length) return;
      t += '\n[' + zone.name.toUpperCase() + ']\n';
      z.forEach((x) => {
        if (x.up === null) t += '• ' + x.it.vi + ' × ' + x.q + ' — Liên hệ báo giá\n';
        else t += '• ' + x.it.vi + ' ' + (x.it.u || '') + ' × ' + x.q + ' = ' + x.line!.toLocaleString('vi-VN') + ' đ\n';
      });
    });
    t += '\n--------------------------------\n';
    t += 'TẠM TÍNH: ' + grandTotal.toLocaleString('vi-VN') + ' đ (đã gồm VAT)\n';
    if (contactCount) t += '(+ ' + contactCount + ' mục cần Maida báo giá)\n';
    if (guest.note) t += 'Ghi chú: ' + guest.note + '\n';
    return t;
  }

  async function copyText(txt: string) {
    try {
      await navigator.clipboard.writeText(txt);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = txt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
  }

  async function submitOrder() {
    if (!selected.length) return showToast('Quý khách chưa chọn mục nào');
    if (!guest.name || !guest.phone) return showToast('Vui lòng điền tên và số điện thoại');
    setSubmitting(true);
    const { ok, error } = await submitGuestOrder(
      {
        customer_name: guest.name,
        customer_phone: guest.phone,
        pax: guest.pax || null,
        dates: guest.when || null,
        note: guest.note || null,
        room_rate_type: selected.some((x) => x.it.rates) ? (roomRate as RoomRateType) : null,
        subtotal: grandTotal,
        has_contact_items: contactCount > 0,
      },
      selected.map((x) => ({
        zone_id: zoneOfKey(x.key).id,
        zone_name: zoneOfKey(x.key).name,
        item_name_vi: x.it.vi ?? x.it.g ?? 'Mục',
        item_name_en: x.it.en || null,
        unit: x.it.u || null,
        unit_price: x.up,
        quantity: x.q,
        line_total: x.line,
      })),
    );
    setSubmitting(false);
    if (!ok || error) {
      showToast('Gửi thất bại — vui lòng thử lại hoặc nhắn Zalo.');
      return;
    }
    showToast('Đã gửi đơn! Maida sẽ xác nhận sớm qua Zalo.');
    setDrawerOpen(false);
    setQty({});
  }

  return (
    <>
      <header>
        <div className="mark">Maida Lodge · Hồ Hòa Bình · Phú Thọ</div>
        <h1>Đặt trước &amp; Gọi món</h1>
        <div className="sub">Phòng · Thực đơn · Dịch vụ</div>
        <div className="rule" />
      </header>

      <div className="wrap">
        <div className="howto">
          <div className="ht-t">Chào mừng quý khách 🌿</div>
          <ol>
            <li><b>Chọn</b> phòng, món ăn hoặc dịch vụ — bấm <b>“+ Thêm”</b>.</li>
            <li><b>Mở giỏ</b> ở thanh dưới cùng để xem lại và điền <b>tên + số điện thoại</b>.</li>
            <li>Bấm <b>“Gửi đơn đặt trước”</b> — Maida xác nhận qua Zalo.</li>
          </ol>
        </div>
      </div>

      <nav>
        <div className="zones">
          {ZONES.map((zone, zi) => (
            <button
              key={zone.id}
              type="button"
              className={`zone-tab ${activeZone === zi ? 'active' : ''}`}
              onClick={() => setActiveZone(zi)}
            >
              {zone.name}
              <small>{zone.en}</small>
            </button>
          ))}
        </div>
        <div className={`subnav ${activeZone === 1 ? 'show' : ''}`}>
          {ZONES[1].sections.map((sec, si) => (
            <button
              key={sec.id}
              type="button"
              className="chip"
              onClick={() => document.getElementById(`sec-1-${si}`)?.scrollIntoView({ behavior: 'smooth' })}
            >
              {sec.cat}
            </button>
          ))}
        </div>
      </nav>

      <div className="wrap">
        {ZONES.map((zone, zi) => (
          <div key={zone.id} className={`zonebox ${activeZone === zi ? 'active' : ''}`}>
            {zone.sections.map((sec, si) => (
              <section key={sec.id} id={`sec-${zi}-${si}`}>
                <div className="cat">
                  {sec.cat}
                  <small>{sec.en}</small>
                </div>
                {sec.note && <p className="note" dangerouslySetInnerHTML={{ __html: sec.note }} />}
                {sec.daytype && (
                  <div className="daytype">
                    {(['wd', 'we', 'hol'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        className={`dt ${roomRate === r ? 'active' : ''}`}
                        onClick={() => setRoomRate(r)}
                      >
                        {RATE_LABEL[r]}
                      </button>
                    ))}
                  </div>
                )}
                {sec.items.map((it, ii) => {
                  if (it.g) {
                    return (
                      <div key={`g-${ii}`} className="group-label">
                        {it.g}
                      </div>
                    );
                  }
                  const k = `${zi}-${si}-${ii}`;
                  const q = qty[k] || 0;
                  const up = priceOf(it, roomRate);
                  return (
                    <div key={k} className={`item ${q > 0 ? 'sel' : ''}`}>
                      <div className="info">
                        <div className="name">
                          {it.s ? <span className="star">★</span> : null}
                          {it.vi}
                        </div>
                        {it.en && <div className="en">{it.en}</div>}
                        <div className={`price ${up === null ? 'contact' : ''}`}>
                          {up === null ? 'Liên hệ' : fmt(up)}
                          {it.u && <span className="unit"> {it.u}</span>}
                        </div>
                      </div>
                      <div className={`stepper ${q > 0 ? 'active' : ''}`}>
                        {q === 0 ? (
                          <button type="button" className="add" onClick={() => bump(k, 1)}>
                            + Thêm
                          </button>
                        ) : (
                          <div className="qbox show">
                            <button type="button" className="qbtn" onClick={() => bump(k, -1)}>−</button>
                            <span className="qnum">{q}</span>
                            <button type="button" className="qbtn" onClick={() => bump(k, 1)}>+</button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </section>
            ))}
          </div>
        ))}
      </div>

      <p className="vat">Giá đã bao gồm VAT · Đơn vị: VNĐ · Bảng tạm tính, Maida xác nhận chính thức.</p>

      <div className="foot">
        <a href="https://maidalodge.com/en/" target="_blank" rel="noreferrer">maidalodge.com</a>
        <br />
        Zalo / Hotline: 0982 015 445 · 0971 596 759
      </div>

      {selected.length > 0 && (
        <div className="bar" style={{ display: 'block' }} onClick={() => setDrawerOpen(true)} role="button" tabIndex={0}>
          <div className="bar-inner">
            <div className="bar-l">
              <small>{unitCount} mục · {selected.length} loại</small>
              <b>{fmt(grandTotal)}</b>
            </div>
            <button type="button" className="bar-r" onClick={(e) => { e.stopPropagation(); setDrawerOpen(true); }}>
              Xem giỏ →
            </button>
          </div>
        </div>
      )}

      <div className={`scrim ${drawerOpen ? 'open' : ''}`} onClick={() => setDrawerOpen(false)} />
      <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="drawer-inner">
          <div className="grab" />
          <div className="dh">
            <h2>Yêu cầu của quý khách</h2>
            <button type="button" className="close" onClick={() => setDrawerOpen(false)}>×</button>
          </div>
          <div className="dbody">
            {!selected.length ? (
              <div className="empty">Giỏ đang trống.</div>
            ) : (
              ZONES.map((zone, zi) => {
                const z = selected.filter((x) => +x.key.split('-')[0] === zi);
                if (!z.length) return null;
                return (
                  <div key={zone.id}>
                    <div className="zhead">{zone.name}</div>
                    {z.map((x) => (
                      <div className="srow" key={x.key}>
                        <div className="sinfo">
                          <div className="sname">{x.it.s ? '★ ' : ''}{x.it.vi}</div>
                          <div className="smeta">
                            {x.up === null ? 'Liên hệ báo giá' : fmt(x.up)}
                            {x.it.u ? ' · ' + x.it.u : ''} × {x.q}
                          </div>
                        </div>
                        <div className="mini">
                          <button type="button" onClick={() => bump(x.key, -1)}>−</button>
                          <span>{x.q}</span>
                          <button type="button" onClick={() => bump(x.key, 1)}>+</button>
                        </div>
                        <div className={`sline ${x.line === null ? 'c' : ''}`}>
                          {x.line === null ? 'Liên hệ' : fmt(x.line)}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })
            )}
            <div className="tot">
              <span className="tl">Tạm tính / Subtotal</span>
              <span className="tv">{fmt(grandTotal)}</span>
            </div>
            {contactCount > 0 && (
              <div className="tot-note">* {contactCount} mục &quot;Liên hệ&quot; — Maida sẽ báo giá riêng.</div>
            )}
            <div className="guest">
              <label className="full">
                Họ tên / Name
                <input value={guest.name} onChange={(e) => setGuest({ ...guest, name: e.target.value })} placeholder="VD: Chị Lan" />
              </label>
              <label>
                Số điện thoại / Zalo
                <input value={guest.phone} onChange={(e) => setGuest({ ...guest, phone: e.target.value })} inputMode="tel" />
              </label>
              <label>
                Số khách / Pax
                <input value={guest.pax} onChange={(e) => setGuest({ ...guest, pax: e.target.value })} />
              </label>
              <label className="full">
                Ngày đến – đi / Dates
                <input value={guest.when} onChange={(e) => setGuest({ ...guest, when: e.target.value })} />
              </label>
              <label className="full">
                Ghi chú / Note
                <input value={guest.note} onChange={(e) => setGuest({ ...guest, note: e.target.value })} />
              </label>
            </div>
            <div className="actions">
              <button type="button" className="btn btn-primary" disabled={submitting} onClick={submitOrder}>
                {submitting ? 'Đang gửi…' : 'Gửi đơn đặt trước'}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => { copyText(orderText()); showToast('Đã sao chép yêu cầu'); }}
              >
                Sao chép
              </button>
            </div>
            <div className="hotline">
              <span>Hoặc nhắn Zalo hotline:</span>
              <div className="hl-row">
                <a className="hl" href="https://zalo.me/0982015445" target="_blank" rel="noreferrer">💬 Mai Khanh<br /><b>0982 015 445</b></a>
                <a className="hl" href="https://zalo.me/0971596759" target="_blank" rel="noreferrer">💬 Hà<br /><b>0971 596 759</b></a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </>
  );
}
