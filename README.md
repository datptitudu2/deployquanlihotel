#  NORTHWEST HOTEL - Hệ thống Quản lý Khách sạn

Hệ thống quản lý khách sạn toàn diện với các tính năng:
- Quản lý khách hàng
- Quản lý phòng và loại phòng
- Quản lý dịch vụ
- Đặt phòng và Check-in/Check-out
- Hóa đơn và thanh toán QR Code
- Quản lý nhân viên (Admin)
- Dashboard thống kê

##  Tech Stack

- **Backend:** Node.js + Express.js
- **Database:** MySQL
- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Payment:** VietQR API

## 📦 Cài đặt Local

### Yêu cầu:
- Node.js >= 18.0.0
- MySQL >= 8.0
- npm >= 9.0.0

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd BTL3
```

### Bước 2: Cài đặt Backend
```bash
cd backend
npm install
```

### Bước 3: Tạo file .env
```bash
# Copy file mẫu
cp env.example .env

# Chỉnh sửa .env với thông tin database của bạn:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=123456
# DB_NAME=hotel_management
# DB_PORT=3306
```

### Bước 4: Setup Database
1. Tạo database trong MySQL:
```sql
CREATE DATABASE hotel_management;
```

2. Chạy script setup trong MySQL Workbench:
   - `backend/database/setup.sql`
   - `backend/database/users.sql`

### Bước 5: Chạy Backend
```bash
cd backend
npm start
```

Backend chạy tại: `http://localhost:3001`

### Bước 6: Chạy Frontend
Mở `frontend/index.html` bằng Live Server hoặc:
```bash
cd frontend
npx http-server -p 5500
```

Frontend chạy tại: `http://localhost:5500`

##  Đăng nhập mặc định

Sau khi chạy `users.sql`, có các user mẫu:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | admin |
| manager | manager123 | quan_ly |
| staff | staff123 | nhan_vien |

##  Tính năng

### Quản lý khách hàng
- Thêm/sửa/xóa khách hàng
- Tìm kiếm khách hàng
- Xem lịch sử đặt phòng

### Quản lý phòng
- Thêm/sửa/xóa phòng
- Quản lý loại phòng
- Cập nhật tình trạng phòng

### Đặt phòng
- Tạo đặt phòng mới
- Check-in/Check-out
- Xác nhận đặt phòng
- Quản lý trạng thái

### Hóa đơn & Thanh toán
- Tạo hóa đơn tự động
- QR Code thanh toán (VietQR)
- Theo dõi trạng thái thanh toán

### Quản lý nhân viên (Admin only)
- Thêm/sửa/xóa nhân viên
- Phân quyền theo role
- Quản lý tài khoản


