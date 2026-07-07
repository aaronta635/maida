export const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/order', label: 'Khách đặt trước' },
  { href: '/archive', label: 'Archive' },
] as const;

export const staffLinks = [
  { href: '/staff', label: 'Quản lý đơn' },
  { href: '/crm', label: 'CRM' },
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
      { href: '/login', label: 'Đăng nhập nhân viên', desc: 'Sale · Lễ tân — CRM & quản lý đơn' },
      { href: '/staff', label: 'Quản lý đơn', desc: 'Lễ tân — theo dõi đơn realtime (cần đăng nhập)' },
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
