
/* ===== DATA: giá chính thức theo Bảng giá Maida 2026 (đã gồm 8% VAT). ===== */
const S2='Thịt lợn nướng lá móc mật · Cá trắm hấp xì dầu · Canh cá măng chua · Cải mèo xào nấm · Cơm trắng · Hoa quả';
const COMBO='Gồm: 1 đêm phòng + 1 bữa sáng + 1 bữa trưa đặc sản (Mango Maida) + chọn 1 trải nghiệm (ngâm chân thảo dược / kayak) + bể bơi vô cực. Áp dụng ngày trong tuần — KHÔNG áp dụng T7 & ngày lễ.';

const DATA=[
 {group:'Phòng', ico:'🛏️', sect:'PHÒNG', cats:[
   {cat:'Hạng phòng — giá mùa hè (đã gồm bữa sáng, đón tàu khung giờ cố định)', rooms:1, items:[
     {id:'r_deluxe', name:'Deluxe (2 khách)', unit:'/phòng/đêm', rates:{wd:1700000,sat:2800000,hol:2800000}, room:1},
     {id:'r_supdlx', name:'Superior Deluxe (2 khách)', unit:'/phòng/đêm', rates:{wd:1900000,sat:3100000,hol:3100000}, room:1},
     {id:'r_bgvuon', name:'Bungalow Vườn (2 khách)', unit:'/phòng/đêm', rates:{wd:2300000,sat:3300000,hol:3300000}, room:1},
     {id:'r_bgho',   name:'Bungalow Hồ (2 khách)',   unit:'/phòng/đêm', rates:{wd:2300000,sat:3300000,hol:3300000}, room:1},
     {id:'r_duplex', name:'Duplex (4 khách)',        unit:'/phòng/đêm', rates:{wd:3400000,sat:5200000,hol:5200000}, room:1},
   ]},
   {cat:'Phụ thu trẻ em & giường phụ (/khách/đêm)', items:[
     {id:'sur_u6_2',  name:'Trẻ dưới 6 tuổi — bé thứ 2 (ngủ cùng)', unit:'/đêm', price:350000, perNight:1, desc:'Bé thứ 1 dưới 6 tuổi: miễn phí (không cần thêm dòng).'},
     {id:'sur_611_s', name:'Trẻ 6–11 tuổi — ngủ cùng',             unit:'/đêm', price:350000, perNight:1},
     {id:'sur_611_b', name:'Trẻ 6–11 tuổi — giường phụ',           unit:'/đêm', price:550000, perNight:1},
     {id:'sur_bed12', name:'Giường phụ (từ 12 tuổi)',              unit:'/đêm', price:750000, perNight:1},
   ]},
 ]},

 {group:'Combo Hè', ico:'🎁', sect:'COMBO', cats:[
   {cat:'Combo Hè Maida (giá /người · áp dụng ngày trong tuần)', items:[
     {id:'cb_deluxe', name:'Combo Deluxe (2 khách/phòng)',          unit:'/người', price:1150000, desc:COMBO},
     {id:'cb_duplex', name:'Combo Duplex (4 khách/phòng)',          unit:'/người', price:1150000, desc:COMBO},
     {id:'cb_supdlx', name:'Combo Superior Deluxe (2 khách/phòng)', unit:'/người', price:1250000, desc:COMBO},
     {id:'cb_bgvuon', name:'Combo Bungalow Vườn (2 khách/phòng)',   unit:'/người', price:1350000, desc:COMBO},
     {id:'cb_bgho',   name:'Combo Bungalow Hồ (2 khách/phòng)',     unit:'/người', price:1450000, desc:COMBO},
     {id:'cb_extra',  name:'Combo-giường phụ',                      unit:'/người', price:1150000, desc:COMBO},
   ]},
 ]},

 {group:'Nhà hàng', ico:'🍽️', sect:'NHÀ HÀNG', cats:[
   {cat:'Set menu (theo suất/người)', items:[
     {id:'set_t1', name:'Set trưa 1', unit:'/người', price:275000, desc:'Nộm hoa chuối tai heo · Cá lăng hấp xì dầu · Nem cá Maida · Rau xào theo mùa · Thịt rang cháy cạnh · Canh cá măng chua · Cơm · Hoa quả'},
     {id:'set_t2', name:'Set trưa 2', unit:'/người', price:275000, desc:'Nộm gà xé phay · Cá diêu hồng hấp xì dầu · Cà tím om nấm · Rau luộc theo mùa · Bò xào ngồng tỏi · Canh tép mùng tơi · Cơm · Hoa quả'},
     {id:'set_t3', name:'Set trưa 3', unit:'/người', price:275000, desc:'Gỏi hoa chuối cá lăng · Gà hấp lá chanh · Cá trắm hấp xì dầu · Củ quả luộc · Thịt lợn kho Maida · Canh thịt nấu chua · Cơm · Hoa quả'},
     {id:'set_o1', name:'Set tối 1', unit:'/người', price:325000, desc:'Nộm gà xé phay · Cá diêu hồng nướng · Nem cá Maida · Thịt nướng lá móc mật · Cà tím om nấm · Rau luộc theo mùa · Canh tép mùng tơi · Cơm · Hoa quả'},
     {id:'set_o2', name:'Set tối 2', unit:'/người', price:325000, desc:'Nộm hoa chuối tai heo · Khoai tây chiên · Nem cá Maida · Cá lăng nướng Maida · Lẩu cá lăng · Hoa quả'},
     {id:'set_o3', name:'Set tối 3', unit:'/người', price:325000, desc:'Nộm hoa chuối tai heo · Gà nướng hạt dổi kèm xôi cẩm · Cá trắm hấp xì dầu · Thịt nướng lá móc mật · Củ quả luộc · Canh thịt nấu chua · Cá sông Đà kho · Cơm · Hoa quả'},
     {id:'set_2_1', name:'Set 2 người – 1', unit:'/người', price:275000, desc:S2},
     {id:'set_2_2', name:'Set 2 người – 2', unit:'/người', price:275000, desc:'Gỏi hoa chuối cá lăng · Khoai tây chiên · Lẩu cá lăng · Hoa quả'},
     {id:'set_2_3', name:'Set 2 người – 3', unit:'/người', price:275000, desc:'Cá lăng nướng Maida · Cải mèo luộc chấm trứng · Thịt lợn kho hạt dổi · Canh tép mùng tơi · Cơm · Hoa quả'},
     {id:'set_4_1', name:'Set 4 người – 1', unit:'/người', price:275000, desc:'Nộm hoa chuối tai heo · Thịt lợn nướng lá móc mật · Cải mèo xào nấm · Cá sông Đà kho · Canh cá măng chua · Cơm · Hoa quả'},
     {id:'set_4_2', name:'Set 4 người – 2', unit:'/người', price:275000, desc:'Nộm gà xé phay · Nem cá Maida · Khoai tây chiên · Lẩu cá lăng · Hoa quả'},
     {id:'set_4_3', name:'Set 4 người – 3', unit:'/người', price:275000, desc:'Cá lăng nướng Maida · Cà tím om nấm · Cải mèo luộc chấm trứng · Thịt lợn kho Maida · Canh tép mùng tơi · Cơm · Hoa quả'},
     {id:'set_4_4', name:'Set 4 người – 4', unit:'/người', price:275000, desc:'Gỏi hoa chuối cá lăng · Gà nướng hạt dổi (kèm xôi) · Củ quả luộc · Thịt lợn kho · Canh thịt nấu chua · Cơm · Hoa quả'},
     {id:'set_bbq', name:'Set BBQ (từ 6 suất)', unit:'/người', price:500000, desc:'Nộm hoa chuối tai heo · Gà nướng hạt dổi · Lõi vai bò nướng · Má heo nướng · Cá nướng Tây Bắc · Củ quả luộc · Củ quả nướng · Xôi cẩm · Bánh mì bơ tỏi/mật ong · Hoa quả'},
   ]},
   {cat:'Khai vị / Nộm – Salad', items:[
     {id:'k1',name:'Nộm gà xé phay',unit:'/đĩa',price:165000},
     {id:'k2',name:'Nộm gà ngó sen',unit:'/đĩa',price:175000},
     {id:'k3',name:'Nộm hoa chuối tai heo',unit:'/đĩa',price:165000},
     {id:'k4',name:'Nộm hoa chuối cá lăng',unit:'/đĩa',price:175000},
     {id:'k5',name:'Gỏi cá diêu hồng',unit:'/đĩa',price:395000},
     {id:'k6',name:'Salad hoa quả',unit:'/đĩa',price:115000},
     {id:'k7',name:'Salad rau củ',unit:'/đĩa',price:85000},
   ]},
   {cat:'Cá', items:[
     {id:'f1',name:'Cá lăng nướng Mai Đà',unit:'/phần',price:365000},
     {id:'f2',name:'Cá lăng hấp xì dầu',unit:'/phần',price:365000},
     {id:'f3',name:'Cá diêu hồng hấp xì dầu',unit:'/phần',price:445000},
     {id:'f4',name:'Cá diêu hồng nướng Mai Đà',unit:'/phần',price:455000},
     {id:'f5',name:'Cá diêu hồng chiên xù',unit:'/phần',price:195000},
     {id:'f6',name:'Cá trắm hấp xì dầu',unit:'/phần',price:250000},
     {id:'f7',name:'Cá trê nướng Mai Đà',unit:'/phần',price:475000},
     {id:'f8',name:'Chả cá Mai Đà',unit:'/phần',price:400000},
     {id:'f9',name:'Cá lăng xào dứa',unit:'/phần',price:355000},
     {id:'f10',name:'Cá lăng om chuối đậu',unit:'/phần',price:375000},
     {id:'f11',name:'Nem cá Mai Đà (cái)',unit:'/cái',price:25000},
     {id:'f12',name:'Nem cá Mai Đà (đĩa 10 cái)',unit:'/đĩa',price:250000},
     {id:'f13',name:'Cá Sông Đà chiên lá lốt',unit:'/phần',price:165000},
   ]},
   {cat:'Gà / Bò / Lợn', items:[
     {id:'m1',name:'Gà hấp lá chanh (1/2 con)',unit:'/phần',price:425000},
     {id:'m2',name:'Gà rang gừng (1/2 con)',unit:'/phần',price:435000},
     {id:'m3',name:'Gà nướng hạt dổi (1/2 con)',unit:'/phần',price:465000},
     {id:'m4',name:'Gà chiên mắm (1/2 con)',unit:'/phần',price:450000},
     {id:'m5',name:'Gà nấu măng chua',unit:'/phần',price:435000},
     {id:'m6',name:'Bò bít tết',unit:'/phần',price:320000},
     {id:'m7',name:'Lõi vai bò nướng',unit:'/phần',price:455000},
     {id:'m8',name:'Mỳ Ý sốt bò bằm',unit:'/phần',price:280000},
     {id:'m9',name:'Má heo nướng Mai Đà',unit:'/phần',price:275000},
     {id:'m10',name:'Dải heo chao lá móc mật',unit:'/phần',price:255000},
     {id:'m11',name:'Thịt lợn nướng lá móc mật',unit:'/phần',price:255000},
     {id:'m12',name:'Thăn lợn chiên xù',unit:'/phần',price:210000},
     {id:'m13',name:'Cánh gà chiên mắm',unit:'/phần',price:195000},
     {id:'m14',name:'Khoai tây chiên',unit:'/phần',price:95000},
     {id:'m15',name:'Xôi nếp cẩm',unit:'/phần',price:65000},
   ]},
   {cat:'Rau / Trứng / Cơm chay', items:[
     {id:'v1',name:'Cải mèo luộc chấm trứng',unit:'/phần',price:85000},
     {id:'v2',name:'Cải mèo xào nấm',unit:'/phần',price:95000},
     {id:'v3',name:'Củ quả luộc',unit:'/phần',price:90000},
     {id:'v4',name:'Bắp cải luộc chấm trứng',unit:'/phần',price:65000},
     {id:'v5',name:'Rau muống luộc',unit:'/phần',price:55000},
     {id:'v6',name:'Rau muống xào giòn',unit:'/phần',price:75000},
     {id:'v7',name:'Cải chíp luộc sốt nấm',unit:'/phần',price:95000},
     {id:'v8',name:'Cải chip xào nấm',unit:'/phần',price:95000},
     {id:'v9',name:'Măng tươi xào (theo mùa)',unit:'/phần',price:105000},
     {id:'v10',name:'Cà tím om nấm',unit:'/phần',price:160000},
     {id:'v11',name:'Súp lơ xào nấm',unit:'/phần',price:115000},
     {id:'v12',name:'Đậu cô ve luộc gừng',unit:'/phần',price:60000},
     {id:'v13',name:'Trứng hấp miến nấm',unit:'/phần',price:185000},
     {id:'v14',name:'Trứng đúc nấm sốt phô mai',unit:'/phần',price:185000},
     {id:'v15',name:'Trứng tráng',unit:'/phần',price:65000},
     {id:'v16',name:'Canh nấm lá lốt',unit:'/phần',price:95000},
     {id:'v17',name:'Canh rau cải gừng',unit:'/phần',price:60000},
     {id:'v18',name:'Cơm chả lá lốt cuộn đậu nấm',unit:'/phần',price:185000},
     {id:'v19',name:'Cơm nấm xào rau củ',unit:'/phần',price:155000},
     {id:'v20',name:'Mỳ Ý chay sốt cà chua',unit:'/phần',price:220000},
   ]},
   {cat:'Món phụ / Canh / Cơm', items:[
     {id:'s1',name:'Cá kho Mai Đà',unit:'/phần',price:255000},
     {id:'s2',name:'Thịt kho Mai Đà',unit:'/phần',price:185000},
     {id:'s3',name:'Thịt rang cháy cạnh',unit:'/phần',price:185000},
     {id:'s4',name:'Thịt ba chỉ luộc',unit:'/phần',price:165000},
     {id:'s5',name:'Tôm sông rang lá chanh',unit:'/phần',price:265000},
     {id:'s6',name:'Tôm sông rang thịt',unit:'/phần',price:265000},
     {id:'s7',name:'Măng treo xào bò',unit:'/phần',price:250000},
     {id:'s8',name:'Ngồng tỏi xào bò',unit:'/phần',price:250000},
     {id:'s9',name:'Trứng đúc thịt',unit:'/phần',price:115000},
     {id:'s10',name:'Canh sườn chua dọc mùng',unit:'/phần',price:175000},
     {id:'s11',name:'Canh cá măng chua',unit:'/phần',price:165000},
     {id:'s12',name:'Canh tép mùng tơi',unit:'/phần',price:145000},
     {id:'s13',name:'Canh sườn măng chua',unit:'/phần',price:175000},
     {id:'s14',name:'Canh thịt nấu chua',unit:'/phần',price:135000},
     {id:'s15',name:'Canh cải thịt băm',unit:'/phần',price:125000},
     {id:'s16',name:'Cơm rang thập cẩm',unit:'/phần',price:125000},
     {id:'s17',name:'Mỳ xào bò',unit:'/phần',price:135000},
     {id:'s18',name:'Nồi cháo gà (1/2 con, 4 người)',unit:'/nồi',price:500000},
     {id:'s19',name:'Cháo thịt băm (bát)',unit:'/bát',price:60000},
     {id:'s20',name:'Cơm trắng',unit:'/bát',price:30000},
   ]},
   {cat:'Lẩu', items:[
     {id:'l1',name:'Lẩu cá lăng',unit:'/nồi',price:685000},
     {id:'l2',name:'Lẩu gà dấm bỗng',unit:'/nồi',price:665000},
     {id:'l3',name:'Cá lăng phile (nhúng lẩu)',unit:'/phần',price:275000},
     {id:'l4',name:'Bò nhúng lẩu',unit:'/phần',price:195000},
     {id:'l5',name:'Gà thả lẩu (1/2 con)',unit:'/phần',price:375000},
     {id:'l6',name:'Nấm kim châm',unit:'/phần',price:65000},
     {id:'l7',name:'Rau cải xanh',unit:'/phần',price:45000},
     {id:'l8',name:'Măng lẩu',unit:'/phần',price:75000},
     {id:'l9',name:'Váng đậu',unit:'/phần',price:40000},
     {id:'l10',name:'Rau cải mèo',unit:'/phần',price:55000},
     {id:'l11',name:'Rau cải thảo',unit:'/phần',price:55000},
     {id:'l12',name:'Rau tổng hợp',unit:'/phần',price:115000},
     {id:'l13',name:'Mì tôm',unit:'/gói',price:30000},
     {id:'l14',name:'Bánh đa',unit:'/phần',price:35000},
     {id:'l15',name:'Bún',unit:'/phần',price:35000},
   ]},
   {cat:'Tráng miệng', items:[
     {id:'d1',name:'Hoa quả tráng miệng',unit:'/đĩa',price:50000},
     {id:'d2',name:'Panna cotta',unit:'/phần',price:20000},
   ]},
   {cat:'Đồ uống — Nước ép & Trà', items:[
     {id:'b1',name:'Nước cam ép',unit:'/ly',price:60000},
     {id:'b2',name:'Nước chanh tươi',unit:'/ly',price:40000},
     {id:'b3',name:'Nước chanh leo',unit:'/ly',price:50000},
     {id:'b4',name:'Cam dứa ép',unit:'/ly',price:65000},
     {id:'b5',name:'Nước mơ',unit:'/ly',price:50000},
     {id:'b6',name:'Dưa hấu ép',unit:'/ly',price:50000},
     {id:'b7',name:'Cam cà rốt ép',unit:'/ly',price:70000},
     {id:'b8',name:'Dứa ép',unit:'/ly',price:55000},
     {id:'b9',name:'Trà hoa quả nha đam',unit:'/ly',price:60000},
     {id:'b10',name:'Trà hoa cúc táo đỏ',unit:'/ly',price:60000},
     {id:'b11',name:'Trà lá nếp nha đam',unit:'/ly',price:60000},
     {id:'b12',name:'Trà cam quế (ấm)',unit:'/ly',price:60000},
     {id:'b13',name:'Trà gừng mật ong',unit:'/ly',price:50000},
     {id:'b14',name:'Trà quất mật ong',unit:'/ly',price:50000},
     {id:'b15',name:'Trà mạn (ấm)',unit:'/ấm',price:70000},
     {id:'b16',name:'Trà cam quế (lạnh)',unit:'/ly',price:60000},
     {id:'b17',name:'Trà gạo lứt (bình)',unit:'/bình',price:80000},
     {id:'b18',name:'Sprite chanh leo',unit:'/ly',price:60000},
     {id:'b19',name:'Trà sâm dứa (bình)',unit:'/bình',price:60000},
     {id:'b20',name:'Soda xí muội',unit:'/ly',price:60000},
     {id:'b21',name:'Trà sâm dứa (cốc)',unit:'/cốc',price:15000},
   ]},
   {cat:'Đồ uống — Nước ngọt / Bia / Rượu', items:[
     {id:'g1',name:'Lavie',unit:'/chai',price:25000},
     {id:'g2',name:'Bia Hà Nội',unit:'/lon',price:35000},
     {id:'g3',name:'Bia Heineken',unit:'/lon',price:45000},
     {id:'g4',name:'Coca Cola',unit:'/lon',price:35000},
     {id:'g5',name:'Bia Tiger Bạc',unit:'/lon',price:50000},
     {id:'g6',name:'Soda chanh',unit:'/ly',price:35000},
     {id:'g7',name:'Rượu táo mèo',unit:'/bình',price:300000},
     {id:'g8',name:'Sprite',unit:'/lon',price:35000},
     {id:'g9',name:'Rượu mơ',unit:'/bình',price:300000},
   ]},
   {cat:'Đồ uống — Cà phê / Cocktail / Sữa', items:[
     {id:'c1',name:'Cà phê đen',unit:'/ly',price:50000},
     {id:'c2',name:'Cà phê nâu',unit:'/ly',price:55000},
     {id:'c3',name:'Bạc xỉu',unit:'/ly',price:60000},
     {id:'c4',name:'Cà phê muối',unit:'/ly',price:55000},
     {id:'c5',name:'Classic Mojito',unit:'/ly',price:115000},
     {id:'c6',name:'Passion Mojito',unit:'/ly',price:130000},
     {id:'c7',name:'Cocktail homemade',unit:'/ly',price:115000},
     {id:'c8',name:'Sữa chua đánh đá',unit:'/ly',price:55000},
     {id:'c9',name:'Sữa chua nha đam',unit:'/ly',price:60000},
     {id:'c10',name:'Sữa chua chanh leo',unit:'/ly',price:60000},
     {id:'c11',name:'Sữa tươi',unit:'/ly',price:30000},
   ]},
   {cat:'Thêm món / đồ uống tự do', custom:1, sect:'NHÀ HÀNG', items:[]},
 ]},

 {group:'Dịch vụ', ico:'🌿', sect:'DỊCH VỤ', cats:[
   {cat:'Trải nghiệm trên hồ', items:[
     {id:'e1',name:'Ván hơi SUP (1 người)',unit:'/lượt',price:150000},
     {id:'e2',name:'Kayak (2 người)',unit:'/lượt',price:250000},
     {id:'e3',name:'Tàu đi chơi hồ (1–17 người, gần Maida)',unit:'/giờ',price:600000,desc:'Trên 18 người / đi lễ / du ngoạn hồ: đặt trước.'},
   ]},
   {cat:'Tắm lá thuốc người Dao', items:[
     {id:'e4',name:'Ngâm chân lá thuốc',unit:'/chậu',price:120000},
     {id:'e5',name:'Bồn ngâm tắm lá thuốc',unit:'/bồn',price:300000},
   ]},
   {cat:'Văn nghệ & âm thanh', items:[
     {id:'e6',name:'Văn nghệ dân tộc',unit:'/show',price:3500000},
     {id:'e7',name:'Âm ly, loa, mic',unit:'/lượt',price:2000000},
   ]},
   {cat:'Địa điểm & Hội nghị', items:[
     {id:'p1',name:'Thuê địa điểm tổ chức sự kiện',unit:'/ngày',price:5000000},
     {id:'p2',name:'Phòng đa năng (4 tiếng)',unit:'/lượt',price:5000000},
     {id:'p3',name:'Phí phục vụ ăn tại phòng đa năng',unit:'/bữa',price:1000000},
     {id:'p4',name:'Phí phục vụ đồ uống',unit:'/mâm',price:500000},
   ]},
   {cat:'Bếp nướng & Teabreak', items:[
     {id:'q1',name:'Set bếp nướng ngô khoai (5–8 người)',unit:'/set',price:500000},
     {id:'q2',name:'Set bếp nướng ngô khoai (15–20 người)',unit:'/set',price:1000000},
     {id:'q3',name:'Teabreak (15–20 người)',unit:'/set',price:2500000},
     {id:'q4',name:'Teabreak (30–40 người)',unit:'/set',price:3500000},
   ]},
 ]},

 {group:'Vận chuyển', ico:'🚐', sect:'VẬN CHUYỂN', cats:[
   {cat:'Tàu đưa đón Ngòi Hoa – Maida', items:[
     {id:'t1',name:'Tàu 1–17 người',unit:'/lượt',price:550000,desc:'Đón/trả ngoài khung giờ cố định.'},
     {id:'t2',name:'Tàu 1–17 người (sau 18h00)',unit:'/lượt',price:750000},
     {id:'t3',name:'Tàu 18–35 người',unit:'/lượt',price:2000000},
     {id:'t4',name:'Tàu 31–60 người (đặt trước)',unit:'',price:0,note:'Đặt trước',askPrice:1},
   ]},
   {cat:'Thuê xe ô tô (giá theo thoả thuận nhà xe)', items:[
     {id:'x_car',name:'Thuê xe ô tô Hà Nội → Ngòi Hoa',unit:'/chuyến',price:0,askPrice:1,note:'Không có giá cố định — Sale điền giá đã chốt với nhà xe.'},
   ]},
 ]},
];

