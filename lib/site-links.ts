export const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/order', label: 'Khách đặt trước' },
  { href: '/staff', label: 'Quản lý đơn' },
  { href: '/crm', label: 'CRM' },
  { href: '/archive', label: 'Archive' },
] as const;

export const hubSections = [
  {
    title: 'Khách & đặt hàng',
    links: [
      { href: '/order', label: 'Đặt phòng · Gọi món · Dịch vụ', desc: 'Khách đặt trước tại phòng / bàn' },
    ],
  },
  {
    title: 'Nội bộ',
    links: [
      { href: '/staff', label: 'Quản lý đơn', desc: 'Lễ tân — theo dõi đơn realtime (Supabase)' },
      { href: '/crm/sale', label: 'CRM · Báo giá / tạm tính', desc: 'Sale — tính giá, xuất phiếu, lưu lead' },
      { href: '/crm/capture', label: 'CRM · Nhập liệu', desc: 'Cọc · check-in · đánh giá' },
    ],
  },
  {
    title: 'Tham khảo',
    links: [
      { href: '/archive', label: 'Archive', desc: 'Thực đơn, gallery, dịch vụ, đường đi (bản lưu)' },
    ],
  },
] as const;
