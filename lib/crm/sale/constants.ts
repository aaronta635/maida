export const TIERS = { wd: 'Trong tuần', sat: 'Cuối tuần (T7)', hol: 'Lễ/Tết' } as const;
export type RoomTier = keyof typeof TIERS;

export const SECT_ORDER = ['PHÒNG', 'COMBO', 'NHÀ HÀNG', 'DỊCH VỤ', 'VẬN CHUYỂN', 'PHÁT SINH'];

export const SECT2BUCKET: Record<string, string> = {
  'PHÒNG': 'phuthu',
  COMBO: 'combo',
  'NHÀ HÀNG': 'food',
  'DỊCH VỤ': 'dichvu',
  'VẬN CHUYỂN': 'vanchuyen',
  'PHÁT SINH': 'phatsinh',
};

export const BUCKETS = [
  { key: 'phong', label: 'Giá phòng', labelShort: 'giá phòng' },
  { key: 'phuthu', label: 'Phụ thu phòng', labelShort: 'phụ thu' },
  { key: 'combo', label: 'Combo', labelShort: 'combo' },
  { key: 'food', label: 'Nhà hàng', labelShort: 'nhà hàng' },
  { key: 'dichvu', label: 'Dịch vụ', labelShort: 'dịch vụ' },
  { key: 'vanchuyen', label: 'Vận chuyển', labelShort: 'vận chuyển' },
  { key: 'phatsinh', label: 'Phát sinh', labelShort: 'phát sinh' },
] as const;

export const BANK_DEFAULT = {
  name: 'CÔNG TY TRÁCH NHIỆM HỮU HẠN TTH MAI ĐÀ',
  acc: '8604672868',
  bank: 'BIDV - CN Sở Giao dịch 3',
  bin: '970418',
};

export const HOLI_DEFAULT = [
  '2026-01-01', '2026-04-30', '2026-05-01', '2026-09-01', '2026-09-02',
];

export const INV_NOTES = [
  'Bữa sáng và tàu đưa đón theo giờ cố định đã bao gồm trong giá phòng. Tàu đón cảng Ngòi Hoa 11h45 & 15h00, tiễn từ Maida 11h00 & 13h00; đi giờ khác vui lòng báo trước 24h và phụ thu 550.000đ/chuyến (tàu nhỏ).',
  'Vui lòng đặt món theo thực đơn trước ít nhất 24h.',
  'Không mang thú cưng và đồ ăn, thức uống bên ngoài vào khu nghỉ.',
  'Tôn trọng quy định chung của Maida Lodge và văn hóa bản Mường vùng lòng hồ.',
];

export const LS_KEY = 'maida_sale_prices_v3';
export const LS_HOLI = 'maida_holidays_v1';
export const LS_BANK = 'maida_bank_v1';