const TIERS={wd:'Trong tuần', sat:'Cuối tuần (T7)', hol:'Lễ/Tết'};
const SECT_ORDER=['PHÒNG','COMBO','NHÀ HÀNG','DỊCH VỤ','VẬN CHUYỂN','PHÁT SINH'];

const ITEMS={};
DATA.forEach(g=>g.cats.forEach(c=>c.items.forEach(it=>{it.group=g.group;it.cat=c.cat;it.sect=c.sect||g.sect;ITEMS[it.id]=it;})));

const LS_KEY='maida_sale_prices_v3';
function loadOverrides(){try{const r=localStorage.getItem(LS_KEY);if(!r)return;const o=JSON.parse(r);
  Object.keys(o).forEach(id=>{const it=ITEMS[id];if(!it)return;
    if(it.rates&&o[id].rates){['wd','sat','hol'].forEach(t=>{if(typeof o[id].rates[t]==='number')it.rates[t]=o[id].rates[t];});}
    else if(typeof o[id].price==='number')it.price=o[id].price;});}catch(e){}}
function saveOverrides(){try{const o={};Object.keys(ITEMS).forEach(id=>{const it=ITEMS[id];
  o[id]=it.rates?{rates:{wd:it.rates.wd,sat:it.rates.sat,hol:it.rates.hol}}:{price:it.price};});
  localStorage.setItem(LS_KEY,JSON.stringify(o));}catch(e){}}
