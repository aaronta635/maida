'use client';

import { useEffect } from 'react';
import { useSaleTool } from '@/hooks/useSaleTool';
import { fmt } from '@/lib/crm/sale/engine';
import '@/app/crm/sale/sale.css';
import SaleGroupPanel from './SaleGroupPanel';
import SalePriceModal from './SalePriceModal';
import SaleQuotePanel from './SaleQuotePanel';

const PHIẾU_TAB = 'Phiếu';

const SOURCE_OPTIONS = [
  '',
  'Zalo OA',
  'Facebook',
  'OTA (Booking/Agoda)',
  'Giới thiệu',
  'Website',
  'Walk-in',
  'Khác',
];

export default function SaleToolApp() {
  const tool = useSaleTool();
  const {
    data,
    activeGroup,
    setActiveGroup,
    customer,
    setCustomer,
    nights,
    result,
    priceModalOpen,
    setPriceModalOpen,
    resetAll,
    saveLead,
    savingLead,
    toast,
  } = tool;

  const isQuoteTab = activeGroup === PHIẾU_TAB;
  const currentGroup = data.find((g) => g.group === activeGroup);

  useEffect(() => {
    if (toast) {
      const el = document.getElementById('sale-toast');
      if (el) {
        el.classList.add('show');
        const t = setTimeout(() => el.classList.remove('show'), 2200);
        return () => clearTimeout(t);
      }
    }
  }, [toast]);

  function showTab(g: string) {
    setActiveGroup(g);
    if (g === PHIẾU_TAB) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const discLabel =
    result.discounts.length > 1
      ? 'Ưu đãi (từng phần)'
      : result.discounts[0]
        ? result.discounts[0].label +
          (result.discounts[0].detail ? ' ' + result.discounts[0].detail : '')
        : 'Ưu đãi';

  return (
    <>
      <header>
        <div className="wrap">
          <div className="h-left">
            <span className="h-title">Maida Lodge · Tạm tính</span>
            <span className="badge-internal">NỘI BỘ</span>
          </div>
          <div className="h-btns">
            <button
              type="button"
              className="h-btn"
              title="Sửa giá & ngày lễ"
              onClick={() => setPriceModalOpen(true)}
            >
              ⚙︎ Sửa giá
            </button>
            <button type="button" className="h-btn" title="Làm mới phiếu" onClick={resetAll}>
              ↺ Làm mới
            </button>
          </div>
        </div>
      </header>

      <div className="wrap">
        <div className="note-banner">
          <span>ℹ️</span>
          <div>
            <b>Công cụ nội bộ cho Sale — không gửi trực tiếp cho khách.</b> Giá theo{' '}
            <b>Bảng giá Maida 2026 (đã gồm 8% VAT)</b>; phòng áp dụng{' '}
            <b>mùa hè 25/04 → 02/09/2026</b> (3 mức: trong tuần / T7 / lễ-tết). Mùa khác
            hoặc cập nhật ngày lễ: bấm <b>⚙︎ Sửa giá</b>.
          </div>
        </div>

        <div id="customerPanel">
          <h2 className="sec">Thông tin khách</h2>
          <div className="panel">
            <div className="grid2">
              <div className="field">
                <label>Tên khách (bên liên hệ)</label>
                <input
                  value={customer.name}
                  onChange={(e) => setCustomer((p) => ({ ...p, name: e.target.value }))}
                  placeholder="VD: Anh Minh – đoàn 8 khách"
                />
              </div>
              <div className="field">
                <label>SĐT / Zalo</label>
                <input
                  inputMode="tel"
                  value={customer.phone}
                  onChange={(e) => setCustomer((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="09xx xxx xxx"
                />
              </div>
            </div>
            <div className="field" style={{ marginTop: 10 }}>
              <label>Nguồn khách (CRM)</label>
              <select
                value={customer.source}
                onChange={(e) => setCustomer((p) => ({ ...p, source: e.target.value }))}
              >
                {SOURCE_OPTIONS.map((o) => (
                  <option key={o || 'empty'} value={o}>
                    {o || '— chọn nguồn —'}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid3" style={{ marginTop: 10 }}>
              <div className="field">
                <label>Ngày đến</label>
                <input
                  type="date"
                  value={customer.checkIn}
                  onChange={(e) => setCustomer((p) => ({ ...p, checkIn: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>Ngày đi</label>
                <input
                  type="date"
                  value={customer.checkOut}
                  onChange={(e) => setCustomer((p) => ({ ...p, checkOut: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>Số khách (NL / trẻ em)</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    type="number"
                    min={0}
                    title="Người lớn"
                    value={customer.adt}
                    onChange={(e) =>
                      setCustomer((p) => ({ ...p, adt: parseInt(e.target.value) || 0 }))
                    }
                  />
                  <input
                    type="number"
                    min={0}
                    title="Trẻ em"
                    value={customer.chd}
                    onChange={(e) =>
                      setCustomer((p) => ({ ...p, chd: parseInt(e.target.value) || 0 }))
                    }
                  />
                </div>
              </div>
            </div>
            <div>
              <span className="nights-tag">
                Số đêm: {nights > 0 ? nights : '—'}
              </span>
            </div>
          </div>
        </div>

        <div className="tabs">
          {data.map((g) => (
            <button
              key={g.group}
              type="button"
              className={`tab ${activeGroup === g.group ? 'active' : ''}`}
              onClick={() => showTab(g.group)}
            >
              {g.ico} {g.group}
            </button>
          ))}
          <button
            type="button"
            className={`tab ${isQuoteTab ? 'active' : ''}`}
            onClick={() => showTab(PHIẾU_TAB)}
          >
            🧾 Phiếu
          </button>
        </div>

        {!isQuoteTab && currentGroup && <SaleGroupPanel tool={tool} group={currentGroup} />}

        {isQuoteTab && (
          <div id="quoteSection">
            <SaleQuotePanel tool={tool} />
          </div>
        )}
      </div>

      <div className="summary">
        <div className="wrap sum-grid">
          <div className="sum-lines">
            <div className="r">
              <span>Tạm tính</span>
              <span>{fmt(result.sub)}</span>
            </div>
            {result.disc > 0 && (
              <div className="r disc">
                <span>{discLabel}</span>
                <span>− {fmt(result.disc)}</span>
              </div>
            )}
            <div className="r total">
              <span>TỔNG CỘNG</span>
              <b>{fmt(result.total)}</b>
            </div>
            <div className="r" style={{ fontSize: 11.5 }}>
              <span>Cọc {result.depPct}%</span>
              <span>{fmt(result.dep)}</span>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 8,
              flexDirection: 'column',
              alignItems: 'stretch',
            }}
          >
            <button type="button" className="btn-primary" onClick={() => showTab(PHIẾU_TAB)}>
              Xem phiếu →
            </button>
            <button
              type="button"
              onClick={saveLead}
              disabled={savingLead}
              style={{
                background: '#B8965A',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '9px 14px',
                fontWeight: 700,
                cursor: savingLead ? 'wait' : 'pointer',
                fontSize: 13,
                opacity: savingLead ? 0.7 : 1,
              }}
            >
              {savingLead ? 'Đang lưu…' : '📋 Lưu lead CRM'}
            </button>
          </div>
        </div>
      </div>

      <SalePriceModal
        tool={tool}
        open={priceModalOpen}
        onClose={() => setPriceModalOpen(false)}
      />

      <div className={`toast ${toast ? 'show' : ''}`} id="sale-toast">
        {toast}
      </div>
    </>
  );
}
