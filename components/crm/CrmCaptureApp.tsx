'use client';

import { useState } from 'react';
import {
  buildCheckinRow,
  buildDepositRow,
  buildFeedbackRow,
  copyCrmRow,
} from '@/lib/crm/capture';
import '@/app/crm/capture/capture.css';

type Tab = 'coc' | 'checkin' | 'danhgia';

function StarRow({
  max,
  value,
  onChange,
  allowZero,
}: {
  max: number;
  value: number;
  onChange: (v: number) => void;
  allowZero?: boolean;
}) {
  const start = allowZero ? 0 : 1;
  return (
    <div className="stars">
      {Array.from({ length: max - start + 1 }, (_, i) => start + i).map((n) => (
        <button
          key={n}
          type="button"
          className={value >= n ? 'sel' : ''}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

export default function CrmCaptureApp() {
  const [tab, setTab] = useState<Tab>('coc');
  const [toast, setToast] = useState('');
  const [outBox, setOutBox] = useState<{ id: string; text: string } | null>(null);

  const [coc, setCoc] = useState({
    sdt: '', ten: '', ma: '', loai: '', in: '', out: '', pax: '', phong: '',
    tong: '', cocAmt: '', kenh: '', note: '', sale: '',
  });
  const [checkin, setCheckin] = useState({
    sdt: '', ten: '', ma: '', loai: '', in: '', out: '', pax: '',
    dip: '', note: '', dongy: '', le: '',
  });
  const [feedback, setFeedback] = useState({
    sdt: '', ma: '', cmt: '', pub: '',
  });
  const [stars, setStars] = useState({ nps: -1, room: 0, food: 0, service: 0, boat: 0 });

  function showToast(m: string) {
    setToast(m);
    setTimeout(() => setToast(''), 2600);
  }

  async function saveRow(row: string, boxId: string) {
    setOutBox({ id: boxId, text: row });
    await copyCrmRow(row, showToast);
  }

  function saveCoc() {
    if (!coc.sdt) return showToast('Nhập SĐT khách');
    if (!coc.cocAmt) return showToast('Nhập tiền cọc');
    saveRow(buildDepositRow({
      ma: coc.ma, sdt: coc.sdt, ten: coc.ten, loai: coc.loai,
      checkIn: coc.in, checkOut: coc.out, pax: coc.pax, phong: coc.phong,
      tong: coc.tong, coc: coc.cocAmt, kenh: coc.kenh, note: coc.note, sale: coc.sale,
    }), 'c_out');
  }

  function saveCheckin() {
    if (!checkin.sdt) return showToast('Nhập SĐT thật của khách');
    if (!checkin.dongy) return showToast('Chọn đồng ý liên hệ (Có/Không)');
    saveRow(buildCheckinRow({
      ma: checkin.ma, sdt: checkin.sdt, ten: checkin.ten, loai: checkin.loai,
      checkIn: checkin.in, checkOut: checkin.out, pax: checkin.pax,
      dip: checkin.dip, note: checkin.note, dongy: checkin.dongy, letan: checkin.le,
    }), 'k_out');
  }

  function saveFeedback() {
    if (!feedback.sdt) return showToast('Nhập SĐT khách');
    if (stars.nps < 0) return showToast('Chọn điểm NPS (0–10)');
    saveRow(buildFeedbackRow({
      sdt: feedback.sdt, ma: feedback.ma, nps: stars.nps,
      room: stars.room, food: stars.food, service: stars.service, boat: stars.boat,
      comment: feedback.cmt, publish: feedback.pub,
    }), 'g_out');
  }

  return (
    <>
      <header>
        <h1>🌿 Maida · Nhập liệu CRM</h1>
        <p>Nội bộ · Sale & Lễ tân — điền xong bấm Lưu, dán vào bảng CRM (hoặc tự đồng bộ nếu đã cấu hình)</p>
      </header>

      <div className="tabs">
        {(['coc', 'checkin', 'danhgia'] as Tab[]).map((t) => (
          <div
            key={t}
            className={`tab ${tab === t ? 'on' : ''}`}
            onClick={() => setTab(t)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setTab(t)}
          >
            {t === 'coc' ? '💰 Đặt cọc' : t === 'checkin' ? '🛎️ Check-in' : '⭐ Đánh giá'}
          </div>
        ))}
      </div>

      <div className="wrap">
        {tab === 'coc' && (
          <div className="panel">
            <p className="hint">Ghi nhận khi khách chuyển cọc → bảng <b>Đơn hàng</b> (Trạng thái: Đã cọc).</p>
            <label>SĐT / Zalo <span className="req">*</span></label>
            <input value={coc.sdt} onChange={(e) => setCoc({ ...coc, sdt: e.target.value })} inputMode="tel" placeholder="09xx xxx xxx" />
            <div className="row2">
              <div><label>Tên khách</label><input value={coc.ten} onChange={(e) => setCoc({ ...coc, ten: e.target.value })} /></div>
              <div><label>Mã đặt phòng</label><input value={coc.ma} onChange={(e) => setCoc({ ...coc, ma: e.target.value })} placeholder="nếu có" /></div>
            </div>
            <label>Loại khách</label>
            <select value={coc.loai} onChange={(e) => setCoc({ ...coc, loai: e.target.value })}>
              <option value="">—</option>
              {['Lẻ / cặp đôi', 'Gia đình', 'Đoàn', 'Sự kiện / cưới hỏi', 'Doanh nghiệp'].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <div className="row2">
              <div><label>Nhận phòng</label><input type="date" value={coc.in} onChange={(e) => setCoc({ ...coc, in: e.target.value })} /></div>
              <div><label>Trả phòng</label><input type="date" value={coc.out} onChange={(e) => setCoc({ ...coc, out: e.target.value })} /></div>
            </div>
            <div className="row2">
              <div><label>Số khách</label><input value={coc.pax} onChange={(e) => setCoc({ ...coc, pax: e.target.value })} placeholder="VD: 2 NL · 1 trẻ" /></div>
              <div><label>Phòng / Combo</label><input value={coc.phong} onChange={(e) => setCoc({ ...coc, phong: e.target.value })} placeholder="VD: Bungalow Vườn ×1" /></div>
            </div>
            <div className="row2">
              <div><label>Tổng báo giá (đ)</label><input value={coc.tong} onChange={(e) => setCoc({ ...coc, tong: e.target.value })} inputMode="numeric" placeholder="0" /></div>
              <div><label>Tiền cọc (đ) <span className="req">*</span></label><input value={coc.cocAmt} onChange={(e) => setCoc({ ...coc, cocAmt: e.target.value })} inputMode="numeric" placeholder="0" /></div>
            </div>
            <label>Kênh thanh toán</label>
            <select value={coc.kenh} onChange={(e) => setCoc({ ...coc, kenh: e.target.value })}>
              <option value="">—</option>
              {['Tiền mặt', 'Chuyển khoản', 'Thẻ'].map((o) => <option key={o}>{o}</option>)}
            </select>
            <label>Ghi chú</label>
            <textarea value={coc.note} onChange={(e) => setCoc({ ...coc, note: e.target.value })} placeholder="Yêu cầu riêng, thoả thuận giá…" />
            <label>Sale phụ trách</label>
            <input value={coc.sale} onChange={(e) => setCoc({ ...coc, sale: e.target.value })} placeholder="Tên Sale" />
            <button type="button" className="save" onClick={saveCoc}>💾 Lưu cọc → sao chép dòng CRM</button>
            {outBox?.id === 'c_out' && <div className="out" style={{ display: 'block' }}>{outBox.text}</div>}
          </div>
        )}

        {tab === 'checkin' && (
          <div className="panel">
            <p className="hint">Ghi nhận khi khách đến → bảng <b>Đơn hàng</b> (Trạng thái: Đã ở).</p>
            <label>SĐT thật của khách <span className="req">*</span></label>
            <input value={checkin.sdt} onChange={(e) => setCheckin({ ...checkin, sdt: e.target.value })} inputMode="tel" />
            <div className="row2">
              <div><label>Tên khách</label><input value={checkin.ten} onChange={(e) => setCheckin({ ...checkin, ten: e.target.value })} /></div>
              <div><label>Mã đặt phòng</label><input value={checkin.ma} onChange={(e) => setCheckin({ ...checkin, ma: e.target.value })} /></div>
            </div>
            <div className="row2">
              <div>
                <label>Loại khách</label>
                <select value={checkin.loai} onChange={(e) => setCheckin({ ...checkin, loai: e.target.value })}>
                  <option value="">—</option>
                  {['Lẻ / cặp đôi', 'Gia đình', 'Đoàn', 'Sự kiện / cưới hỏi', 'Doanh nghiệp'].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div><label>Số khách</label><input value={checkin.pax} onChange={(e) => setCheckin({ ...checkin, pax: e.target.value })} /></div>
            </div>
            <div className="row2">
              <div><label>Nhận phòng</label><input type="date" value={checkin.in} onChange={(e) => setCheckin({ ...checkin, in: e.target.value })} /></div>
              <div><label>Trả phòng</label><input type="date" value={checkin.out} onChange={(e) => setCheckin({ ...checkin, out: e.target.value })} /></div>
            </div>
            <label>Dịp đặc biệt</label>
            <select value={checkin.dip} onChange={(e) => setCheckin({ ...checkin, dip: e.target.value })}>
              <option value="">—</option>
              {['Sinh nhật', 'Kỷ niệm', 'Tuần trăng mật', 'Team building', 'Khác'].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <label>Ghi chú · Dị ứng · Sở thích</label>
            <textarea value={checkin.note} onChange={(e) => setCheckin({ ...checkin, note: e.target.value })} />
            <label>Đồng ý nhận ưu đãi/liên hệ (NĐ 13/2023) <span className="req">*</span></label>
            <select value={checkin.dongy} onChange={(e) => setCheckin({ ...checkin, dongy: e.target.value })}>
              <option value="">—</option>
              <option>Có</option>
              <option>Không</option>
            </select>
            <label>Lễ tân phụ trách</label>
            <input value={checkin.le} onChange={(e) => setCheckin({ ...checkin, le: e.target.value })} />
            <button type="button" className="save" onClick={saveCheckin}>💾 Lưu check-in → sao chép dòng CRM</button>
            {outBox?.id === 'k_out' && <div className="out" style={{ display: 'block' }}>{outBox.text}</div>}
          </div>
        )}

        {tab === 'danhgia' && (
          <div className="panel">
            <p className="hint">Sau check-out → bảng <b>Góp ý</b>.</p>
            <div className="row2">
              <div><label>SĐT khách <span className="req">*</span></label><input value={feedback.sdt} onChange={(e) => setFeedback({ ...feedback, sdt: e.target.value })} /></div>
              <div><label>Mã đặt phòng</label><input value={feedback.ma} onChange={(e) => setFeedback({ ...feedback, ma: e.target.value })} /></div>
            </div>
            <label>NPS — Khả năng giới thiệu Maida (0–10) <span className="req">*</span></label>
            <StarRow max={10} value={stars.nps} onChange={(n) => setStars({ ...stars, nps: n })} allowZero />
            <label>Phòng & không gian</label>
            <StarRow max={5} value={stars.room} onChange={(n) => setStars({ ...stars, room: n })} />
            <label>Ẩm thực</label>
            <StarRow max={5} value={stars.food} onChange={(n) => setStars({ ...stars, food: n })} />
            <label>Dịch vụ & nhân viên</label>
            <StarRow max={5} value={stars.service} onChange={(n) => setStars({ ...stars, service: n })} />
            <label>Tàu đưa đón</label>
            <StarRow max={5} value={stars.boat} onChange={(n) => setStars({ ...stars, boat: n })} />
            <label>Cảm nhận / góp ý</label>
            <textarea value={feedback.cmt} onChange={(e) => setFeedback({ ...feedback, cmt: e.target.value })} />
            <label>Cho phép Maida đăng đánh giá công khai?</label>
            <select value={feedback.pub} onChange={(e) => setFeedback({ ...feedback, pub: e.target.value })}>
              <option value="">—</option>
              <option>Có</option>
              <option>Không</option>
            </select>
            <button type="button" className="save" onClick={saveFeedback}>💾 Lưu đánh giá → sao chép dòng CRM</button>
            {outBox?.id === 'g_out' && <div className="out" style={{ display: 'block' }}>{outBox.text}</div>}
          </div>
        )}
      </div>

      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </>
  );
}