loadOverrides();

const cart={};                 /* key: id  (hoặc id@tier cho phòng) -> qty */
let customSeq=1; const customItems=[];  /* {id,name,price,qty,sect} */
let activeGroup=DATA[0].group;
let roomTier='wd';

function fmt(n){return (n||0).toLocaleString('vi-VN')+' ₫';}
function val(id){const e=document.getElementById(id);return e?e.value.trim():'';}
function fmtD(s){if(!s)return '—';const[y,m,d]=s.split('-');return `${d}/${m}/${y}`;}
function esc(s){return (s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}
function norm(s){return (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase();}
function nights(){const a=val('cIn'),b=val('cOut');if(!a||!b)return 0;const d=(new Date(b)-new Date(a))/86400000;return d>0?Math.round(d):0;}
function calcNights(){const n=nights();document.getElementById('nightsTag').textContent=n?('Số đêm: '+n):'Số đêm: — (chọn ngày)';render();}

/* ===== Tự kiểm soát mức giá theo lịch ===== */
const LS_HOLI='maida_holidays_v1';
const HOLI_DEFAULT=['2026-01-01','2026-04-30','2026-05-01','2026-09-01','2026-09-02'];
let HOLI=new Set(HOLI_DEFAULT);
function loadHoli(){try{const r=localStorage.getItem(LS_HOLI);if(r){const a=JSON.parse(r);if(Array.isArray(a))HOLI=new Set(a);}}catch(e){}}
function saveHoli(arr){HOLI=new Set(arr);try{localStorage.setItem(LS_HOLI,JSON.stringify([...HOLI]));}catch(e){}}
loadHoli();
function addDays(s,i){const[y,m,d]=s.split('-').map(Number);const dt=new Date(y,m-1,d);dt.setDate(dt.getDate()+i);
  return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;}
function tierOfDate(s){if(HOLI.has(s))return 'hol';const[y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d).getDay()===6?'sat':'wd';}
function nightBreakdown(){const a=val('cIn'),n=nights();const r={wd:0,sat:0,hol:0,total:n,list:[]};
  if(!a||!n)return r;for(let i=0;i<n;i++){const dt=addDays(a,i);const t=tierOfDate(dt);r[t]++;r.list.push({date:dt,tier:t});}return r;}
function roomTierTotals(){const r={wd:0,sat:0,hol:0,any:false};
  Object.keys(cart).forEach(k=>{if(k.includes('@')){const t=k.split('@')[1];if(r[t]!=null){r[t]+=cart[k];r.any=true;}}});return r;}
function bdChips(bd){let s='';if(bd.wd)s+=`<span class="bd-chip">${bd.wd} đêm Thường</span>`;
  if(bd.sat)s+=`<span class="bd-chip">${bd.sat} đêm T7</span>`;if(bd.hol)s+=`<span class="bd-chip">${bd.hol} đêm Lễ/Tết</span>`;return s;}
function auditTiers(){const bd=nightBreakdown(),rt=roomTierTotals(),w=[];
  if(!rt.any)return {lvl:'none',bd,w};
  if(!bd.total)return {lvl:'info',bd,w:['Chưa chọn ngày đến/đi nên chưa kiểm tra được mức giá theo lịch.']};
  ['sat','hol'].forEach(t=>{if(rt[t]>0&&bd[t]===0)
    w.push(`Phiếu đang tính mức “${TIERS[t]}” nhưng lịch ${fmtD(val('cIn'))} → ${fmtD(val('cOut'))} không có đêm nào thuộc mức này.`);});
  ['sat','hol'].forEach(t=>{if(bd[t]>0&&rt[t]===0)
    w.push(`Lịch có ${bd[t]} đêm “${TIERS[t]}” nhưng phiếu chưa có dòng phòng nào tính mức này — nhiều khả năng đang tính nhầm sang giá thấp hơn.`);});
  if(bd.wd>0&&rt.wd===0&&(rt.sat>0||rt.hol>0))
    w.push(`Lịch có ${bd.wd} đêm ngày thường nhưng phiếu đang tính toàn bộ ở mức cao hơn.`);
  return {lvl:w.length?'warn':'ok',bd,w};}
function auditHTML(a){
  if(a.lvl==='none')return '';
  if(a.lvl==='info')return `<div class="cal-audit info"><span class="ttl">Lịch chưa đủ thông tin</span>${a.w[0]}</div>`;
  const chips=bdChips(a.bd);
  if(a.lvl==='ok')return `<div class="cal-audit ok"><span class="ttl">✓ Mức giá khớp với lịch</span>${chips}</div>`;
  return `<div class="cal-audit warn"><span class="ttl">⚠ Kiểm tra lại mức giá theo lịch</span>${chips}<ul>${a.w.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`;
}
function renderAudit(){const html=auditHTML(auditTiers());
  const a=document.getElementById('tierAudit');if(a){a.innerHTML=html;a.style.display=html?'block':'none';}
  const q=document.getElementById('quoteAudit');if(q){q.innerHTML=html;q.style.display=html?'block':'none';}}
function addRoomByCalendar(id){const bd=nightBreakdown();
  if(!bd.total){toast('Chọn ngày đến & ngày đi trước');return;}
  ['wd','sat','hol'].forEach(t=>{const k=id+'@'+t;if(bd[t]>0)cart[k]=bd[t];else delete cart[k];});
  renderControls();render();toast(`Đã xếp ${bd.total} đêm theo lịch`);}

/* tabs */
function buildTabs(){
  const t=document.getElementById('tabs'); let h='';
  DATA.forEach(g=>{h+=`<button class="tab" data-g="${g.group}" onclick="showTab('${g.group}')">${g.ico} ${g.group}</button>`;});
  h+=`<button class="tab" data-g="Phiếu" onclick="showTab('Phiếu')">🧾 Phiếu</button>`;
  t.innerHTML=h; markTab();
}
function markTab(){document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.g===activeGroup));}
function showTab(g){
  activeGroup=g; markTab();
  const gc=document.getElementById('groupContent'), qs=document.getElementById('quoteSection');
  if(g==='Phiếu'){ gc.style.display='none'; qs.style.display='block'; render(); window.scrollTo({top:0,behavior:'smooth'}); }
  else { qs.style.display='none'; gc.style.display='block'; buildGroup(g); window.scrollTo({top:0,behavior:'smooth'}); }
}

