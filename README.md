  MAIDA LODGE — BÀN GIAO BACKEND NHẬN DỮ LIỆU CRM
  Cho: Nguyên (backend) · Mục tiêu: dựng một endpoint HTTPS nhận dữ liệu CRM từ các trang frontend
Tóm tắt: Các trang frontend là trang tĩnh (Netlify, sẽ trỏ về maidalodge.com). Khi có sự kiện CRM (lead, cọc, check-in, đánh giá) chúng gọi fetch() POST tới một endpoint. Backend chỉ cần nhận và lưu — không xử lý đặt phòng/lịch phòng (việc đó của ezCloud).
1. Bối cảnh (đọc trước)
•	CRM bao quanh ezCloud, không thay thế. ezCloud (PMS) lo phần đặt phòng. CRM hứng hai đầu ezCloud làm yếu: trước (lead/báo giá) và sau (đánh giá/khách quay lại). Backend KHÔNG cần xử lý lịch/đặt phòng — chỉ nhận & lưu sự kiện CRM.
•	Frontend là trang tĩnh, không có backend riêng — chỉ gọi fetch() POST. Vì vậy backend chỉ cần là một API công khai qua HTTPS, có CORS.
•	Kho dữ liệu do Nguyên chọn: Postgres/MySQL (khuyến nghị), hoặc Google Sheets / Larkbase / Airtable qua API nếu muốn nhanh. Mô hình là append-only event log (chỉ thêm dòng, không sửa).
2. Các trang frontend & flow tổng thể
Trang	URL hiện tại	Vai trò	Người dùng	Gửi CRM?
Công cụ báo giá	tinhtien-maidalodge.netlify.app	Tính giá, xuất phiếu, lưu lead	Sale (nội bộ)	Có → Đơn hàng (lead)
App nhập liệu CRM	maida-capture (site nội bộ)	3 tab: Đặt cọc / Check-in / Đánh giá	Sale, Lễ tân	Có → Đơn hàng (coc, checkin) + Góp ý
Guest hub	maida-huongdan.netlify.app	Hướng dẫn khách	Khách	Chưa (tương lai: form đánh giá)
Gallery / Phòng / Thực đơn / Dịch vụ	maida-anh · maida-room · maida-menu · maida-hoatdong-dichvu	Trang thông tin tĩnh	Khách	Không
Chỉ 2 trang gửi dữ liệu CRM: Công cụ báo giá và App nhập liệu. (Tương lai có thêm form đánh giá khách tự điền — cùng contract bảng Góp ý.)
Luồng theo vòng đời khách (mỗi bước = một sự kiện gửi lên backend):
Khách quan tâm  -> [Công cụ báo giá] "Lưu lead CRM"  -> POST event=lead     (Đơn hàng, "Đã báo giá")
Khách cọc       -> [App] tab Đặt cọc                -> POST event=coc      (Đơn hàng, "Đã cọc")
Khách đến nơi   -> [App] tab Check-in               -> POST event=checkin  (Đơn hàng, "Đã ở" + consent)
Sau lưu trú     -> [App] tab Đánh giá / khách tự điền -> POST event=danh_gia (Góp ý, NPS + sao)
Tất cả khóa bằng số điện thoại (SĐT). Backend append mỗi sự kiện thành 1 dòng; trạng thái mới nhất của khách = dòng gần nhất theo SĐT. "Khách hàng" là view gom theo SĐT, không nhập tay.
3. Hợp đồng API cần dựng (đích — JSON)
Lưu ý: hiện frontend đang POST một chuỗi TSV (để sao-chép-dán). Để backend gọn, nên đổi sang JSON có cấu trúc dưới đây. Bên frontend sẽ cập nhật 2 trang để gửi đúng JSON này. (Định dạng TSV cũ ở Phụ lục A.)
Endpoint
POST https://<domain-backend>/crm/ingest
Content-Type: application/json
X-Maida-Token: <shared-secret>      # token tĩnh chặn spam; cấp cho frontend
Body — sự kiện bảng ĐƠN HÀNG (lead / coc / checkin)
{
  "table": "don_hang",
  "event": "lead",
  "idempotency_key": "c2f1e8a0-...-uuid",
  "ts": "2026-06-27T10:05:00+07:00",
  "source_tool": "quote",
  "data": {
    "ma_dh": "MD2607",          "sdt": "0912345678",
    "ten": "Chị Lan",           "nguon": "Zalo OA",
    "loai_khach": "Gia đình",   "trang_thai": "Đã báo giá",
    "check_in": "2026-07-10",   "check_out": "2026-07-12",
    "so_dem": 2,                "so_khach": "2 NL · 2 trẻ",
    "phong_combo_dv": "Combo Bungalow Hồ ×2",
    "tong_bao_gia": 5400000,    "tien_coc": 0,
    "kenh_tt": "",              "dip": "",
    "ghi_chu": "",              "dong_y_lien_he": "",
    "sale_le_tan": "Hà"
  }
}
Body — sự kiện bảng GÓP Ý (danh_gia)
{
  "table": "gop_y",
  "event": "danh_gia",
  "idempotency_key": "9b3...-uuid",
  "ts": "2026-07-12T09:00:00+07:00",
  "source_tool": "capture",
  "data": {
    "ma_gy": "",      "ngay": "2026-07-12",
    "sdt": "0912345678",   "ma_dh": "MD2607",
    "nps": 9,         "sao_phong": 5,   "sao_am_thuc": 4,
    "sao_dich_vu": 5, "sao_tau": 5,
    "binh_luan": "Cảnh đẹp, nhân viên thân thiện",
    "cho_phep_dang": "Có"
  }
}
Phản hồi
200 OK   { "ok": true, "id": "1234" }
4xx      { "ok": false, "error": "Mô tả lỗi" }
Yêu cầu kỹ thuật của endpoint
•	CORS: cho phép origin các trang. Hiện tại *.netlify.app (vd tinhtien-maidalodge.netlify.app); tương lai *.maidalodge.com. Cho phép POST, OPTIONS; header Content-Type, X-Maida-Token.
•	Idempotency: bỏ qua nếu idempotency_key đã nhận (tránh double-submit khi mạng chập chờn / bấm 2 lần).
•	Token: kiểm tra X-Maida-Token; thiếu/sai → 401.
•	Không đặt SĐT/tên lên URL/query — chỉ trong body, qua HTTPS.
Backend làm gì với mỗi request:
1.	Xác thực token + CORS.
2.	Kiểm tra idempotency_key (đã có → trả 200, không ghi trùng).
3.	Append một dòng vào bảng tương ứng (don_hang hoặc gop_y) theo schema mục 5.
4.	(Tùy chọn) cập nhật/đối chiếu view Khách hàng theo sdt.
5.	Trả {ok:true, id}.
4. Tích hợp với frontend (rất đơn giản)
Mỗi trang có sẵn một hằng số ở đầu script:
const CRM_ENDPOINT = '';   // dán URL backend vào đây
Nguyên chỉ cần cấp 1 URL + 1 token. Bên frontend dán vào CRM_ENDPOINT (và token) của cả 2 trang, deploy lại — xong. Không cần build tool, không server-side ở frontend.
5. Schema 2 bảng (kho dữ liệu)
Bảng don_hang (nhật ký khách & pipeline — append-only)
Khóa JSON (data.*)	Cột hiển thị	Kiểu	Giá trị hợp lệ / ghi chú
ma_dh	Mã ĐH	text	mã đặt phòng, nối các sự kiện cùng booking (có thể rỗng)
sdt	SĐT	text	KHÓA định danh khách (bắt buộc)
ten	Tên	text	—
nguon	Nguồn	enum	Zalo OA · Facebook · OTA · Giới thiệu · Website · Walk-in · Khác
loai_khach	Loại khách	enum	Lẻ/cặp đôi · Gia đình · Đoàn · Sự kiện/cưới hỏi · Doanh nghiệp
trang_thai	Trạng thái	enum	Quan tâm · Đã báo giá · Đã cọc · Đã ở · Huỷ
check_in / check_out	Check-in/out	date	YYYY-MM-DD
so_dem	Số đêm	int	—
so_khach	Số khách	text	vd "2 NL · 1 trẻ"
phong_combo_dv	Phòng/Combo & DV	text	tóm tắt sản phẩm đã chọn
tong_bao_gia	Tổng báo giá	number	VNĐ
tien_coc	Tiền cọc	number	đã thu
kenh_tt	Kênh TT	enum	Tiền mặt · Chuyển khoản · Thẻ
dip	Dịp	text	Sinh nhật · Kỷ niệm · Trăng mật · Team building · Khác
ghi_chu	Ghi chú/Dị ứng	text	sở thích, dị ứng, yêu cầu riêng
dong_y_lien_he	Đồng ý liên hệ	enum	Có · Không — consent NĐ 13/2023 (lấy lúc check-in)
sale_le_tan	Sale/Lễ tân	text	người phụ trách
Hệ thống thêm: id (tự tăng), created_at (server time), event, source_tool, idempotency_key.
Bảng gop_y (đánh giá — append-only)
Khóa JSON	Cột	Kiểu	Ghi chú
ma_gy	Mã GY	text	tự sinh được
ngay	Ngày	date	—
sdt	SĐT	text	nối về khách
ma_dh	Mã ĐH	text	nối về đơn hàng
nps	NPS	int 0–10	—
sao_phong / sao_am_thuc / sao_dich_vu / sao_tau	Sao 4 mục	int 1–5	—
binh_luan	Bình luận	text	—
cho_phep_dang	Cho phép đăng	enum	Có · Không
View "Khách hàng" (gom theo sdt) — không nhập tay
Dựng bằng query/view: nhóm don_hang theo sdt, lấy bản ghi mới nhất cho trạng thái hiện tại, cộng dồn chi tiêu, đếm số lần "Đã ở" (khách quay lại), join NPS gần nhất từ gop_y.
6. Bảo mật & tuân thủ
•	Toàn bộ qua HTTPS. Token tĩnh X-Maida-Token để chặn spam (đủ cho nội bộ; nâng cấp sau).
•	Consent (NĐ 13/2023): chỉ dùng SĐT cho chăm sóc/marketing khi dong_y_lien_he = "Có". Backend lưu nguyên trường này; việc lọc gửi marketing để tầng sau.
•	Không log SĐT/tên ra URL. Log lỗi nên ẩn bớt PII.
7. Tương lai (thiết kế mở, chưa làm ngay)
•	ezCloud: khi bật đủ, cọc/check-in nên đồng bộ từ ezCloud → CRM (một nguồn sự thật) thay cho nhập tay. Backend nên nhận cùng schema don_hang từ source_tool="ezcloud" để sau nối webhook ezCloud.
•	Form đánh giá khách tự điền (trên guest hub): cùng contract gop_y nhưng không có token nội bộ → cân nhắc rate-limit theo IP/SĐT.
Phụ lục A — Định dạng frontend ĐANG gửi hiện tại (TSV)
Hiện 2 trang POST Content-Type: application/json với body:
•	Công cụ báo giá: { "type":"lead", "row":"<19 cột phân tách TAB>" }
•	App nhập liệu: { "row":"<19 cột (Đơn hàng) HOẶC 11 cột (Góp ý)>" } — chưa có trường phân biệt bảng (phải đoán theo số cột/Trạng thái).
Thứ tự 19 cột Đơn hàng (TAB): Mã ĐH · SĐT · Tên · Nguồn · Loại khách · Ngày · Trạng thái · Check-in · Check-out · Số đêm · Số khách · Phòng/Combo&DV · Tổng báo giá · Tiền cọc · Kênh TT · Dịp · Ghi chú/Dị ứng · Đồng ý liên hệ · Sale/Lễ tân
Thứ tự 11 cột Góp ý: Mã GY · Ngày · SĐT · Mã ĐH · NPS · Sao phòng · Sao ẩm thực · Sao dịch vụ · Sao tàu · Bình luận · Cho phép đăng
Khuyến nghị: bỏ TSV, dùng JSON ở mục 3. Frontend sẽ cập nhật cho khớp ngay khi chốt contract.
Phụ lục B — Khung handler tham khảo (Node/Express, rút gọn)
app.post('/crm/ingest', cors(corsCfg), express.json(), async (req, res) => {
  if (req.header('X-Maida-Token') !== process.env.MAIDA_TOKEN)
    return res.status(401).json({ ok:false, error:'unauthorized' });
  const { table, event, idempotency_key, ts, source_tool, data } = req.body || {};
  if (!['don_hang','gop_y'].includes(table) || !data?.sdt)
    return res.status(400).json({ ok:false, error:'bad payload' });
  if (await seen(idempotency_key)) return res.json({ ok:true, dedup:true });
  const id = await insertRow(table, { ...data, event, source_tool,
                                      created_at: new Date(), client_ts: ts });
  await remember(idempotency_key);
  res.json({ ok:true, id });
});
(Google Apps Script + Sheets cũng làm được tương tự nếu muốn nhẹ.)
Maida Lodge · CRM ingestion brief · chốt contract trước khi code để frontend & backend khớp 100%.
