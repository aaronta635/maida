'use client';

import { useCallback, useMemo, useState } from 'react';
import type { SaleGroup, SaleItem } from '@/data/sale-types';
import { buildLeadTsvRow } from '@/lib/crm/capture';
import { saveLeadToCrm } from '@/lib/crm/orders';
import type { RoomRateType } from '@/lib/crm/types';
import {
  applyStoredOverrides,
  buildItemsIndex,
  cloneCatalog,
  clearPriceOverrides,
  savePriceOverrides,
} from '@/lib/crm/sale/catalog';
import {
  BANK_DEFAULT,
  HOLI_DEFAULT,
  LS_BANK,
  LS_HOLI,
  type RoomTier,
} from '@/lib/crm/sale/constants';
import {
  auditTiers,
  computeQuote,
  genCode,
  nightBreakdown,
  nightsBetween,
  type CustomLine,
  type DiscountInput,
} from '@/lib/crm/sale/engine';
import { RAW_SALE_DATA } from '@/lib/crm/sale/raw-catalog';

export interface CustomerForm {
  name: string;
  phone: string;
  source: string;
  checkIn: string;
  checkOut: string;
  adt: number;
  chd: number;
}

export interface InvoiceForm {
  code: string;
  bookBy: string;
  agent: string;
  rooms: string;
  receiverSel: string;
  receiverCustom: string;
  hold: string;
}

function loadHoli(): Set<string> {
  if (typeof window === 'undefined') return new Set(HOLI_DEFAULT);
  try {
    const r = localStorage.getItem(LS_HOLI);
    if (r) {
      const a = JSON.parse(r);
      if (Array.isArray(a)) return new Set(a);
    }
  } catch {
    /* ignore */
  }
  return new Set(HOLI_DEFAULT);
}

function loadBank() {
  if (typeof window === 'undefined') return { ...BANK_DEFAULT };
  try {
    const r = localStorage.getItem(LS_BANK);
    if (r) return { ...BANK_DEFAULT, ...JSON.parse(r) };
  } catch {
    /* ignore */
  }
  return { ...BANK_DEFAULT };
}