function buildGroup(group){
  const g=DATA.find(x=>x.group===group);
  const gc=document.getElementById('groupContent');
  let h='';
  if(g.cats.some(c=>c.rooms)){
    h+=`<div class="tier-bar"><span class="tier-lbl">Áp dụng giá phòng:</span>
      <div class="seg">
        <button class="seg-b" data-t="wd"  onclick="setTier('wd')">Trong tuần</button>
        <button class="seg-b" data-t="sat" onclick="setTier('sat')">Cuối tuần (T7)</button>
        <button class="seg-b" data-t="hol" onclick="setTier('hol')">Lễ / Tết</button>
      </div></div>
      <div id="tierAudit" class="cal-audit info" style="display:none;"></div>
      <div class="hint" style="margin:-2px 0 8px;">Chọn <b>Ngày đến / Ngày đi</b> ở trên, rồi bấm <b>“📅 Theo lịch”</b> ở phòng cần đặt — hệ thống tự chia số đêm vào đúng mức Thường / T7 / Lễ và cảnh báo nếu lệch. Muốn tự chọn mức thì dùng nút <b>+ Thêm</b>.</div>`;
  }
  h+=`<input class="search" id="searchBox" placeholder="🔎 Tìm trong ${esc(group)}…" oninput="filterItems()">`;
  g.cats.forEach(c=>{
    h+=`<div class="cat-block" data-cat="${esc(c.cat)}"><div class="subhead">${esc(c.cat)}</div><div class="panel">`;
    if(c.custom){
      h+=`<div class="hint" style="margin-bottom:9px;">Gõ tên món/đồ uống chưa có sẵn + đơn giá để cộng vào phiếu (nhóm Nhà hàng).</div>
        <div class="custom-add">
          <div class="field" style="flex:1 1 170px;"><label>Tên món / mục</label><input id="ciName" placeholder="VD: Rượu cần"></div>
          <div class="field" style="flex:0 0 120px;"><label>Đơn giá (đ)</label><input id="ciPrice" type="number" min="0" inputmode="numeric" placeholder="0"></div>
          <div class="field" style="flex:0 0 64px;"><label>SL</label><input id="ciQty" type="number" min="1" value="1" inputmode="numeric"></div>
          <button class="addbtn" onclick="addCustom()">+ Thêm</button>
        </div><div id="customList" style="margin-top:8px;"></div>`;
    } else {
      c.items.forEach(it=>{
        if(it.room){
          h+=`<div class="cat-item" data-id="${it.id}" data-name="${esc(norm(it.name))}">
              <div class="ci-main"><div class="ci-name">${esc(it.name)}</div>
                <div class="ci-meta" id="meta-${it.id}"></div>
                <div class="ci-chips" id="chips-${it.id}"></div></div>
              <div id="ctrl-${it.id}"></div></div>`;
        } else if(it.askPrice){
          h+=`<div class="cat-item" data-id="${it.id}" data-name="${esc(norm(it.name))}">
              <div class="ci-main"><div class="ci-name">${esc(it.name)}</div>
                <div class="ci-meta">${esc(it.note||'Sale điền giá')}</div></div></div>
            <div class="custom-add" style="margin-top:8px;">
              <div class="field" style="flex:0 0 140px;"><label>Đơn giá (đ)</label><input id="ap-price-${it.id}" type="number" min="0" inputmode="numeric" placeholder="0"></div>
              <div class="field" style="flex:0 0 60px;"><label>SL</label><input id="ap-qty-${it.id}" type="number" min="1" value="1" inputmode="numeric"></div>
              <button class="addbtn" onclick="addAsk('${it.id}')">+ Thêm</button>
            </div><div id="ap-list-${it.id}" style="margin-top:8px;"></div>`;
        } else {
          const priceTxt=it.price>0?fmt(it.price):(it.note||'—');
          const meta=it.perNight?' · × số đêm':'';
          h+=`<div class="cat-item" data-id="${it.id}" data-name="${esc(norm(it.name+' '+(it.desc||'')))}">
              <div class="ci-main"><div class="ci-name">${esc(it.name)}</div>
                <div class="ci-meta">${priceTxt} ${esc(it.unit)}${meta}</div>
                ${it.desc?`<div class="ci-desc">${esc(it.desc)}</div>`:''}</div>
              <div id="ctrl-${it.id}"></div></div>`;
        }
      });
    }
    h+=`</div></div>`;
  });
  gc.innerHTML=h;
  markSeg(); renderControls(); renderCustom(); renderAudit();
}

function setTier(t){roomTier=t;markSeg();renderControls();render();}
function markSeg(){document.querySelectorAll('.seg-b').forEach(b=>b.classList.toggle('active',b.dataset.t===roomTier));}

function renderControls(){
  document.querySelectorAll('[id^="ctrl-"]').forEach(c=>{
    const id=c.id.slice(5), it=ITEMS[id]; if(!it)return;
    if(it.room){
      const key=id+'@'+roomTier, q=cart[key]||0;
      const meta=document.getElementById('meta-'+id);
      if(meta)meta.textContent=`${fmt(it.rates[roomTier])}/đêm · ${TIERS[roomTier]}`;
      c.innerHTML = `<div class="ctrl-wrap">`+(q>0
        ? `<div class="qty"><button class="qbtn" onclick="chgRoom('${id}',-1)">−</button>
             <input class="qval" value="${q}" inputmode="numeric" onchange="setQRoom('${id}',this.value)">
             <button class="qbtn" onclick="chgRoom('${id}',1)">+</button></div>`
        : `<button class="addbtn" onclick="chgRoom('${id}',1)">+ Thêm</button>`)
        + `<button class="btn-cal" onclick="addRoomByCalendar('${id}')">📅 Theo lịch</button></div>`;
      const ch=document.getElementById('chips-'+id);
      if(ch){let s='';['wd','sat','hol'].forEach(t=>{const n=cart[id+'@'+t]||0;if(n>0)s+=`<span class="tier-chip">${TIERS[t]} × ${n} đêm</span>`;});ch.innerHTML=s;}
    } else {
      const q=cart[id]||0;
      c.innerHTML = q>0
        ? `<div class="qty"><button class="qbtn" onclick="chg('${id}',-1)">−</button>
             <input class="qval" value="${q}" inputmode="numeric" onchange="setQ('${id}',this.value)">
             <button class="qbtn" onclick="chg('${id}',1)">+</button></div>`
        : `<button class="addbtn" onclick="chg('${id}',1)">+ Thêm</button>`;
    }
  });
}
function chg(id,d){cart[id]=Math.max(0,(cart[id]||0)+d);if(cart[id]===0)delete cart[id];renderControls();render();}
function setQ(id,v){v=parseInt(v)||0;if(v<=0)delete cart[id];else cart[id]=v;renderControls();render();}
function chgRoom(id,d){const key=id+'@'+roomTier;const cur=cart[key]||0;
  let nv; if(cur===0&&d>0){nv=nights()||1;} else {nv=Math.max(0,cur+d);}
  if(nv<=0)delete cart[key];else cart[key]=nv;renderControls();render();}
function setQRoom(id,v){const key=id+'@'+roomTier;v=parseInt(v)||0;if(v<=0)delete cart[key];else cart[key]=v;renderControls();render();}

function filterItems(){
  const q=norm(val('searchBox'));
  document.querySelectorAll('#groupContent .cat-item').forEach(el=>{
    el.style.display = (!q || el.dataset.name.includes(q))?'flex':'none';
  });
  document.querySelectorAll('#groupContent .cat-block').forEach(bl=>{
    if(bl.querySelector('#customList')||bl.querySelector('[id^="ap-list-"]')) return;
    const any=[...bl.querySelectorAll('.cat-item')].some(e=>e.style.display!=='none');
    bl.style.display=any?'block':'none';
  });
}

