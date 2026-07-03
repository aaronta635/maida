import type { SaleItem } from '@/data/sale-types';
import type { ComputeResult, QuoteLine } from '@/data/sale-types';
import { BUCKETS, SECT2BUCKET, SECT_ORDER, TIERS, type RoomTier } from './constants';

export const fmt = (n: number) => (n || 0).toLocaleString('vi-VN') + ' ₫';

export function fmtD(s: string) {
  if (!s) return '—';
  const [y, m, d] = s.split('-');
  return `${d}/${m}/${y}`;
}

export function norm(s: string) {
  return (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .toLowerCase();
}

export function nightsBetween(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;
  const d = (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000;
  return d > 0 ? Math.round(d) : 0;
}

export function addDays(s: string, i: number) {
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + i);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

export function tierOfDate(s: string, holi: Set<string>): RoomTier {
  if (holi.has(s)) return 'hol';
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d).getDay() === 6 ? 'sat' : 'wd';
}

export function nightBreakdown(checkIn: string, checkOut: string, holi: Set<string>) {
  const n = nightsBetween(checkIn, checkOut);
  const r = { wd: 0, sat: 0, hol: 0, total: n, list: [] as { date: string; tier: RoomTier }[] };
  if (!checkIn || !n) return r;
  for (let i = 0; i < n; i++) {
    const dt = addDays(checkIn, i);
    const t = tierOfDate(dt, holi);
    r[t]++;
    r.list.push({ date: dt, tier: t });
  }
  return r;
}

export function roomTierTotals(cart: Record<string, number>) {
  const r = { wd: 0, sat: 0, hol: 0, any: false };
  Object.keys(cart).forEach((k) => {
    if (k.includes('@')) {
      const t = k.split('@')[1] as RoomTier;
      if (r[t] != null) {
        r[t] += cart[k];
        r.any = true;
      }
    }
  });
  return r;
}

export interface AuditResult {
  lvl: 'none' | 'info' | 'ok' | 'warn';
  bd: ReturnType<typeof nightBreakdown>;
  w: string[];
}

export function auditTiers(
  checkIn: string,
  checkOut: string,
  cart: Record<string, number>,
  holi: Set<string>,
): AuditResult {
  const bd = nightBreakdown(checkIn, checkOut, holi);
  const rt = roomTierTotals(cart);
  const w: string[] = [];
  if (!rt.any) return { lvl: 'none', bd, w };
  if (!bd.total)
    return { lvl: 'info', bd, w: ['Chưa chọn ngày đến/đi nên chưa kiểm tra được mức giá theo lịch.'] };
  (['sat', 'hol'] as const).forEach((t) => {
    if (rt[t] > 0 && bd[t] === 0)
      w.push(
        `Phiếu đang tính mức "${TIERS[t]}" nhưng lịch ${fmtD(checkIn)} → ${fmtD(checkOut)} không có đêm nào thuộc mức này.`,
      );
    if (bd[t] > 0 && rt[t] === 0)
      w.push(
        `Lịch có ${bd[t]} đêm "${TIERS[t]}" nhưng phiếu chưa có dòng phòng nào tính mức này — nhiều khả năng đang tính nhầm sang giá thấp hơn.`,
      );
  });
  if (bd.wd > 0 && rt.wd === 0 && (rt.sat > 0 || rt.hol > 0))
    w.push(`Lịch có ${bd.wd} đêm ngày thường nhưng phiếu đang tính toàn bộ ở mức cao hơn.`);
  return { lvl: w.length ? 'warn' : 'ok', bd, w };
}

export interface CustomLine {
  id: string;
  name: string;
  price: number;
  qty: number;
  sect: string;
}

export interface DiscountInput {
  discType: 'none' | 'percent' | 'amount' | 'partial';
  discVal: number;
  discLabel: string;
  depPct: number;
  bucketDisc: Record<string, string>;
}

export function computeQuote(
  cart: Record<string, number>,
  customItems: CustomLine[],
  items: Record<string, SaleItem>,
  nights: number,
  discount: DiscountInput,
): ComputeResult {
  let sub = 0;
  const lines: QuoteLine[] = [];

  Object.keys(cart).forEach((key) => {
    const q = cart[key];
    if (key.includes('@')) {
      const [id, tier] = key.split('@');
      const it = items[id];
      if (!it?.rates) return;
      const up = it.rates[tier as keyof typeof it.rates];
      const cost = up * q;
      sub += cost;
      lines.push({
        name: `${it.name} — ${TIERS[tier as RoomTier]}`,
        qtyDesc: `${q} đêm × ${fmt(up)}`,
        cost,
        sect: it.sect || '',
        unit: up,
        qnum: q,
        bucket: 'phong',
      });
    } else {
      const it = items[key];
      if (!it) return;
      const cost = it.perNight ? (it.price || 0) * q * (nights || 0) : (it.price || 0) * q;
      sub += cost;
      const qtyDesc = it.perNight
        ? `${q} khách × ${nights || 0} đêm × ${fmt(it.price || 0)}`
        : `${q} ${(it.unit || '').replace('/', '')} × ${fmt(it.price || 0)}`;
      const bucket =
        it.sect === 'PHÒNG' ? 'phuthu' : SECT2BUCKET[it.sect || ''] || 'phatsinh';
      lines.push({
        name: it.name,
        qtyDesc,
        cost,
        sect: it.sect || '',
        unit: it.price || 0,
        qnum: it.perNight ? q * (nights || 0) : q,
        bucket,
      });
    }
  });

  customItems.forEach((it) => {
    const cost = it.price * it.qty;
    sub += cost;
    lines.push({
      name: it.name,
      qtyDesc: `${it.qty} × ${fmt(it.price)}`,
      cost,
      sect: it.sect || 'PHÁT SINH',
      unit: it.price,
      qnum: it.qty,
      bucket: SECT2BUCKET[it.sect] || 'phatsinh',
    });
  });

  const byBucket: Record<string, number> = {};
  lines.forEach((l) => {
    byBucket[l.bucket] = (byBucket[l.bucket] || 0) + l.cost;
  });

  const { discType, discVal, discLabel, depPct, bucketDisc } = discount;
  let disc = 0;
  const discounts: ComputeResult['discounts'] = [];

  if (discType === 'percent') {
    const a = Math.min(Math.round((sub * discVal) / 100), sub);
    if (a > 0) discounts.push({ label: 'Ưu đãi' + (discLabel ? ` (${discLabel})` : ''), detail: `−${discVal}%`, amount: a });
    disc = a;
  } else if (discType === 'amount') {
    const a = Math.min(discVal, sub);
    if (a > 0) discounts.push({ label: 'Ưu đãi' + (discLabel ? ` (${discLabel})` : ''), detail: '', amount: a });
    disc = a;
  } else if (discType === 'partial') {
    BUCKETS.forEach((b) => {
      const st = byBucket[b.key] || 0;
      const pct = parseFloat(bucketDisc[b.key]) || 0;
      if (st > 0 && pct > 0) {
        const a = Math.min(Math.round((st * pct) / 100), st);
        if (a > 0) discounts.push({ label: 'Giảm ' + b.labelShort, detail: `−${pct}%`, amount: a });
        disc += a;
      }
    });
    disc = Math.min(disc, sub);
  }

  const total = sub - disc;
  const dep = Math.round((total * depPct) / 100);
  return { sub, disc, total, dep, depPct, lines, discounts, byBucket };
}

export function groupLines(lines: QuoteLine[]) {
  const map: Record<string, QuoteLine[]> = {};
  lines.forEach((l) => {
    (map[l.sect] = map[l.sect] || []).push(l);
  });
  const order = [...SECT_ORDER];
  Object.keys(map).forEach((s) => {
    if (!order.includes(s)) order.push(s);
  });
  return order
    .filter((s) => map[s]?.length)
    .map((s) => ({ sect: s, lines: map[s], subtotal: map[s].reduce((a, l) => a + l.cost, 0) }));
}

export function ascii(s: string) {
  return (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export function genCode(checkIn: string, customerName: string) {
  let p = '';
  if (checkIn) {
    const [y, m, d] = checkIn.split('-');
    p = `${d}${m}${y.slice(2)}`;
  } else {
    const t = new Date();
    p = `${String(t.getDate()).padStart(2, '0')}${String(t.getMonth() + 1).padStart(2, '0')}${String(t.getFullYear()).slice(2)}`;
  }
  const nm = ascii(customerName).trim().split(/\s+/).filter(Boolean);
  const last = nm.length ? nm[nm.length - 1] : '';
  return p + (last ? last.slice(0, 2).toUpperCase() : '');
}

export function roomNightsTotal(cart: Record<string, number>) {
  let s = 0;
  Object.keys(cart).forEach((k) => {
    if (k.includes('@')) s += cart[k];
  });
  return s;
}

function crc16(s: string) {
  let c = 0xffff;
  for (let i = 0; i < s.length; i++) {
    c ^= s.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      c = c & 0x8000 ? ((c << 1) ^ 0x1021) : c << 1;
      c &= 0xffff;
    }
  }
  return c.toString(16).toUpperCase().padStart(4, '0');
}

function tlv(id: string, v: string) {
  return id + String(v.length).padStart(2, '0') + v;
}

export function buildVietQR(bin: string, acc: string, amount: number, info: string) {
  const mai = tlv('00', 'A000000727') + tlv('01', tlv('00', bin) + tlv('01', acc)) + tlv('02', 'QRIBFTTA');
  let s = tlv('00', '01') + tlv('01', amount ? '12' : '11') + tlv('38', mai) + tlv('52', '0000') + tlv('53', '704');
  if (amount) s += tlv('54', String(amount));
  s += tlv('58', 'VN') + tlv('59', 'MAIDA LODGE');
  if (info) s += tlv('62', tlv('08', info.slice(0, 99)));
  return s + '6304' + crc16(s + '6304');
}

export function buildQuoteText(
  r: ComputeResult,
  customer: { name: string; phone: string; adt: number; chd: number; checkIn: string; checkOut: string },
) {
  const n = nightsBetween(customer.checkIn, customer.checkOut);
  const groups = groupLines(r.lines);
  let t = '════════════════════════════\n   MAIDA LODGE — PHIẾU TẠM TÍNH\n   Hồ Hòa Bình · Tiền Phong · Phú Thọ\n════════════════════════════\n';
  t += `Khách: ${customer.name}\n`;
  if (customer.phone) t += `SĐT/Zalo: ${customer.phone}\n`;
  t += `Số khách: ${customer.adt} người lớn` + (customer.chd > 0 ? ` · ${customer.chd} trẻ em` : '') + '\n';
  t += `Ngày: ${fmtD(customer.checkIn)} → ${fmtD(customer.checkOut)}` + (n ? ` (${n} đêm)` : '') + '\n────────────────────────────\n';
  if (!groups.length) t += '(chưa chọn mục nào)\n';
  else
    groups.forEach((grp) => {
      t += `【 ${grp.sect} 】\n`;
      grp.lines.forEach((l) => {
        t += `• ${l.name}\n   ${l.qtyDesc} = ${fmt(l.cost)}\n`;
      });
      if (groups.length > 1) t += `   ▸ Cộng ${grp.sect.toLowerCase()}: ${fmt(grp.subtotal)}\n`;
      t += '\n';
    });
  t += '────────────────────────────\n' + `Tạm tính:  ${fmt(r.sub)}\n`;
  r.discounts.forEach((d) => {
    t += `${d.label}${d.detail ? ' ' + d.detail : ''}: − ${fmt(d.amount)}\n`;
  });
  t += `TỔNG CỘNG: ${fmt(r.total)}\nĐặt cọc ${r.depPct}%: ${fmt(r.dep)}\n════════════════════════════\n`;
  t += 'Bảng TẠM TÍNH; Maida xác nhận chính thức khi đặt. Giá gồm VAT.\nNhận phòng 14h · Trả phòng 11h · Zalo: 0982 015 445 · 0971 596 759';
  return t;
}

export function buildInvoiceText(
  r: ComputeResult,
  customer: { name: string; phone: string; checkIn: string; checkOut: string },
  invoice: { code: string; bookBy: string },
  bank: { name: string; acc: string; bank: string },
) {
  const n = nightsBetween(customer.checkIn, customer.checkOut);
  const groups = groupLines(r.lines);
  const remain = r.total - r.dep;
  let t = '════════════════════════════\n   MAIDA LODGE — PHIẾU THU / INVOICE\n════════════════════════════\n';
  t += `Mã đặt phòng: ${invoice.code}\nKhách: ${customer.name}` + (customer.phone ? ` · ${customer.phone}` : '') + '\n';
  t += `Nhận phòng: ${fmtD(customer.checkIn)} 14h · Trả phòng: ${fmtD(customer.checkOut)} 11h` + (n ? ` (${n} đêm)` : '') + '\n────────────────────────────\n';
  let i = 0;
  groups.forEach((g) =>
    g.lines.forEach((l) => {
      i++;
      t += `${i}. ${l.name}\n   ${fmt(l.unit)} × ${l.qnum} = ${fmt(l.cost)}\n`;
    }),
  );
  t += '────────────────────────────\n' + `Tổng tiền: ${fmt(r.sub)}\n`;
  r.discounts.forEach((d) => {
    t += `${d.label}${d.detail ? ' ' + d.detail : ''}: − ${fmt(d.amount)}\n`;
  });
  t += `TỔNG CỘNG: ${fmt(r.total)}\nĐặt cọc ${r.depPct}%: ${fmt(r.dep)}\nCòn lại (check-out): ${fmt(remain)}\n════════════════════════════\n`;
  t += `CHUYỂN KHOẢN ĐẶT CỌC:\n${bank.name}\nSTK: ${bank.acc} — ${bank.bank}\nND: ${invoice.bookBy} ${invoice.code} Đặt cọc phòng\nSố tiền: ${fmt(r.dep)}\n────────────────────────────\n`;
  t += 'Hóa đơn đã gồm VAT, xuất khi check-out (báo trước 24h). Zalo: 0982 015 445 · 0971 596 759 · maidalodge.com';
  return t;
}
