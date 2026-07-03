'use client';

import { Fragment, useMemo, useRef } from 'react';
import type { ComputeResult } from '@/data/sale-types';
import { BUCKETS, INV_NOTES } from '@/lib/crm/sale/constants';
import {
  ascii,
  buildInvoiceText,
  buildQuoteText,
  buildVietQR,
  fmt,
  fmtD,
  genCode,
  groupLines,
  roomNightsTotal,
} from '@/lib/crm/sale/engine';
import { LOGO_INV } from '@/lib/crm/sale/logo';
import type { SaleToolState } from '@/hooks/useSaleTool';
import SaleAuditBanner from './SaleAuditBanner';
import VietQr from './VietQr';

declare global {
  interface Window {
    html2canvas?: (
      el: HTMLElement,
      opts?: Record<string, unknown>,
    ) => Promise<HTMLCanvasElement>;
  }
}

function loadH2C(): Promise<void> {
  if (typeof window !== 'undefined' && window.html2canvas) return Promise.resolve();
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    s.onload = () => res();
    s.onerror = () => rej();
    document.head.appendChild(s);
  });
}

function todayStr() {
  const t = new Date();
  return `${String(t.getDate()).padStart(2, '0')}/${String(t.getMonth() + 1).padStart(2, '0')}/${t.getFullYear()}`;
}