/* custom (Nhà hàng) */
function addCustom(){
  const name=val('ciName'); const price=parseInt(document.getElementById('ciPrice').value)||0;
  const qty=Math.max(1,parseInt(document.getElementById('ciQty').value)||1);
  if(!name){toast('Nhập tên món/mục');return;} if(price<=0){toast('Nhập đơn giá');return;}
  customItems.push({id:'c'+(customSeq++),name,price,qty,sect:'NHÀ HÀNG'});
  document.getElementById('ciName').value='';document.getElementById('ciPrice').value='';document.getElementById('ciQty').value='1';
  document.getElementById('ciName').focus(); renderCustom(); render();
}
/* askPrice (vd thuê xe / tàu đặt trước) */
function addAsk(id){
  const it=ITEMS[id]; const price=parseInt(document.getElementById('ap-price-'+id).value)||0;
  const qty=Math.max(1,parseInt(document.getElementById('ap-qty-'+id).value)||1);
  if(price<=0){toast('Nhập đơn giá đã thoả thuận');return;}
  customItems.push({id:'c'+(customSeq++),name:it.name,price,qty,sect:it.sect});
  document.getElementById('ap-price-'+id).value='';document.getElementById('ap-qty-'+id).value='1';
  renderCustom(); render(); toast('Đã thêm vào phiếu');
}
function chgCustom(id,d){const it=customItems.find(x=>x.id===id);if(it){it.qty=Math.max(1,it.qty+d);renderCustom();render();}}
function setCustomQty(id,v){const it=customItems.find(x=>x.id===id);if(it){it.qty=Math.max(1,parseInt(v)||1);renderCustom();render();}}
function removeCustom(id){const i=customItems.findIndex(x=>x.id===id);if(i>=0){customItems.splice(i,1);renderCustom();render();}}
function renderCustomInto(container,sect){
  if(!container)return;
  const list=customItems.filter(x=>x.sect===sect);
  if(list.length===0){container.innerHTML='<div class="empty">Chưa thêm mục nào.</div>';return;}
  container.innerHTML=list.map(it=>`<div class="cat-item"><div class="ci-main"><div class="ci-name">${esc(it.name)}</div>
    <div class="ci-meta">${fmt(it.price)} × ${it.qty} = ${fmt(it.price*it.qty)}</div></div>
    <div class="qty"><button class="qbtn" onclick="chgCustom('${it.id}',-1)">−</button>
    <input class="qval" value="${it.qty}" inputmode="numeric" onchange="setCustomQty('${it.id}',this.value)">
    <button class="qbtn" onclick="chgCustom('${it.id}',1)">+</button></div>
    <button class="addbtn ci-rm" onclick="removeCustom('${it.id}')">✕</button></div>`).join('');
}
function renderCustom(){
  renderCustomInto(document.getElementById('customList'),'NHÀ HÀNG');
  document.querySelectorAll('[id^="ap-list-"]').forEach(c=>{const id=c.id.slice(8);const it=ITEMS[id];if(it)renderCustomInto(c,it.sect);});
}

const SECT2BUCKET={'PHÒNG':'phuthu','COMBO':'combo','NHÀ HÀNG':'food','DỊCH VỤ':'dichvu','VẬN CHUYỂN':'vanchuyen','PHÁT SINH':'phatsinh'};
const BUCKETS=[
  {key:'phong',label:'Giá phòng',labelShort:'giá phòng'},
  {key:'phuthu',label:'Phụ thu phòng',labelShort:'phụ thu'},
  {key:'combo',label:'Combo',labelShort:'combo'},
  {key:'food',label:'Nhà hàng',labelShort:'nhà hàng'},
  {key:'dichvu',label:'Dịch vụ',labelShort:'dịch vụ'},
  {key:'vanchuyen',label:'Vận chuyển',labelShort:'vận chuyển'},
  {key:'phatsinh',label:'Phát sinh',labelShort:'phát sinh'}
];
const bucketDisc={phong:'',phuthu:'',combo:'',food:'',dichvu:'',vanchuyen:'',phatsinh:''};
function setBD(k,v){bucketDisc[k]=v;render();}
let lastBucketSig=null;
function buildPartialRows(force,r){
  const cont=document.getElementById('discPartial'); if(!cont)return;
  r=r||compute(); const present=BUCKETS.filter(b=>(r.byBucket[b.key]||0)>0);
  const sig=present.map(b=>b.key).join(',');
  if(!force && sig===lastBucketSig){present.forEach(b=>{const el=cont.querySelector('.pd-sub[data-b="'+b.key+'"]');if(el)el.textContent=fmt(r.byBucket[b.key]||0);});return;}
  lastBucketSig=sig;
  if(present.length===0){cont.innerHTML='<div class="hint">Chưa chọn mục nào để áp ưu đãi.</div>';return;}
  cont.innerHTML='<div class="pd-head"><span>Nhóm</span><span>Tạm tính</span><span>Giảm %</span></div>'+
    present.map(b=>`<div class="pd-row"><span class="pd-lbl">${b.label}</span>
      <span class="pd-sub" data-b="${b.key}">${fmt(r.byBucket[b.key])}</span>
      <input class="pd-inp" id="bd_${b.key}" type="number" min="0" max="100" inputmode="numeric" value="${bucketDisc[b.key]||''}" placeholder="0" oninput="setBD('${b.key}',this.value)"></div>`).join('');
}

function compute(){
  let sub=0; const lines=[]; const n=nights();
  Object.keys(cart).forEach(key=>{
    const q=cart[key];
    if(key.includes('@')){
      const[id,tier]=key.split('@'); const it=ITEMS[id]; if(!it)return;
      const up=it.rates[tier]; const cost=up*q; sub+=cost;
      lines.push({name:`${it.name} — ${TIERS[tier]}`,qtyDesc:`${q} đêm × ${fmt(up)}`,cost,sect:it.sect,unit:up,qnum:q,bucket:'phong'});
    } else {
      const it=ITEMS[key]; if(!it)return;
      const cost=it.perNight?it.price*q*(n||0):it.price*q; sub+=cost;
      const qtyDesc=it.perNight?`${q} khách × ${n||0} đêm × ${fmt(it.price)}`:`${q} ${it.unit.replace('/','')} × ${fmt(it.price)}`;
      const bucket=(it.sect==='PHÒNG')?'phuthu':(SECT2BUCKET[it.sect]||'phatsinh');
      lines.push({name:it.name,qtyDesc,cost,sect:it.sect,unit:it.price,qnum:it.perNight?q*(n||0):q,bucket});
    }
  });
  customItems.forEach(it=>{const cost=it.price*it.qty;sub+=cost;
    lines.push({name:it.name,qtyDesc:`${it.qty} × ${fmt(it.price)}`,cost,sect:it.sect||'PHÁT SINH',unit:it.price,qnum:it.qty,bucket:SECT2BUCKET[it.sect]||'phatsinh'});});
  const byBucket={}; lines.forEach(l=>{byBucket[l.bucket]=(byBucket[l.bucket]||0)+l.cost;});
  const dt=document.getElementById('discType').value, dv=parseFloat(document.getElementById('discVal').value)||0, dl=val('discLabel');
  let disc=0; const discounts=[];
  if(dt==='percent'){const a=Math.min(Math.round(sub*dv/100),sub);if(a>0){disc=a;discounts.push({label:'Ưu đãi'+(dl?' ('+dl+')':''),detail:`−${dv}%`,amount:a});}}
  else if(dt==='amount'){const a=Math.min(dv,sub);if(a>0){disc=a;discounts.push({label:'Ưu đãi'+(dl?' ('+dl+')':''),detail:'',amount:a});}}
  else if(dt==='partial'){
    BUCKETS.forEach(b=>{const st=byBucket[b.key]||0;const pct=parseFloat(bucketDisc[b.key])||0;
      if(st>0&&pct>0){const a=Math.min(Math.round(st*pct/100),st);if(a>0){disc+=a;discounts.push({label:'Giảm '+b.labelShort,detail:`−${pct}%`,amount:a});}}});
    disc=Math.min(disc,sub);
  }
  const total=sub-disc; const depPct=parseFloat(document.getElementById('depPct').value)||0; const dep=Math.round(total*depPct/100);
  return {sub,disc,total,dep,depPct,lines,dt,dv,discounts,byBucket};
}

function groupLines(lines){
  const map={}; lines.forEach(l=>{(map[l.sect]=map[l.sect]||[]).push(l);});
  const order=[...SECT_ORDER]; Object.keys(map).forEach(s=>{if(!order.includes(s))order.push(s);});
  return order.filter(s=>map[s]&&map[s].length).map(s=>({sect:s,lines:map[s],subtotal:map[s].reduce((a,l)=>a+l.cost,0)}));
}

function render(){
  const r=compute();
  const dt=r.dt;
  const fv=document.getElementById('fldDiscVal'),fl=document.getElementById('fldDiscLabel'),dp=document.getElementById('discPartial');
  const showGlobal=(dt==='percent'||dt==='amount');
  if(fv)fv.style.display=showGlobal?'':'none';
  if(fl)fl.style.display=showGlobal?'':'none';
  if(dp){if(dt==='partial'){dp.style.display='block';buildPartialRows(false,r);}else{dp.style.display='none';lastBucketSig=null;}}
  document.getElementById('sSub').textContent=fmt(r.sub);
  if(r.disc>0){document.getElementById('sDiscRow').style.display='flex';
    const lbl=r.discounts.length>1?'Ưu đãi (từng phần)':(r.discounts[0].label+(r.discounts[0].detail?' '+r.discounts[0].detail:''));
    document.getElementById('sDiscLbl').textContent=lbl;
    document.getElementById('sDisc').textContent='− '+fmt(r.disc);}
  else document.getElementById('sDiscRow').style.display='none';
  document.getElementById('sTotal').textContent=fmt(r.total);
  document.getElementById('sDepLbl').textContent='Cọc '+r.depPct+'%';
  document.getElementById('sDep').textContent=fmt(r.dep);
  renderAudit();
  if(activeGroup==='Phiếu'){
    if(quoteMode==='invoice'){buildInvoiceCard(r);buildInvoiceText(r);}
    else{buildQuoteCard(r);buildQuoteText(r);}
  }
}

