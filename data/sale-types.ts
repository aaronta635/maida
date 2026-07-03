export interface SaleItem {
  id: string;
  name: string;
  unit?: string;
  price?: number;
  rates?: { wd: number; sat: number; hol: number };
  room?: number;
  perNight?: number;
  desc?: string;
  askPrice?: number;
  note?: string;
  group?: string;
  cat?: string;
  sect?: string;
}

export interface SaleCategory {
  cat: string;
  rooms?: number;
  custom?: number;
  sect?: string;
  items: SaleItem[];
}

export interface SaleGroup {
  group: string;
  ico: string;
  sect: string;
  cats: SaleCategory[];
}

export interface QuoteLine {
  name: string;
  qtyDesc: string;
  cost: number;
  sect: string;
  unit: number;
  qnum: number;
  bucket: string;
}

export interface ComputeResult {
  sub: number;
  disc: number;
  total: number;
  dep: number;
  depPct: number;
  lines: QuoteLine[];
  discounts: { label: string; detail: string; amount: number }[];
  byBucket: Record<string, number>;
}