export default function SaleQuotePanel({ tool }: { tool: SaleToolState }) {
  const {
    customer,
    invoice,
    setInvoice,
    discount,
    setDiscount,
    nights,
    result,
    audit,
    quoteMode,
    setQuoteMode,
    bank,
    receiverName,
    showToast,
  } = tool;

  const cardRef = useRef<HTMLDivElement>(null);

  const name = customer.name.trim() || '(chưa nhập tên)';
  const code = invoice.code || genCode(customer.checkIn, customer.name);
  const bookBy = invoice.bookBy || name;
  const agent = invoice.agent || 'Trực tiếp';
  const rooms =
    invoice.rooms ||
    (nights
      ? String(Math.round(roomNightsTotal(tool.cart) / Math.max(nights, 1)) || '')
      : String(roomNightsTotal(tool.cart) || '')) ||
    '—';
  const receiver = receiverName();
  const hold = invoice.hold || '24';

  const quoteText = useMemo(
    () =>
      quoteMode === 'invoice'
        ? buildInvoiceText(result, customer, { code, bookBy }, bank)
        : buildQuoteText(result, customer),
    [quoteMode, result, customer, code, bookBy, bank],
  );

  const ctContent = `${bookBy} ${code} Đặt cọc phòng`;
  const qrPayload = buildVietQR(
    bank.bin,
    bank.acc,
    result.dep > 0 ? result.dep : 0,
    ascii(ctContent),
  );

  async function downloadImage() {
    const card = cardRef.current?.querySelector('.qcard') as HTMLElement | null;
    if (!card) {
      showToast('Chưa có phiếu');
      return;
    }
    showToast('Đang tạo ảnh…');
    try {
      await loadH2C();
    } catch {
      showToast('Không tải được công cụ ảnh — kiểm tra mạng');
      return;
    }
    const clone = card.cloneNode(true) as HTMLElement;
    clone.classList.add('shot');
    const holder = document.createElement('div');
    holder.style.cssText = 'position:fixed;left:-10000px;top:0;width:720px;background:#fff;';
    clone.style.width = '720px';
    clone.style.maxWidth = '720px';
    clone.style.borderRadius = '0';
    holder.appendChild(clone);
    document.body.appendChild(holder);
    let canvas: HTMLCanvasElement;
    try {
      canvas = await window.html2canvas!(clone, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      });
    } catch {
      document.body.removeChild(holder);
      showToast('Lỗi tạo ảnh');
      return;
    }
    document.body.removeChild(holder);
    const nm =
      (customer.name || 'khach')
        .replace(/[^\p{L}0-9 ]/gu, '')
        .trim()
        .replace(/\s+/g, '_')
        .slice(0, 28) || 'khach';
    const fn =
      quoteMode === 'invoice' ? `Maida_PhieuThu_${nm}.png` : `Maida_TamTinh_${nm}.png`;
    canvas.toBlob((blob) => {
      if (!blob) {
        showToast('Lỗi tạo ảnh');
        return;
      }
      const file = new File([blob], fn, { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        navigator
          .share({
            files: [file],
            title:
              quoteMode === 'invoice'
                ? 'Maida Lodge — Phiếu thu'
                : 'Maida Lodge — Phiếu tạm tính',
          })
          .then(() => showToast('Đã mở chia sẻ'))
          .catch(() => dlBlob(blob, fn));
      } else dlBlob(blob, fn);
    }, 'image/png');
  }

  function dlBlob(blob: Blob, fn: string) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fn;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
    showToast('Đã tải ảnh phiếu');
  }

  async function copyQuote() {
    try {
      await navigator.clipboard.writeText(quoteText);
      showToast('Đã sao chép — dán vào Zalo');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = quoteText;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        showToast('Đã sao chép');
      } catch {
        showToast('Không sao chép được');
      }
      document.body.removeChild(ta);
    }
  }

  return (
    <>
      <div className="seg-quote no-print">
        <button
          type="button"
          className={quoteMode === 'estimate' ? 'active' : ''}
          onClick={() => setQuoteMode('estimate')}
        >
          🧾 Tạm tính
        </button>
        <button
          type="button"
          className={quoteMode === 'invoice' ? 'active' : ''}
          onClick={() => setQuoteMode('invoice')}
        >
          📑 Phiếu thu
        </button>
      </div>

      {quoteMode === 'invoice' && (
        <div className="inv-fields no-print">
          <div className="grid2">
            <div className="field">
              <label>Mã đặt phòng</label>
              <input
                value={invoice.code}
                onChange={(e) => setInvoice((p) => ({ ...p, code: e.target.value }))}
                placeholder="tự tạo"
              />
            </div>
            <div className="field">
              <label>Người đặt</label>
              <input
                value={invoice.bookBy}
                onChange={(e) => setInvoice((p) => ({ ...p, bookBy: e.target.value }))}
                placeholder="theo tên khách"
              />
            </div>
            <div className="field">
              <label>Đại lý / Agent</label>
              <input
                value={invoice.agent}
                onChange={(e) => setInvoice((p) => ({ ...p, agent: e.target.value }))}
                placeholder="Trực tiếp"
              />
            </div>
            <div className="field">
              <label>Số phòng</label>
              <input
                type="number"
                min={0}
                value={invoice.rooms}
                onChange={(e) => setInvoice((p) => ({ ...p, rooms: e.target.value }))}
                placeholder="tự tính"
              />
            </div>
            <div className="field">
              <label>Người xác nhận (Quản lý bán hàng)</label>
              <select
                value={invoice.receiverSel}
                onChange={(e) =>
                  setInvoice((p) => ({ ...p, receiverSel: e.target.value }))
                }
              >
                <option value="Thu Hà">Thu Hà</option>
                <option value="Mai Khanh">Mai Khanh</option>
                <option value="__custom">Tự điền…</option>
              </select>
            </div>
            <div className="field">
              <label>Cọc giữ phòng (giờ)</label>
              <input
                type="number"
                min={0}
                value={invoice.hold}
                onChange={(e) => setInvoice((p) => ({ ...p, hold: e.target.value }))}
              />
            </div>
            {invoice.receiverSel === '__custom' && (
              <div className="field">
                <label>Tên người xác nhận</label>
                <input
                  value={invoice.receiverCustom}
                  onChange={(e) =>
                    setInvoice((p) => ({ ...p, receiverCustom: e.target.value }))
                  }
                  placeholder="Nhập tên"
                />
              </div>
            )}
          </div>
          <div className="hint" style={{ marginTop: 8 }}>
            Mã & người đặt tự điền theo khách — sửa được. “Số phòng” tự ước theo số
            đêm-phòng đã chọn. Số tài khoản nhận tiền sửa trong <b>⚙︎ Sửa giá</b>.
          </div>
        </div>
      )}

      <h2 className="sec no-print">Ưu đãi</h2>
      <div className="panel no-print">
        <div className="disc-row">
          <div className="field">
            <label>Loại ưu đãi</label>
            <select
              value={discount.discType}
              onChange={(e) =>
                setDiscount((p) => ({
                  ...p,
                  discType: e.target.value as typeof discount.discType,
                }))
              }
            >
              <option value="none">Không ưu đãi</option>
              <option value="percent">Giảm theo % (toàn bộ)</option>
              <option value="amount">Giảm số tiền (đ)</option>
              <option value="partial">Giảm từng phần (theo nhóm)</option>
            </select>
          </div>
          {discount.discType !== 'partial' && (
            <div className="field">
              <label>Giá trị</label>
              <input
                type="number"
                min={0}
                value={discount.discVal || ''}
                onChange={(e) =>
                  setDiscount((p) => ({ ...p, discVal: parseInt(e.target.value) || 0 }))
                }
              />
            </div>
          )}
          <div className="field">
            <label>Nhãn ưu đãi</label>
            <input
              value={discount.discLabel}
              onChange={(e) => setDiscount((p) => ({ ...p, discLabel: e.target.value }))}
              placeholder="VD: Đặt sớm, khách quen…"
            />
          </div>
        </div>

        {discount.discType === 'partial' && (
          <div className="disc-partial no-print">
            <div className="pd-head">
              <span>Nhóm hạng mục</span>
              <span>Tạm tính</span>
              <span>Giảm %</span>
            </div>
            {BUCKETS.map((b) => {
              const st = result.byBucket[b.key] || 0;
              if (st <= 0) return null;
              return (
                <div key={b.key} className="pd-row">
                  <div className="pd-lbl">{b.label}</div>
                  <div className="pd-sub">{fmt(st)}</div>
                  <input
                    className="pd-inp"
                    type="number"
                    min={0}
                    max={100}
                    value={discount.bucketDisc[b.key] || ''}
                    onChange={(e) =>
                      setDiscount((p) => ({
                        ...p,
                        bucketDisc: { ...p.bucketDisc, [b.key]: e.target.value },
                      }))
                    }
                    placeholder="0"
                  />
                </div>
              );
            })}
          </div>
        )}

        <div className="field" style={{ marginTop: 10, maxWidth: 150 }}>
          <label>Đặt cọc (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={discount.depPct}
            onChange={(e) =>
              setDiscount((p) => ({ ...p, depPct: parseInt(e.target.value) || 0 }))
            }
          />
        </div>
      </div>

      <h2 className="sec no-print">
        {quoteMode === 'invoice' ? 'Phiếu thu / Invoice' : 'Phiếu tạm tính'}
      </h2>

      <div className="no-print">
        <SaleAuditBanner audit={audit} />
      </div>

      <div id="quoteCard" ref={cardRef}>
        {quoteMode === 'invoice' ? (
          <InvoiceCard
            result={result}
            name={name}
            phone={customer.phone}
            adt={customer.adt}
            chd={customer.chd}
            checkIn={customer.checkIn}
            checkOut={customer.checkOut}
            code={code}
            bookBy={bookBy}
            agent={agent}
            rooms={rooms}
            receiver={receiver}
            hold={hold}
            bank={bank}
            ctContent={ctContent}
            qrPayload={qrPayload}
          />
        ) : (
          <EstimateCard
            result={result}
            name={name}
            phone={customer.phone}
            adt={customer.adt}
            chd={customer.chd}
            checkIn={customer.checkIn}
            checkOut={customer.checkOut}
            nights={nights}
          />
        )}
      </div>

      <div
        style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}
        className="no-print"
      >
        <button type="button" className="btn-primary" onClick={downloadImage}>
          {quoteMode === 'invoice'
            ? '📷 Tải ảnh phiếu thu (gửi Zalo)'
            : '📷 Tải ảnh phiếu (gửi Zalo)'}
        </button>
        <button type="button" className="btn-ghost" onClick={() => window.print()}>
          🖨️ In / Lưu PDF
        </button>
        <button type="button" className="btn-ghost" onClick={copyQuote}>
          📋 Sao chép chữ
        </button>
      </div>
      <div className="hint no-print">
        Ảnh phiếu nét, khách dễ xem trên Zalo/Messenger. Trên điện thoại, “Tải ảnh” sẽ mở
        luôn cửa sổ chia sẻ.
      </div>
    </>
  );
}