/* ===== Phiếu thu / Invoice ===== */
const LS_BANK='maida_bank_v1';
const BANK_DEFAULT={name:'CÔNG TY TRÁCH NHIỆM HỮU HẠN TTH MAI ĐÀ',acc:'8604672868',bank:'BIDV - CN Sở Giao dịch 3',bin:'970418'};
let BANK={...BANK_DEFAULT};
function loadBank(){try{const r=localStorage.getItem(LS_BANK);if(r){const o=JSON.parse(r);BANK={...BANK_DEFAULT,...o};}}catch(e){}}
function saveBank(o){BANK={...BANK,...o};try{localStorage.setItem(LS_BANK,JSON.stringify(BANK));}catch(e){}}
loadBank();
function ascii(s){return (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D');}
function genCode(){const din=val('cIn');let p='';if(din){const[y,m,d]=din.split('-');p=`${d}${m}${y.slice(2)}`;}else{const t=new Date();p=`${String(t.getDate()).padStart(2,'0')}${String(t.getMonth()+1).padStart(2,'0')}${String(t.getFullYear()).slice(2)}`;}
  const nm=ascii(val('cName')).trim().split(/\s+/).filter(Boolean);const last=nm.length?nm[nm.length-1]:'';
  return p+(last?last.slice(0,2).toUpperCase():'');}
function roomNightsTotal(){let s=0;Object.keys(cart).forEach(k=>{if(k.includes('@'))s+=cart[k];});return s;}
function crc16(s){let c=0xFFFF;for(let i=0;i<s.length;i++){c^=s.charCodeAt(i)<<8;for(let j=0;j<8;j++){c=(c&0x8000)?((c<<1)^0x1021):(c<<1);c&=0xFFFF;}}return c.toString(16).toUpperCase().padStart(4,'0');}
function tlv(id,v){return id+String(v.length).padStart(2,'0')+v;}
function buildVietQR(bin,acc,amount,info){
  const mai=tlv('00','A000000727')+tlv('01',tlv('00',bin)+tlv('01',acc))+tlv('02','QRIBFTTA');
  let s=tlv('00','01')+tlv('01',amount?'12':'11')+tlv('38',mai)+tlv('52','0000')+tlv('53','704');
  if(amount)s+=tlv('54',String(amount));
  s+=tlv('58','VN')+tlv('59','MAIDA LODGE');
  if(info)s+=tlv('62',tlv('08',info.slice(0,99)));
  return s+'6304'+crc16(s+'6304');}
function ensureQR(){return new Promise((res,rej)=>{if(window.qrcode)return res();
  const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js';
  s.onload=res;s.onerror=rej;document.head.appendChild(s);});}
function renderQR(boxId,payload){const box=document.getElementById(boxId);if(!box)return;
  ensureQR().then(()=>{try{const qr=qrcode(0,'M');qr.addData(payload);qr.make();box.innerHTML=qr.createImgTag(8,0);}
    catch(e){box.innerHTML='<div class="ph">Quét STK bên cạnh để chuyển khoản</div>';}})
  .catch(()=>{box.innerHTML='<div class="ph">Quét STK bên cạnh để chuyển khoản</div>';});}

let quoteMode='estimate';
function setQuoteMode(m){quoteMode=m;
  document.getElementById('qmEst').classList.toggle('active',m==='estimate');
  document.getElementById('qmInv').classList.toggle('active',m==='invoice');
  document.getElementById('invFields').style.display=(m==='invoice')?'block':'none';
  document.getElementById('quoteHeading').textContent=(m==='invoice')?'Phiếu thu / Invoice':'Phiếu tạm tính';
  document.getElementById('btnImg').textContent=(m==='invoice')?'📷 Tải ảnh phiếu thu (gửi Zalo)':'📷 Tải ảnh phiếu (gửi Zalo)';
  render();}

const LOGO_INV='data:image/png;base64,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';
const INV_NOTES=['Bữa sáng và tàu đưa đón theo giờ cố định đã bao gồm trong giá phòng. Tàu đón cảng Ngòi Hoa 11h45 & 15h00, tiễn từ Maida 11h00 & 13h00; đi giờ khác vui lòng báo trước 24h và phụ thu 550.000đ/chuyến (tàu nhỏ).','Vui lòng đặt món theo thực đơn trước ít nhất 24h.','Không mang thú cưng và đồ ăn, thức uống bên ngoài vào khu nghỉ.','Tôn trọng quy định chung của Maida Lodge và văn hóa bản Mường vùng lòng hồ.'];
function onReceiverSel(){const f=document.getElementById('fldReceiverCustom');if(f)f.style.display=(val('iReceiverSel')==='__custom')?'':'none';render();}
function receiverName(){const s=val('iReceiverSel')||'Thu Hà';return s==='__custom'?(val('iReceiver')||'').trim():s;}

function buildInvoiceCard(r){
  const name=val('cName')||'(chưa nhập tên)',phone=val('cPhone'),adt=val('cAdt')||'0',chd=val('cChd')||'0';
  const din=val('cIn'),dout=val('cOut'),n=nights(),dl=val('discLabel');
  const t=new Date();const td=`${String(t.getDate()).padStart(2,'0')}/${String(t.getMonth()+1).padStart(2,'0')}/${t.getFullYear()}`;
  const code=val('iCode')||genCode();
  const bookBy=val('iBookBy')||name;
  const agent=val('iAgent')||'Trực tiếp';
  const rooms=val('iRooms')||(n?String(Math.round(roomNightsTotal()/Math.max(n,1))||''):String(roomNightsTotal()||''))||'—';
  const receiver=receiverName();
  const hold=val('iHold')||'24';
  const groups=groupLines(r.lines);const flat=[];groups.forEach(g=>g.lines.forEach(l=>flat.push(l)));
  let rows='';
  if(flat.length===0)rows=`<tr><td colspan="5" style="color:#9a9484;padding:14px 4px;">(chưa chọn mục nào)</td></tr>`;
  else flat.forEach((l,i)=>{rows+=`<tr><td class="c">${i+1}</td><td>${esc(l.name)}</td><td class="num">${fmt(l.unit)}</td><td class="num">${l.qnum}</td><td class="num">${fmt(l.cost)}</td></tr>`;});
  const remain=r.total-r.dep;
  let discRow = r.discounts.length ? r.discounts.map(d=>`<div class="r"><span>${esc(d.label)}${d.detail?' '+esc(d.detail):''}</span><span>− ${fmt(d.amount)}</span></div>`).join('') : `<div class="r small"><span>Giảm giá</span><span>—</span></div>`;
  const ctContent=`${bookBy} ${code} Đặt cọc phòng`;
  const qrPayload=buildVietQR(BANK.bin,BANK.acc,r.dep>0?r.dep:0,ascii(ctContent));
  document.getElementById('quoteCard').innerHTML=`<div class="qcard invoice">
    <div class="inv-top">
      <div class="inv-co">
        <img class="logo" src="${LOGO_INV}" alt="Maida Lodge">
        <div class="legal">CÔNG TY TNHH TTH MAI ĐÀ</div>
        <div class="addr">Xóm Đoàn Kết, xã Tiền Phong, tỉnh Phú Thọ<br>VPĐD: Số 99B, Ngõ 275 Âu Cơ, Tây Hồ, Hà Nội<br>maidalodge.com · info@maidalodge.com · 0971 596 759 · 0982 015 445</div>
      </div>
      <div class="inv-doc"><div class="t">PHIẾU THU<span>INVOICE</span></div>
        <div class="meta">Mã: <b>${esc(code)}</b><br>Ngày: <b>${td}</b></div></div>
    </div>
    <div class="qc-body">
      <div class="inv-grid">
        <div><span class="k">Tên đoàn / Khách</span><span class="v">${esc(name)}</span></div>
        <div><span class="k">Đại lý</span><span class="v">${esc(agent)}</span></div>
        <div><span class="k">Người đặt</span><span class="v">${esc(bookBy)}</span></div>
        <div><span class="k">Điện thoại</span><span class="v">${esc(phone||'—')}</span></div>
        <div><span class="k">Số khách</span><span class="v">${adt} người lớn${parseInt(chd)>0?` · ${chd} trẻ em`:''}</span></div>
        <div><span class="k">Số phòng</span><span class="v">${esc(rooms)}</span></div>
        <div><span class="k">Nhận phòng</span><span class="v">${fmtD(din)} · 14h00</span></div>
        <div><span class="k">Trả phòng</span><span class="v">${fmtD(dout)} · 11h00</span></div>
      </div>
      <table class="inv-tbl"><thead><tr><th class="c">#</th><th>Diễn giải</th><th class="num">Đơn giá</th><th class="num">SL</th><th class="num">Thành tiền</th></tr></thead><tbody>${rows}</tbody></table>
      <div class="inv-tot">
        <div class="r"><span>Tổng tiền</span><span>${fmt(r.sub)}</span></div>
        ${discRow}
        <div class="r grand"><span>TỔNG CỘNG</span><span>${fmt(r.total)}</span></div>
        <div class="r dep"><span>Đặt cọc ${r.depPct}% (giữ phòng ${esc(hold)}h)</span><span>${fmt(r.dep)}</span></div>
        <div class="r small"><span>Còn lại — thanh toán khi check-out</span><span>${fmt(remain)}</span></div>
      </div>
      <div class="inv-pay">
        <div class="bk">
          <div class="ttl">Thông tin chuyển khoản</div>
          <div>${esc(BANK.name)}</div>
          <div class="acc">${esc(BANK.acc)}</div>
          <div><b>${esc(BANK.bank)}</b></div>
          <div>Nội dung: <span class="ct">${esc(ctContent)}</span></div>
          <div>Số tiền cọc: <b>${fmt(r.dep)}</b></div>
        </div>
        <div class="inv-qr" id="invQR"><div class="ph">Đang tạo mã QR…</div></div>
      </div>
      <div class="inv-sign">
        <div><div class="lbl">Người trả / Payer</div><div class="sp"></div><div class="nm">${esc(bookBy)}</div></div>
        <div><div class="lbl">Người xác nhận (Quản lý bán hàng)</div><div class="sp"></div><div class="nm">${esc(receiver)}</div></div>
      </div>
    </div>
    <div class="inv-notes">
      <div class="vat">Hóa đơn đã bao gồm VAT — Maida xuất trong ngày check-out (vui lòng báo trước 24h hoặc khi nhận phòng tại quầy Lễ Tân).</div>
      <ul>${INV_NOTES.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
    </div></div>`;
  renderQR('invQR',qrPayload);
}

function buildInvoiceText(r){
  const name=val('cName')||'(chưa nhập tên)',phone=val('cPhone'),din=val('cIn'),dout=val('cOut'),n=nights();
  const code=val('iCode')||genCode(),bookBy=val('iBookBy')||name;
  const groups=groupLines(r.lines);const remain=r.total-r.dep;
  let t='════════════════════════════\n   MAIDA LODGE — PHIẾU THU / INVOICE\n════════════════════════════\n';
  t+=`Mã đặt phòng: ${code}\nKhách: ${name}`+(phone?` · ${phone}`:'')+'\n';
  t+=`Nhận phòng: ${fmtD(din)} 14h · Trả phòng: ${fmtD(dout)} 11h`+(n?` (${n} đêm)`:'')+'\n────────────────────────────\n';
  let i=0;groups.forEach(g=>g.lines.forEach(l=>{i++;t+=`${i}. ${l.name}\n   ${fmt(l.unit)} × ${l.qnum} = ${fmt(l.cost)}\n`;}));
  t+='────────────────────────────\n'+`Tổng tiền: ${fmt(r.sub)}\n`;
  r.discounts.forEach(d=>{t+=`${d.label}${d.detail?' '+d.detail:''}: − ${fmt(d.amount)}\n`;});
  t+=`TỔNG CỘNG: ${fmt(r.total)}\nĐặt cọc ${r.depPct}%: ${fmt(r.dep)}\nCòn lại (check-out): ${fmt(remain)}\n════════════════════════════\n`;
  t+=`CHUYỂN KHOẢN ĐẶT CỌC:\n${BANK.name}\nSTK: ${BANK.acc} — ${BANK.bank}\nND: ${bookBy} ${code} Đặt cọc phòng\nSố tiền: ${fmt(r.dep)}\n────────────────────────────\n`;
  t+='Hóa đơn đã gồm VAT, xuất khi check-out (báo trước 24h). Zalo: 0982 015 445 · 0971 596 759 · maidalodge.com';
  document.getElementById('quoteOut').textContent=t;
}

function buildQuoteCard(r){
  const name=val('cName')||'(chưa nhập tên)', phone=val('cPhone'), adt=val('cAdt')||'0', chd=val('cChd')||'0';
  const din=val('cIn'),dout=val('cOut'),n=nights(),dl=val('discLabel');
  const t=new Date(); const td=`${String(t.getDate()).padStart(2,'0')}/${String(t.getMonth()+1).padStart(2,'0')}/${t.getFullYear()}`;
  const groups=groupLines(r.lines);
  let rows='';
  if(groups.length===0) rows=`<tr><td colspan="2" style="color:#9a9484;padding:14px 4px;">(chưa chọn mục nào)</td></tr>`;
  else groups.forEach(grp=>{
    rows+=`<tr class="sect"><td>${esc(grp.sect)}</td><td class="num"></td></tr>`;
    grp.lines.forEach(l=>{rows+=`<tr><td>${esc(l.name)}<div class="sub">${esc(l.qtyDesc)}</div></td><td class="num">${fmt(l.cost)}</td></tr>`;});
    if(groups.length>1)rows+=`<tr class="subt"><td>Cộng ${esc(grp.sect.toLowerCase())}</td><td class="num">${fmt(grp.subtotal)}</td></tr>`;
  });
  let discRow=''; r.discounts.forEach(d=>{discRow+=`<div class="r disc"><span>${esc(d.label)}${d.detail?' '+esc(d.detail):''}</span><span>− ${fmt(d.amount)}</span></div>`;});
  document.getElementById('quoteCard').innerHTML=`<div class="qcard">
    <div class="qc-top"><div><div class="qc-brand">Maida <span>Lodge</span></div>
      <div class="qc-loc">HỒ HOÀ BÌNH · TIỀN PHONG · PHÚ THỌ</div></div>
      <div class="qc-doc"><div class="t">PHIẾU TẠM TÍNH</div><div class="d">${td}</div></div></div>
    <div class="qc-body">
      <div class="qc-cust">
        <div class="full"><span class="k">Khách</span><span class="v">${esc(name)}</span></div>
        ${phone?`<div><span class="k">SĐT / Zalo</span><span class="v">${esc(phone)}</span></div>`:''}
        <div><span class="k">Số khách</span><span class="v">${adt} người lớn${parseInt(chd)>0?` · ${chd} trẻ em`:''}</span></div>
        <div><span class="k">Ngày đến → đi</span><span class="v">${fmtD(din)} → ${fmtD(dout)}</span></div>
        <div><span class="k">Số đêm</span><span class="v">${n||'—'} đêm</span></div>
      </div>
      <table class="qc-tbl"><thead><tr><th>Hạng mục</th><th class="num">Thành tiền</th></tr></thead><tbody>${rows}</tbody></table>
      <div class="qc-tot">
        <div class="r"><span>Tạm tính</span><span>${fmt(r.sub)}</span></div>${discRow}
        <div class="r grand"><span>TỔNG CỘNG</span><span>${fmt(r.total)}</span></div>
        <div class="r dep"><span>Đặt cọc ${r.depPct}%</span><span>${fmt(r.dep)}</span></div>
      </div>
    </div>
    <div class="qc-foot"><b>Bảng tạm tính</b> — Maida xác nhận chính thức khi đặt · Giá đã gồm VAT (VNĐ) · Nhận phòng 14h00 · Trả phòng 11h00.<br>
      <span class="hot">Đặt phòng / Zalo: 0982 015 445 · 0971 596 759</span> · maidalodge.com</div></div>`;
}

function ensureH2C(){return new Promise((res,rej)=>{if(window.html2canvas)return res();
  const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
  s.onload=res;s.onerror=rej;document.head.appendChild(s);});}
async function downloadImage(){
  const card=document.querySelector('#quoteCard .qcard'); if(!card){toast('Chưa có phiếu');return;}
  toast('Đang tạo ảnh…');
  try{await ensureH2C();}catch(e){toast('Không tải được công cụ ảnh — kiểm tra mạng');return;}
  const clone=card.cloneNode(true); clone.classList.add('shot');
  const holder=document.createElement('div'); holder.style.cssText='position:fixed;left:-10000px;top:0;width:720px;background:#fff;';
  clone.style.width='720px';clone.style.maxWidth='720px';clone.style.borderRadius='0';
  holder.appendChild(clone); document.body.appendChild(holder);
  let canvas; try{canvas=await html2canvas(clone,{scale:2,backgroundColor:'#ffffff',useCORS:true,logging:false});}
  catch(e){document.body.removeChild(holder);toast('Lỗi tạo ảnh');return;}
  document.body.removeChild(holder);
  const nm=(val('cName')||'khach').replace(/[^\p{L}0-9 ]/gu,'').trim().replace(/\s+/g,'_').slice(0,28)||'khach';
  const fn=(quoteMode==='invoice'?`Maida_PhieuThu_${nm}.png`:`Maida_TamTinh_${nm}.png`);
  canvas.toBlob(blob=>{if(!blob){toast('Lỗi tạo ảnh');return;}
    const file=new File([blob],fn,{type:'image/png'});
    if(navigator.canShare&&navigator.canShare({files:[file]}))
      navigator.share({files:[file],title:quoteMode==='invoice'?'Maida Lodge — Phiếu thu':'Maida Lodge — Phiếu tạm tính'}).then(()=>toast('Đã mở chia sẻ')).catch(()=>dlBlob(blob,fn));
    else dlBlob(blob,fn);},'image/png');
}
function dlBlob(blob,fn){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=fn;
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1500);toast('Đã tải ảnh phiếu');}

function buildQuoteText(r){
  const name=val('cName')||'(chưa nhập tên)',phone=val('cPhone'),adt=val('cAdt')||'0',chd=val('cChd')||'0';
  const din=val('cIn'),dout=val('cOut'),n=nights(),dl=val('discLabel');
  const groups=groupLines(r.lines);
  let t='════════════════════════════\n   MAIDA LODGE — PHIẾU TẠM TÍNH\n   Hồ Hòa Bình · Tiền Phong · Phú Thọ\n════════════════════════════\n';
  t+=`Khách: ${name}\n`; if(phone)t+=`SĐT/Zalo: ${phone}\n`;
  t+=`Số khách: ${adt} người lớn`+(parseInt(chd)>0?` · ${chd} trẻ em`:'')+'\n';
  t+=`Ngày: ${fmtD(din)} → ${fmtD(dout)}`+(n?` (${n} đêm)`:'')+'\n────────────────────────────\n';
  if(groups.length===0)t+='(chưa chọn mục nào)\n';
  else groups.forEach(grp=>{t+=`【 ${grp.sect} 】\n`;
    grp.lines.forEach(l=>{t+=`• ${l.name}\n   ${l.qtyDesc} = ${fmt(l.cost)}\n`;});
    if(groups.length>1)t+=`   ▸ Cộng ${grp.sect.toLowerCase()}: ${fmt(grp.subtotal)}\n`;
    t+='\n';});
  t+='────────────────────────────\n'+`Tạm tính:  ${fmt(r.sub)}\n`;
  r.discounts.forEach(d=>{t+=`${d.label}${d.detail?' '+d.detail:''}: − ${fmt(d.amount)}\n`;});
  t+=`TỔNG CỘNG: ${fmt(r.total)}\nĐặt cọc ${r.depPct}%: ${fmt(r.dep)}\n════════════════════════════\n`;
  t+='Bảng TẠM TÍNH; Maida xác nhận chính thức khi đặt. Giá gồm VAT.\nNhận phòng 14h · Trả phòng 11h · Zalo: 0982 015 445 · 0971 596 759';
  document.getElementById('quoteOut').textContent=t;
}
function copyQuote(){const t=document.getElementById('quoteOut').textContent;
  navigator.clipboard.writeText(t).then(()=>toast('Đã sao chép — dán vào Zalo')).catch(()=>{
    const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();
    try{document.execCommand('copy');toast('Đã sao chép');}catch(e){toast('Không sao chép được');}document.body.removeChild(ta);});}

/* ===== CRM lead capture ===== */
/* ===== SUPABASE CONFIG ===== */
const SUPABASE_URL=window.__MAIDA_ENV.url;
const SUPABASE_ANON_KEY=window.__MAIDA_ENV.key;
const _sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
/* ========================== */

const CRM_ENDPOINT=''; // legacy webhook — để trống, Supabase đã xử lý bên dưới.
function leadRow(){
  const r=compute(); const n=nights();
  const sdt=(val('cPhone')||'').trim(), ten=(val('cName')||'').trim(), src=val('cSource')||'';
  const din=val('cIn'), dout=val('cOut'), adt=val('cAdt')||'0', chd=val('cChd')||'0';
  const sale=val('iReceiver')||val('iBookBy')||'', code=val('iCode')||'';
  const items=r.lines.map(l=>l.name).join(' · ');
  const guests=adt+' NL'+(parseInt(chd)>0?(' · '+chd+' trẻ'):'');
  const today=new Date().toISOString().slice(0,10);
  /* Cột bảng ĐƠN HÀNG: Mã ĐH | SĐT | Tên | Nguồn | Ngày tạo | Trạng thái | Check-in | Check-out | Số đêm | Số khách | Phòng/Combo & DV | Tổng báo giá | Tiền cọc | Đã thu cọc | Kênh TT | Sale | Ghi chú */
  const loai=(parseInt(chd)>0?'Gia đình':'');
  /* 19 cột: Mã ĐH|SĐT|Tên|Nguồn|Loại khách|Ngày|Trạng thái|Check-in|Check-out|Số đêm|Số khách|Phòng/Combo&DV|Tổng báo giá|Tiền cọc|Kênh TT|Dịp|Ghi chú/Dị ứng|Đồng ý liên hệ|Sale/Lễ tân */
  const cols=[code,sdt,ten,src,loai,today,'Đã báo giá',din,dout,(n||''),guests,items,r.total,'','','','','',sale];
  return cols.map(c=>String(c).replace(/[\t\n]/g,' ')).join('\t');
}
async function saveLead(){
  const sdt=(val('cPhone')||'').trim();
  if(!sdt){toast('Nhập SĐT khách trước khi lưu lead');return;}
  if(!val('cSource')){toast('Chọn Nguồn khách để lưu lead');return;}

  const r=compute();
  const ten=(val('cName')||'').trim();
  const src=val('cSource')||'';
  const din=val('cIn'), dout=val('cOut');
  const adt=parseInt(val('cAdt')||0), chd=parseInt(val('cChd')||0);
  const rateMap={wd:'wd', sat:'we', hol:'hol'};

  const btn=document.querySelector('.summary button[onclick="saveLead()"]');
  if(btn){btn.disabled=true;btn.textContent='Đang lưu…';}

  try{
    const{data:order,error:oErr}=await _sb.from('orders').insert({
      customer_name: ten||null,
      customer_phone: sdt,
      pax: (adt+chd)||null,
      dates: (din&&dout)?(din+' → '+dout):null,
      note: src,
      room_rate_type: rateMap[roomTier]||null,
      subtotal: r.total,
      has_contact_items: false,
      status: 'pending',
    }).select().single();
    if(oErr)throw oErr;

    if(r.lines.length){
      const{error:iErr}=await _sb.from('order_items').insert(
        r.lines.map(l=>({
          order_id: order.id,
          zone_id: (l.sect||'').toLowerCase().replace(/\s+/g,'_'),
          zone_name: l.sect||'Khác',
          item_name_vi: l.name,
          item_name_en: null,
          unit: l.qtyDesc||null,
          unit_price: l.unit||null,
          quantity: l.qnum||1,
          line_total: l.cost||null,
        }))
      );
      if(iErr)throw iErr;
    }

    toast('✓ Đã lưu lead vào Supabase');
    // also copy TSV row as backup for Larkbase
    const row=leadRow();
    navigator.clipboard.writeText(row).catch(()=>{});
  }catch(e){
    console.error(e);
    toast('Lỗi Supabase — đã sao chép TSV để dán thủ công');
    const row=leadRow();
    navigator.clipboard.writeText(row).catch(()=>{});
  }finally{
    if(btn){btn.disabled=false;btn.textContent='📋 Lưu lead CRM';}
  }
}

function resetAll(){
  if(!confirm('Làm mới toàn bộ phiếu (xoá khách & các mục đã chọn)?'))return;
  Object.keys(cart).forEach(k=>delete cart[k]); customItems.length=0; roomTier='wd';
  ['cName','cPhone','cIn','cOut','discLabel','iCode','iBookBy','iAgent','iRooms','iReceiver'].forEach(i=>{const e=document.getElementById(i);if(e)e.value='';});
  document.getElementById('cAdt').value='2';document.getElementById('cChd').value='0';
  document.getElementById('discType').value='none';document.getElementById('discVal').value='0';document.getElementById('depPct').value='50';
  const rs=document.getElementById('iReceiverSel');if(rs){rs.value='Thu Hà';}const rc=document.getElementById('fldReceiverCustom');if(rc)rc.style.display='none';
  BUCKETS.forEach(b=>bucketDisc[b.key]='');lastBucketSig=null;
  calcNights(); if(activeGroup!=='Phiếu')buildGroup(activeGroup); render();
}

function openPrices(){
  const list=document.getElementById('priceEditList'); let h='';
  DATA.forEach(g=>g.cats.forEach(c=>{ if(c.custom)return;
    h+=`<div class="pe-cat">${g.ico} ${esc(c.cat)}</div>`;
    c.items.forEach(it=>{
      if(it.askPrice){h+=`<div class="pe-row"><div class="pe-name">${esc(it.name)} <span style="color:#9a9484;font-size:11px;">Sale điền khi báo giá</span></div></div>`;return;}
      if(it.rates){
        h+=`<div class="pe-row"><div class="pe-name">${esc(it.name)}</div>
          <div class="pe-rates">
            <input type="number" min="0" inputmode="numeric" data-id="${it.id}" data-tier="wd"  value="${it.rates.wd}"  title="Trong tuần">
            <input type="number" min="0" inputmode="numeric" data-id="${it.id}" data-tier="sat" value="${it.rates.sat}" title="Cuối tuần (T7)">
            <input type="number" min="0" inputmode="numeric" data-id="${it.id}" data-tier="hol" value="${it.rates.hol}" title="Lễ/Tết">
          </div></div>`;
      } else {
        h+=`<div class="pe-row"><div class="pe-name">${esc(it.name)} <span style="color:#9a9484;font-size:11px;">${esc(it.unit)}</span></div>
          <input type="number" min="0" inputmode="numeric" data-id="${it.id}" value="${it.price}"></div>`;
      }
    });
  }));
  list.innerHTML=h;
  const he=document.getElementById('holEdit');
  if(he)he.value=[...HOLI].sort().map(s=>{const[y,m,d]=s.split('-');return `${d}/${m}/${y}`;}).join('\n');
  document.getElementById('bkName').value=BANK.name;
  document.getElementById('bkAcc').value=BANK.acc;
  document.getElementById('bkBank').value=BANK.bank;
  document.getElementById('bkBin').value=BANK.bin;
  document.getElementById('priceModal').classList.add('open');
}
function closePrices(){document.getElementById('priceModal').classList.remove('open');}
function savePrices(){
  document.querySelectorAll('#priceEditList input').forEach(inp=>{const id=inp.dataset.id,v=parseInt(inp.value)||0;const it=ITEMS[id];if(!it)return;
    if(inp.dataset.tier){it.rates[inp.dataset.tier]=v;}else{it.price=v;}});
  const he=document.getElementById('holEdit');
  if(he){const arr=he.value.split(/\n+/).map(s=>s.trim()).filter(Boolean).map(s=>{
      const m=s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      return m?`${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`:null;}).filter(Boolean);
    saveHoli(arr);}
  saveBank({name:val('bkName')||BANK_DEFAULT.name,acc:(val('bkAcc')||BANK_DEFAULT.acc).replace(/\s/g,''),bank:val('bkBank')||BANK_DEFAULT.bank,bin:(val('bkBin')||BANK_DEFAULT.bin).replace(/\s/g,'')});
  saveOverrides();closePrices();
  if(activeGroup!=='Phiếu')buildGroup(activeGroup); render(); toast('Đã lưu bảng giá');
}
function restoreDefaults(){if(!confirm('Khôi phục toàn bộ giá về mặc định?'))return;try{localStorage.removeItem(LS_KEY);}catch(e){}location.reload();}

function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2000);}

/* init */
buildTabs(); buildGroup(activeGroup);
['cName','cPhone','cAdt','cChd'].forEach(i=>document.getElementById(i).addEventListener('input',render));
calcNights(); render();
