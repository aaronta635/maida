'use client';

import { Fragment, useCallback, useEffect, useState } from 'react';
import {
  fetchOrderById,
  fetchOrders,
  fetchTodayStats,
  subscribeToOrders,
  updateOrderStatus,
} from '@/lib/crm/orders';
import type { Order, OrderStatus } from '@/lib/crm/types';
import '@/app/staff/staff.css';

const PAGE = 50;
const fmt = (n: number | null | undefined) =>
  n != null ? n.toLocaleString('vi-VN') + ' ₫' : '–';
const RATE: Record<string, string> = {
  wd: 'Trong tuần',
  we: 'Cuối tuần',
  sat: 'Cuối tuần',
  hol: 'Lễ / Tết',
};
const SLABEL: Record<OrderStatus, string> = {
  pending: 'Chờ XN',
  confirmed: 'Đã XN',
  done: 'Hoàn thành',
  cancelled: 'Đã huỷ',
};

function fromISO(dateRange: string): string | null {
  if (dateRange === 'today') return new Date().toISOString().slice(0, 10) + 'T00:00:00';
  if (dateRange === 'week') {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10) + 'T00:00:00';
  }
  return null;
}

export default function StaffDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState('all');
  const [searchQ, setSearchQ] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [clock, setClock] = useState('');
  const [stats, setStats] = useState({ pending: 0, confirmed: 0, done: 0, revenue: 0, todayTotal: 0 });

  useEffect(() => {
    const tick = () => {
      setClock(
        new Date().toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const loadOrders = useCallback(
    async (reset = true) => {
      const off = reset ? 0 : offset;
      const { orders: rows, hasMore: more } = await fetchOrders({
        offset: off,
        limit: PAGE,
        status: filter,
        search: searchQ,
        fromISO: fromISO(dateRange),
      });
      setOrders((prev) => {
        const merged = reset ? rows : [...prev, ...rows];
        setStats((s) => ({
          ...s,
          pending: merged.filter((o) => o.status === 'pending').length,
          confirmed: merged.filter((o) => o.status === 'confirmed').length,
        }));
        return merged;
      });
      setHasMore(more);
      setOffset(off + PAGE);
      const today = await fetchTodayStats();
      setStats((s) => ({
        ...s,
        done: today.done,
        revenue: today.revenue,
        todayTotal: today.todayTotal,
      }));
    },
    [filter, dateRange, searchQ, offset],
  );

  useEffect(() => {
    loadOrders(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, dateRange, searchQ]);

  useEffect(() => {
    return subscribeToOrders({
      onInsert: async (id) => {
        const row = await fetchOrderById(id);
        if (!row) return;
        setOrders((prev) => [row, ...prev]);
      },
      onUpdate: (row) => {
        setOrders((prev) =>
          prev.map((o) => (o.id === row.id ? { ...o, ...row } : o)),
        );
      },
    });
  }, []);

  async function updStatus(id: string, status: OrderStatus, e: React.MouseEvent) {
    e.stopPropagation();
    const { error } = await updateOrderStatus(id, status);
    if (error) {
      alert('Lỗi: ' + error);
      return;
    }
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  }

  function pill(s: OrderStatus) {
    return <span className={`pill pill-${s}`}>{SLABEL[s]}</span>;
  }

  function detailContent(o: Order) {
    const items = o.order_items ?? [];
    const zones = [...new Set(items.map((i) => i.zone_name))];
    let itemsHtml = zones.map((z) => (
      <div key={z}>
        <div className="zone-hd">{z}</div>
        {items
          .filter((i) => i.zone_name === z)
          .map((i) => (
            <div className="d-row" key={i.id}>
              <div>
                <div className="d-name">{i.item_name_vi}</div>
                <div className="d-meta">
                  {i.unit ? i.unit + ' · ' : ''}× {i.quantity}
                </div>
              </div>
              <div className={`d-amt ${i.line_total == null ? 'c' : ''}`}>
                {i.line_total != null ? fmt(i.line_total) : 'Liên hệ'}
              </div>
            </div>
          ))}
      </div>
    ));
    const phone = (o.customer_phone ?? '').replace(/\s/g, '');
    return (
      <div className="detail-inner">
        <div className="detail-items">
          {itemsHtml.length ? itemsHtml : (
            <div style={{ color: '#9a9484', fontStyle: 'italic', fontSize: 13, padding: '4px 0' }}>
              Không có chi tiết
            </div>
          )}
          {o.note && <div className="d-note">📝 {o.note}</div>}
        </div>
        <div className="detail-acts">
          {o.status === 'pending' && (
            <>
              <button type="button" className="da da-confirm" onClick={(e) => updStatus(o.id, 'confirmed', e)}>✓ Xác nhận</button>
              <button type="button" className="da da-cancel" onClick={(e) => updStatus(o.id, 'cancelled', e)}>Huỷ đơn</button>
            </>
          )}
          {o.status === 'confirmed' && (
            <>
              <button type="button" className="da da-done" onClick={(e) => updStatus(o.id, 'done', e)}>✓ Hoàn thành</button>
              <button type="button" className="da da-cancel" onClick={(e) => updStatus(o.id, 'cancelled', e)}>Huỷ đơn</button>
            </>
          )}
          {phone && (
            <a className="da da-zalo" href={`https://zalo.me/${phone}`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
              💬 Zalo khách
            </a>
          )}
        </div>
      </div>
    );
  }

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
    done: orders.filter((o) => o.status === 'done').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  return (
    <>
      <header>
        <div className="h-brand">Maida Lodge · <em>Quản lý đơn</em></div>
        <div className="h-right">
          <div className="live"><span className="dot" /> Live</div>
          <span id="clock">{clock}</span>
        </div>
      </header>

      <div className="stats">
        <div className="stat s-pending">
          <div className="lbl">Chờ xác nhận</div>
          <div className="val">{counts.pending}</div>
        </div>
        <div className="stat s-confirmed">
          <div className="lbl">Đã xác nhận</div>
          <div className="val">{counts.confirmed}</div>
        </div>
        <div className="stat s-done">
          <div className="lbl">Hoàn thành hôm nay</div>
          <div className="val">{stats.done}</div>
          <div className="sub">trong {stats.todayTotal} đơn hôm nay</div>
        </div>
        <div className="stat s-revenue">
          <div className="lbl">Doanh thu hôm nay</div>
          <div className="val">{fmt(stats.revenue)}</div>
        </div>
      </div>

      <div className="toolbar">
        <div className="search-wrap">
          <input
            placeholder="Tìm tên hoặc SĐT…"
            onChange={(e) => {
              clearTimeout((window as unknown as { _st?: ReturnType<typeof setTimeout> })._st);
              (window as unknown as { _st?: ReturnType<typeof setTimeout> })._st = setTimeout(
                () => setSearchQ(e.target.value.trim()),
                350,
              );
            }}
          />
        </div>
        <div className="ftabs">
          {(['all', 'pending', 'confirmed', 'done', 'cancelled'] as const).map((s) => (
            <button
              key={s}
              type="button"
              className={`ftab ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {s === 'all' ? 'Tất cả' : SLABEL[s]}
              <span className="cnt">{counts[s]}</span>
            </button>
          ))}
        </div>
        <select className="date-sel" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
          <option value="all">Mọi ngày</option>
          <option value="today">Hôm nay</option>
          <option value="week">7 ngày qua</option>
        </select>
      </div>

      <div className="table-wrap">
        <div className="tbl-outer">
          <table>
            <thead>
              <tr>
                <th style={{ width: 80 }}>Giờ</th>
                <th style={{ width: 160 }}>Khách</th>
                <th className="col-meta" style={{ width: 260 }}>Ngày · Khách · Loại ngày</th>
                <th className="r" style={{ width: 130 }}>Tạm tính</th>
                <th style={{ width: 120 }}>Trạng thái</th>
                <th className="r col-acts" style={{ width: 190 }}>Thao tác nhanh</th>
                <th style={{ width: 24 }} />
              </tr>
            </thead>
            <tbody>
              {!orders.length ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 48, color: '#9a9484' }}>
                    Không có đơn nào.
                  </td>
                </tr>
              ) : (
                orders.map((o) => {
                  const isExp = expandedId === o.id;
                  const meta = [o.dates, o.pax ? o.pax + ' khách' : null, o.room_rate_type ? RATE[o.room_rate_type] : null]
                    .filter(Boolean)
                    .join(' · ');
                  const d = new Date(o.created_at);
                  return (
                    <Fragment key={o.id}>
                      <tr
                        className={`order-row${isExp ? ' expanded' : ''}`}
                        onClick={() => setExpandedId(isExp ? null : o.id)}
                      >
                        <td>
                          <div className="time-col">
                            <div className="t">{d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                            <div className="d">{d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</div>
                          </div>
                        </td>
                        <td>
                          <div className="name-col">
                            <div className="n">{o.customer_name || '(Chưa có tên)'}</div>
                            <div className="p">{o.customer_phone ?? ''}</div>
                          </div>
                        </td>
                        <td className="col-meta meta-col">
                          <b>{(o.order_items ?? []).length} mục</b>
                          {meta ? ' · ' + meta : ''}
                        </td>
                        <td className="r total-col">
                          {fmt(o.subtotal)}
                          {o.has_contact_items && <div className="cq">+ Liên hệ</div>}
                        </td>
                        <td>{pill(o.status)}</td>
                        <td className="col-acts">
                          {o.status === 'pending' && (
                            <div className="inline-acts">
                              <button type="button" className="ia ia-confirm" onClick={(e) => updStatus(o.id, 'confirmed', e)}>✓ Xác nhận</button>
                              <button type="button" className="ia ia-cancel" onClick={(e) => updStatus(o.id, 'cancelled', e)}>Huỷ</button>
                            </div>
                          )}
                          {o.status === 'confirmed' && (
                            <div className="inline-acts">
                              <button type="button" className="ia ia-done" onClick={(e) => updStatus(o.id, 'done', e)}>✓ Xong</button>
                              <button type="button" className="ia ia-cancel" onClick={(e) => updStatus(o.id, 'cancelled', e)}>Huỷ</button>
                            </div>
                          )}
                        </td>
                        <td><span className="chev">▾</span></td>
                      </tr>
                      <tr className={`detail-row${isExp ? ' open' : ''}`}>
                        <td colSpan={7}>{isExp ? detailContent(o) : null}</td>
                      </tr>
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {hasMore && (
          <div className="load-more-wrap">
            <button type="button" onClick={() => loadOrders(false)}>Xem thêm đơn ↓</button>
          </div>
        )}
      </div>
    </>
  );
}
