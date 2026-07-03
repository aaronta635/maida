import type { SaleGroup, SaleItem } from '@/data/sale-types';
import { RAW_SALE_DATA } from './raw-catalog';
import { LS_KEY } from './constants';

export function buildItemsIndex(data: SaleGroup[]): Record<string, SaleItem> {
  const items: Record<string, SaleItem> = {};
  data.forEach((g) =>
    g.cats.forEach((c) =>
      c.items.forEach((it) => {
        const item: SaleItem = {
          ...it,
          group: g.group,
          cat: c.cat,
          sect: c.sect || g.sect,
        };
        items[it.id] = item;
      }),
    ),
  );
  return items;
}

export function cloneCatalog(): { data: SaleGroup[]; items: Record<string, SaleItem> } {
  const data = JSON.parse(JSON.stringify(RAW_SALE_DATA)) as SaleGroup[];
  const items = buildItemsIndex(data);
  applyStoredOverrides(items);
  return { data, items };
}

export function applyStoredOverrides(items: Record<string, SaleItem>) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;
    const o = JSON.parse(raw) as Record<string, { rates?: Record<string, number>; price?: number }>;
    Object.keys(o).forEach((id) => {
      const it = items[id];
      if (!it) return;
      if (it.rates && o[id].rates) {
        (['wd', 'sat', 'hol'] as const).forEach((t) => {
          if (typeof o[id].rates![t] === 'number') it.rates![t] = o[id].rates![t];
        });
      } else if (typeof o[id].price === 'number') {
        it.price = o[id].price;
      }
    });
  } catch {
    /* ignore */
  }
}

export function savePriceOverrides(items: Record<string, SaleItem>) {
  const o: Record<string, { rates?: Record<string, number>; price?: number }> = {};
  Object.keys(items).forEach((id) => {
    const it = items[id];
    o[id] = it.rates
      ? { rates: { wd: it.rates.wd, sat: it.rates.sat, hol: it.rates.hol } }
      : { price: it.price };
  });
  localStorage.setItem(LS_KEY, JSON.stringify(o));
}

export function clearPriceOverrides() {
  localStorage.removeItem(LS_KEY);
}