function EstimateCard({
  result,
  name,
  phone,
  adt,
  chd,
  checkIn,
  checkOut,
  nights,
}: {
  result: ComputeResult;
  name: string;
  phone: string;
  adt: number;
  chd: number;
  checkIn: string;
  checkOut: string;
  nights: number;
}) {
  const groups = groupLines(result.lines);
  const td = todayStr();

  return (
    <div className="qcard">
      <div className="qc-top">
        <div>
          <div className="qc-brand">
            Maida <span>Lodge</span>
          </div>
          <div className="qc-loc">HỒ HOÀ BÌNH · TIỀN PHONG · PHÚ THỌ</div>
        </div>
        <div className="qc-doc">
          <div className="t">PHIẾU TẠM TÍNH</div>
          <div className="d">{td}</div>
        </div>
      </div>
      <div className="qc-body">
        <div className="qc-cust">
          <div className="full">
            <span className="k">Khách</span>
            <span className="v">{name}</span>
          </div>
          {phone && (
            <div>
              <span className="k">SĐT / Zalo</span>
              <span className="v">{phone}</span>
            </div>
          )}
          <div>
            <span className="k">Số khách</span>
            <span className="v">
              {adt} người lớn{chd > 0 ? ` · ${chd} trẻ em` : ''}
            </span>
          </div>
          <div>
            <span className="k">Ngày đến → đi</span>
            <span className="v">
              {fmtD(checkIn)} → {fmtD(checkOut)}
            </span>
          </div>
          <div>
            <span className="k">Số đêm</span>
            <span className="v">{nights || '—'} đêm</span>
          </div>
        </div>
        <table className="qc-tbl">
          <thead>
            <tr>
              <th>Hạng mục</th>
              <th className="num">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {groups.length === 0 ? (
              <tr>
                <td colSpan={2} style={{ color: '#9a9484', padding: '14px 4px' }}>
                  (chưa chọn mục nào)
                </td>
              </tr>
            ) : (
              groups.map((grp) => (
                <Fragment key={grp.sect}>
                  <tr className="sect">
                    <td>{grp.sect}</td>
                    <td className="num" />
                  </tr>
                  {grp.lines.map((l, i) => (
                    <tr key={grp.sect + '-' + i}>
                      <td>
                        {l.name}
                        <div className="sub">{l.qtyDesc}</div>
                      </td>
                      <td className="num">{fmt(l.cost)}</td>
                    </tr>
                  ))}
                  {groups.length > 1 && (
                    <tr className="subt">
                      <td>Cộng {grp.sect.toLowerCase()}</td>
                      <td className="num">{fmt(grp.subtotal)}</td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
        <div className="qc-tot">
          <div className="r">
            <span>Tạm tính</span>
            <span>{fmt(result.sub)}</span>
          </div>
          {result.discounts.map((d, i) => (
            <div key={i} className="r disc">
              <span>
                {d.label}
                {d.detail ? ' ' + d.detail : ''}
              </span>
              <span>− {fmt(d.amount)}</span>
            </div>
          ))}
          <div className="r grand">
            <span>TỔNG CỘNG</span>
            <span>{fmt(result.total)}</span>
          </div>
          <div className="r dep">
            <span>Đặt cọc {result.depPct}%</span>
            <span>{fmt(result.dep)}</span>
          </div>
        </div>
      </div>
      <div className="qc-foot">
        <b>Bảng tạm tính</b> — Maida xác nhận chính thức khi đặt · Giá đã gồm VAT (VNĐ) ·
        Nhận phòng 14h00 · Trả phòng 11h00.
        <br />
        <span className="hot">Đặt phòng / Zalo: 0982 015 445 · 0971 596 759</span> ·
        maidalodge.com
      </div>
    </div>
  );
}

function InvoiceCard({
  result,
  name,
  phone,
  adt,
  chd,
  checkIn,
  checkOut,
  code,
  bookBy,
  agent,
  rooms,
  receiver,
  hold,
  bank,
  ctContent,
  qrPayload,
}: {
  result: ComputeResult;
  name: string;
  phone: string;
  adt: number;
  chd: number;
  checkIn: string;
  checkOut: string;
  code: string;
  bookBy: string;
  agent: string;
  rooms: string;
  receiver: string;
  hold: string;
  bank: { name: string; acc: string; bank: string };
  ctContent: string;
  qrPayload: string;
}) {
  const groups = groupLines(result.lines);
  const flat = groups.flatMap((g) => g.lines);
  const remain = result.total - result.dep;
  const td = todayStr();

  return (
    <div className="qcard invoice">
      <div className="inv-top">
        <div className="inv-co">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="logo" src={LOGO_INV} alt="Maida Lodge" />
          <div className="legal">CÔNG TY TNHH TTH MAI ĐÀ</div>
          <div className="addr">
            Xóm Đoàn Kết, xã Tiền Phong, tỉnh Phú Thọ
            <br />
            VPĐD: Số 99B, Ngõ 275 Âu Cơ, Tây Hồ, Hà Nội
            <br />
            maidalodge.com · info@maidalodge.com · 0971 596 759 · 0982 015 445
          </div>
        </div>
        <div className="inv-doc">
          <div className="t">
            PHIẾU THU<span>INVOICE</span>
          </div>
          <div className="meta">
            Mã: <b>{code}</b>
            <br />
            Ngày: <b>{td}</b>
          </div>
        </div>
      </div>
      <div className="qc-body">
        <div className="inv-grid">
          <div>
            <span className="k">Tên đoàn / Khách</span>
            <span className="v">{name}</span>
          </div>
          <div>
            <span className="k">Đại lý</span>
            <span className="v">{agent}</span>
          </div>
          <div>
            <span className="k">Người đặt</span>
            <span className="v">{bookBy}</span>
          </div>
          <div>
            <span className="k">Điện thoại</span>
            <span className="v">{phone || '—'}</span>
          </div>
          <div>
            <span className="k">Số khách</span>
            <span className="v">
              {adt} người lớn{chd > 0 ? ` · ${chd} trẻ em` : ''}
            </span>
          </div>
          <div>
            <span className="k">Số phòng</span>
            <span className="v">{rooms}</span>
          </div>
          <div>
            <span className="k">Nhận phòng</span>
            <span className="v">{fmtD(checkIn)} · 14h00</span>
          </div>
          <div>
            <span className="k">Trả phòng</span>
            <span className="v">{fmtD(checkOut)} · 11h00</span>
          </div>
        </div>
        <table className="inv-tbl">
          <thead>
            <tr>
              <th className="c">#</th>
              <th>Diễn giải</th>
              <th className="num">Đơn giá</th>
              <th className="num">SL</th>
              <th className="num">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {flat.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ color: '#9a9484', padding: '14px 4px' }}>
                  (chưa chọn mục nào)
                </td>
              </tr>
            ) : (
              flat.map((l, i) => (
                <tr key={i}>
                  <td className="c">{i + 1}</td>
                  <td>{l.name}</td>
                  <td className="num">{fmt(l.unit)}</td>
                  <td className="num">{l.qnum}</td>
                  <td className="num">{fmt(l.cost)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="inv-tot">
          <div className="r">
            <span>Tổng tiền</span>
            <span>{fmt(result.sub)}</span>
          </div>
          {result.discounts.length ? (
            result.discounts.map((d, i) => (
              <div key={i} className="r">
                <span>
                  {d.label}
                  {d.detail ? ' ' + d.detail : ''}
                </span>
                <span>− {fmt(d.amount)}</span>
              </div>
            ))
          ) : (
            <div className="r small">
              <span>Giảm giá</span>
              <span>—</span>
            </div>
          )}
          <div className="r grand">
            <span>TỔNG CỘNG</span>
            <span>{fmt(result.total)}</span>
          </div>
          <div className="r dep">
            <span>
              Đặt cọc {result.depPct}% (giữ phòng {hold}h)
            </span>
            <span>{fmt(result.dep)}</span>
          </div>
          <div className="r small">
            <span>Còn lại — thanh toán khi check-out</span>
            <span>{fmt(remain)}</span>
          </div>
        </div>
        <div className="inv-pay">
          <div className="bk">
            <div className="ttl">Thông tin chuyển khoản</div>
            <div>{bank.name}</div>
            <div className="acc">{bank.acc}</div>
            <div>
              <b>{bank.bank}</b>
            </div>
            <div>
              Nội dung: <span className="ct">{ctContent}</span>
            </div>
            <div>
              Số tiền cọc: <b>{fmt(result.dep)}</b>
            </div>
          </div>
          <VietQr payload={qrPayload} />
        </div>
        <div className="inv-sign">
          <div>
            <div className="lbl">Người trả / Payer</div>
            <div className="sp" />
            <div className="nm">{bookBy}</div>
          </div>
          <div>
            <div className="lbl">Người xác nhận (Quản lý bán hàng)</div>
            <div className="sp" />
            <div className="nm">{receiver}</div>
          </div>
        </div>
      </div>
      <div className="inv-notes">
        <div className="vat">
          Hóa đơn đã bao gồm VAT — Maida xuất trong ngày check-out (vui lòng báo trước
          24h hoặc khi nhận phòng tại quầy Lễ Tân).
        </div>
        <ul>
          {INV_NOTES.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
