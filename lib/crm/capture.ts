const CRM_ENDPOINT = process.env.NEXT_PUBLIC_CRM_ENDPOINT ?? '';

export function tsvRow(cols: (string | number | null | undefined)[]): string {
  return cols
    .map((c) => String(c == null ? '' : c).replace(/[\t\n\r]/g, ' '))
    .join('\t');
}

export async function copyCrmRow(
  row: string,
  onSuccess?: (msg: string) => void,
): Promise<void> {
  try {
    await navigator.clipboard.writeText(row);
    onSuccess?.('Đã sao chép — dán vào bảng CRM');
  } catch {
    const ta = document.createElement('textarea');
    ta.value = row;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      onSuccess?.('Đã sao chép');
    } catch {
      onSuccess?.('Bấm giữ để chọn & copy thủ công');
    }
    document.body.removeChild(ta);
  }

  if (CRM_ENDPOINT) {
    try {
      await fetch(CRM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ row }),
      });
    } catch {
      /* webhook optional */
    }
  }
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function nightsBetween(a: string, b: string): number | '' {
  if (!a || !b) return '';
  const d = (new Date(b).getTime() - new Date(a).getTime()) / 86400000;
  return d > 0 ? Math.round(d) : '';
}

/** 19-column Đơn hàng row for deposit */
export function buildDepositRow(fields: {
  ma: string;
  sdt: string;
  ten: string;
  loai: string;
  checkIn: string;
  checkOut: string;
  pax: string;
  phong: string;
  tong: string;
  coc: string;
  kenh: string;
  note: string;
  sale: string;
}): string {
  return tsvRow([
    fields.ma,
    fields.sdt,
    fields.ten,
    '',
    fields.loai,
    todayISO(),
    'Đã cọc',
    fields.checkIn,
    fields.checkOut,
    nightsBetween(fields.checkIn, fields.checkOut),
    fields.pax,
    fields.phong,
    fields.tong,
    fields.coc,
    fields.kenh,
    '',
    fields.note,
    '',
    fields.sale,
  ]);
}

/** 19-column Đơn hàng row for check-in */
export function buildCheckinRow(fields: {
  ma: string;
  sdt: string;
  ten: string;
  loai: string;
  checkIn: string;
  checkOut: string;
  pax: string;
  dip: string;
  note: string;
  dongy: string;
  letan: string;
}): string {
  return tsvRow([
    fields.ma,
    fields.sdt,
    fields.ten,
    '',
    fields.loai,
    todayISO(),
    'Đã ở',
    fields.checkIn,
    fields.checkOut,
    nightsBetween(fields.checkIn, fields.checkOut),
    fields.pax,
    '',
    '',
    '',
    '',
    fields.dip,
    fields.note,
    fields.dongy,
    fields.letan,
  ]);
}

/** 11-column Góp ý row */
export function buildFeedbackRow(fields: {
  sdt: string;
  ma: string;
  nps: number;
  room: number;
  food: number;
  service: number;
  boat: number;
  comment: string;
  publish: string;
}): string {
  return tsvRow([
    '',
    todayISO(),
    fields.sdt,
    fields.ma,
    fields.nps,
    fields.room || '',
    fields.food || '',
    fields.service || '',
    fields.boat || '',
    fields.comment,
    fields.publish,
  ]);
}

/** TSV lead row from sales quote (backup for Larkbase) */
export function buildLeadTsvRow(fields: {
  code: string;
  phone: string;
  name: string;
  source: string;
  loai: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: string;
  items: string;
  total: number;
  sale: string;
}): string {
  return tsvRow([
    fields.code,
    fields.phone,
    fields.name,
    fields.source,
    fields.loai,
    todayISO(),
    'Đã báo giá',
    fields.checkIn,
    fields.checkOut,
    fields.nights || '',
    fields.guests,
    fields.items,
    fields.total,
    '',
    '',
    '',
    '',
    '',
    fields.sale,
  ]);
}
