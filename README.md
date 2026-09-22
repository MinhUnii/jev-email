# Hộp thư hỗ trợ CloudDesk với Jev

Ví dụ một dịch vụ SaaS dùng SDK `@typesafe-ai/sdk` hiện có để biến email khách hàng thành ticket có nhóm phụ trách, mức ưu tiên, hạn phản hồi và bản nháp trả lời.

## Chạy thử

```bash
npm install
npm run demo
```

Demo đọc 6 email tiếng Việt trong `data/emails.json`, dùng nhãn có sẵn và độ tin cậy giả lập 95%. Không cần key, không gọi API. Kết quả được in ra terminal và lưu vào `output/tickets-demo-<timestamp>.json`.

## Chạy với API thật

Đặt `TYPESAFE_API_KEY=your_key_here` trong `.env`, rồi chạy từ thư mục dự án:

```bash
npm run dev
```

Mỗi email tạo một request với hai câu hỏi: loại email và mức ưu tiên. Tiêu đề và nội dung email được gửi tới API, dùng hạn mức của key. Trường `demo` không được gửi. Kết quả thật có thể khác demo và được lưu vào `output/tickets-live-<timestamp>.json`. Email lỗi được ghi trong `failures`; chương trình tiếp tục xử lý email còn lại.

## Ví dụ quy trình

Khách báo bị thu phí hai lần → AI chọn `billing`, `high` → code tạo ticket cho **Kế toán**, hạn phản hồi **4 giờ** → nhân viên đối chiếu giao dịch và duyệt bản nháp trước khi trả lời.

| Email mẫu | Nhóm dự kiến | Hạn phản hồi |
| --- | --- | --- |
| Thu phí trùng | Kế toán | 4 giờ |
| Cả đội gặp lỗi 503 | Hỗ trợ kỹ thuật | 1 giờ |
| Hỏi gói 50 người | Kinh doanh | 24 giờ |
| Phàn nàn dịch vụ | Chăm sóc khách hàng | 24 giờ |
| Nghi thư rác | Kiểm duyệt | Chờ kiểm tra |
| Thiếu thông tin | Hỗ trợ chung | 24 giờ |

AI chọn nhãn; code quyết định nhóm, hạn phản hồi và bản nháp theo mẫu cố định. Độ tin cậy lấy mức thấp hơn của hai câu trả lời; dưới 80% hoặc nhãn `other` thì nhân viên phải kiểm tra phân loại. Ngưỡng này chỉ minh họa, chưa được hiệu chỉnh trên dữ liệu thực tế.

Hạn phản hồi tính từ lúc tạo ticket theo giờ liên tục (1/4/24/48 giờ), chưa xét giờ làm việc. Đây là ticket trong file cục bộ, chưa kết nối Gmail hay hệ thống giao việc. Chương trình chưa gửi email, hoàn tiền hay xóa spam. Chạy lại tạo báo cáo mới.

## Thử nội dung của bạn

Tạo file JSON dạng:

```json
[
  {
    "id": "customer-001",
    "from": "khach@example.com",
    "name": "Hà",
    "subject": "Không đăng nhập được",
    "body": "Tôi bị lỗi khi đăng nhập từ sáng nay."
  }
]
```

```bash
npm run dev -- --file data/my-emails.json
```

Muốn chạy file riêng ở chế độ demo, thêm trường `demo` giống dữ liệu mẫu rồi dùng `npm run demo -- --file data/my-emails.json`.

- `src/inbox.ts`: quy trình mới; sửa câu hỏi trong `questions`, nhóm và mẫu trả lời trong `routes`, hạn phản hồi trong `hours`.
- `src/index.ts`: ví dụ tối giản ban đầu để đối chiếu.
- `data/emails.json`: dữ liệu mẫu.

Kiểm tra TypeScript bằng `npm run typecheck`.
