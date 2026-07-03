export interface ZoneItem {
  vi?: string;
  en?: string;
  p?: number | null;
  rates?: { wd: number; we: number; hol: number };
  u?: string;
  s?: number;
  g?: string;
}

export interface ZoneSection {
  id: string;
  cat: string;
  en: string;
  note?: string;
  banner?: string;
  daytype?: boolean;
  items: ZoneItem[];
}

export interface Zone {
  id: string;
  name: string;
  en: string;
  sections: ZoneSection[];
}

export interface SelectedItem {
  key: string;
  it: ZoneItem;
  q: number;
  up: number | null;
  line: number | null;
}