export function useSaleTool() {
  const [{ data, items }, setCatalog] = useState(() => cloneCatalog());
  const [activeGroup, setActiveGroup] = useState(data[0]?.group || 'Phòng');
  const [roomTier, setRoomTier] = useState<RoomTier>('wd');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [customItems, setCustomItems] = useState<CustomLine[]>([]);
  const [search, setSearch] = useState('');
  const [holi, setHoli] = useState<Set<string>>(loadHoli);
  const [bank, setBank] = useState(loadBank);
  const [priceModalOpen, setPriceModalOpen] = useState(false);
  const [quoteMode, setQuoteMode] = useState<'estimate' | 'invoice'>('estimate');
  const [toast, setToast] = useState('');
  const [savingLead, setSavingLead] = useState(false);

  const [customer, setCustomer] = useState<CustomerForm>({
    name: '',
    phone: '',
    source: '',
    checkIn: '',
    checkOut: '',
    adt: 2,
    chd: 0,
  });

  const [invoice, setInvoice] = useState<InvoiceForm>({
    code: '',
    bookBy: '',
    agent: 'Trực tiếp',
    rooms: '',
    receiverSel: 'Thu Hà',
    receiverCustom: '',
    hold: '24',
  });

  const [discount, setDiscount] = useState<DiscountInput>({
    discType: 'none',
    discVal: 0,
    discLabel: '',
    depPct: 50,
    bucketDisc: {
      phong: '',
      phuthu: '',
      combo: '',
      food: '',
      dichvu: '',
      vanchuyen: '',
      phatsinh: '',
    },
  });

  const nights = useMemo(
    () => nightsBetween(customer.checkIn, customer.checkOut),
    [customer.checkIn, customer.checkOut],
  );

  const result = useMemo(
    () => computeQuote(cart, customItems, items, nights, discount),
    [cart, customItems, items, nights, discount],
  );

  const audit = useMemo(
    () => auditTiers(customer.checkIn, customer.checkOut, cart, holi),
    [customer.checkIn, customer.checkOut, cart, holi],
  );

  const showToast = useCallback((m: string) => {
    setToast(m);
    setTimeout(() => setToast(''), 2200);
  }, []);

  const chg = useCallback((id: string, d: number) => {
    setCart((prev) => {
      const next = { ...prev };
      const v = Math.max(0, (next[id] || 0) + d);
      if (v <= 0) delete next[id];
      else next[id] = v;
      return next;
    });
  }, []);

  const setQ = useCallback((id: string, v: number) => {
    setCart((prev) => {
      const next = { ...prev };
      if (v <= 0) delete next[id];
      else next[id] = v;
      return next;
    });
  }, []);

  const chgRoom = useCallback(
    (id: string, d: number) => {
      const key = id + '@' + roomTier;
      setCart((prev) => {
        const next = { ...prev };
        const cur = next[key] || 0;
        let nv = cur === 0 && d > 0 ? nights || 1 : Math.max(0, cur + d);
        if (nv <= 0) delete next[key];
        else next[key] = nv;
        return next;
      });
    },
    [roomTier, nights],
  );

  const setQRoom = useCallback(
    (id: string, v: number) => {
      const key = id + '@' + roomTier;
      setCart((prev) => {
        const next = { ...prev };
        if (v <= 0) delete next[key];
        else next[key] = v;
        return next;
      });
    },
    [roomTier],
  );

  const addRoomByCalendar = useCallback(
    (id: string) => {
      const bd = nightBreakdown(customer.checkIn, customer.checkOut, holi);
      if (!bd.total) {
        showToast('Chọn ngày đến & ngày đi trước');
        return;
      }
      setCart((prev) => {
        const next = { ...prev };
        (['wd', 'sat', 'hol'] as const).forEach((t) => {
          const k = id + '@' + t;
          if (bd[t] > 0) next[k] = bd[t];
          else delete next[k];
        });
        return next;
      });
      showToast(`Đã xếp ${bd.total} đêm theo lịch`);
    },
    [customer.checkIn, customer.checkOut, holi, showToast],
  );

  const addCustom = useCallback(
    (name: string, price: number, qty: number, sect = 'NHÀ HÀNG') => {
      if (!name) {
        showToast('Nhập tên món/mục');
        return;
      }
      if (price <= 0) {
        showToast('Nhập đơn giá');
        return;
      }
      setCustomItems((prev) => [
        ...prev,
        { id: 'c' + Date.now(), name, price, qty, sect },
      ]);
    },
    [showToast],
  );

  const addAsk = useCallback(
    (item: SaleItem, price: number, qty: number) => {
      if (price <= 0) {
        showToast('Nhập đơn giá đã thoả thuận');
        return;
      }
      setCustomItems((prev) => [
        ...prev,
        { id: 'c' + Date.now(), name: item.name, price, qty, sect: item.sect || 'PHÁT SINH' },
      ]);
      showToast('Đã thêm vào phiếu');
    },
    [showToast],
  );

  const resetAll = useCallback(() => {
    if (!confirm('Làm mới toàn bộ phiếu (xoá khách & các mục đã chọn)?')) return;
    setCart({});
    setCustomItems([]);
    setRoomTier('wd');
    setCustomer({ name: '', phone: '', source: '', checkIn: '', checkOut: '', adt: 2, chd: 0 });
    setInvoice({
      code: '',
      bookBy: '',
      agent: 'Trực tiếp',
      rooms: '',
      receiverSel: 'Thu Hà',
      receiverCustom: '',
      hold: '24',
    });
    setDiscount({
      discType: 'none',
      discVal: 0,
      discLabel: '',
      depPct: 50,
      bucketDisc: {
        phong: '',
        phuthu: '',
        combo: '',
        food: '',
        dichvu: '',
        vanchuyen: '',
        phatsinh: '',
      },
    });
  }, []);

  const savePrices = useCallback(
    (edits: Record<string, Partial<SaleItem>>, holiLines: string, bankEdit: typeof BANK_DEFAULT) => {
      const newData = JSON.parse(JSON.stringify(data)) as SaleGroup[];
      const newItems = buildItemsIndex(newData);
      Object.entries(edits).forEach(([id, patch]) => {
        const it = newItems[id];
        if (!it) return;
        if (patch.rates && it.rates) Object.assign(it.rates, patch.rates);
        if (typeof patch.price === 'number') it.price = patch.price;
      });
      applyStoredOverrides(newItems);
      savePriceOverrides(newItems);

      const arr = holiLines
        .split(/\n+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => {
          const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
          return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : null;
        })
        .filter(Boolean) as string[];
      const newHoli = new Set(arr);
      setHoli(newHoli);
      localStorage.setItem(LS_HOLI, JSON.stringify([...newHoli]));

      const newBank = { ...bankEdit };
      setBank(newBank);
      localStorage.setItem(LS_BANK, JSON.stringify(newBank));

      setCatalog({ data: newData, items: newItems });
      setPriceModalOpen(false);
      showToast('Đã lưu bảng giá');
    },
    [data, showToast],
  );

  const restoreDefaults = useCallback(() => {
    if (!confirm('Khôi phục toàn bộ giá về mặc định?')) return;
    clearPriceOverrides();
    setCatalog(cloneCatalog());
    window.location.reload();
  }, []);

  const receiverName = useCallback(() => {
    return invoice.receiverSel === '__custom'
      ? invoice.receiverCustom.trim()
      : invoice.receiverSel;
  }, [invoice]);

  const saveLead = useCallback(async () => {
    const phone = customer.phone.trim();
    if (!phone) {
      showToast('Nhập SĐT khách trước khi lưu lead');
      return;
    }
    if (!customer.source) {
      showToast('Chọn Nguồn khách để lưu lead');
      return;
    }
    setSavingLead(true);
    const rateMap: Record<RoomTier, RoomRateType> = { wd: 'wd', sat: 'we', hol: 'hol' };
    const code = invoice.code || genCode(customer.checkIn, customer.name);
    const { ok, error } = await saveLeadToCrm({
      customerName: customer.name.trim(),
      customerPhone: phone,
      source: customer.source,
      checkIn: customer.checkIn,
      checkOut: customer.checkOut,
      adults: customer.adt,
      children: customer.chd,
      roomTier: rateMap[roomTier],
      subtotal: result.total,
      lines: result.lines.map((l) => ({
        zone_id: (l.sect || '').toLowerCase().replace(/\s+/g, '_'),
        zone_name: l.sect || 'Khác',
        item_name_vi: l.name,
        unit: l.qtyDesc,
        unit_price: l.unit,
        quantity: l.qnum,
        line_total: l.cost,
      })),
    });
    setSavingLead(false);
    const tsv = buildLeadTsvRow({
      code,
      phone,
      name: customer.name.trim(),
      source: customer.source,
      loai: customer.chd > 0 ? 'Gia đình' : '',
      checkIn: customer.checkIn,
      checkOut: customer.checkOut,
      nights,
      guests: customer.adt + ' NL' + (customer.chd > 0 ? ' · ' + customer.chd + ' trẻ' : ''),
      items: result.lines.map((l) => l.name).join(' · '),
      total: result.total,
      sale: receiverName() || invoice.bookBy,
    });
    try {
      await navigator.clipboard.writeText(tsv);
    } catch {
      /* ignore */
    }
    if (ok) showToast('✓ Đã lưu lead vào Supabase');
    else {
      showToast('Lỗi Supabase — đã sao chép TSV để dán thủ công');
      console.error(error);
    }
  }, [customer, invoice, nights, receiverName, result, roomTier, showToast]);

  return {
    data,
    items,
    activeGroup,
    setActiveGroup,
    roomTier,
    setRoomTier,
    cart,
    customItems,
    setCustomItems,
    search,
    setSearch,
    holi,
    bank,
    customer,
    setCustomer,
    invoice,
    setInvoice,
    discount,
    setDiscount,
    nights,
    result,
    audit,
    quoteMode,
    setQuoteMode,
    priceModalOpen,
    setPriceModalOpen,
    toast,
    showToast,
    chg,
    setQ,
    chgRoom,
    setQRoom,
    addRoomByCalendar,
    addCustom,
    addAsk,
    resetAll,
    savePrices,
    restoreDefaults,
    receiverName,
    saveLead,
    savingLead,
  };
}

export type SaleToolState = ReturnType<typeof useSaleTool>;
