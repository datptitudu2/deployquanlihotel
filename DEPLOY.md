# 🚀 Hướng dẫn Deploy lên Render

> **Xem [HUONG_DAN_DEPLOY.md](./HUONG_DAN_DEPLOY.md) để có hướng dẫn chi tiết từng bước bằng tiếng Việt**

## ⚠️ Lưu ý quan trọng

## ⚠️ Lưu ý quan trọng

- Render **free tier chỉ có PostgreSQL**, không có MySQL
- Nếu cần MySQL, dùng dịch vụ khác: **Railway** (có MySQL free) hoặc **PlanetScale**
- Hoặc chuyển sang PostgreSQL (cần sửa code)

## 📋 Bước 1: Chuẩn bị Database

### Option A: Dùng Railway (MySQL - Khuyến nghị)

1. Đăng ký: https://railway.app
2. Tạo project → Add MySQL
3. Lấy thông tin kết nối từ **Variables** tab
4. Kết nối và chạy:
   - `backend/database/setup.sql`
   - `backend/database/users.sql`

### Option B: Dùng Render PostgreSQL (Cần sửa code)

1. Render Dashboard → **New** → **PostgreSQL**
2. Chọn **Free** plan
3. Lưu lại thông tin kết nối

### Option C: Dùng PlanetScale (MySQL - Free)

1. Đăng ký: https://planetscale.com
2. Tạo database
3. Lấy connection string
4. Chạy SQL scripts

## 🔧 Bước 2: Push code lên GitHub

```bash
# Khởi tạo git (nếu chưa có)
git init

# Thêm tất cả files
git add .

# Commit
git commit -m "Initial commit - Ready for deployment"

# Thêm remote (thay YOUR_USERNAME và YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push lên GitHub
git push -u origin main
```

## 🌐 Bước 3: Deploy Backend

### 3.1. Tạo Web Service

1. Vào Render Dashboard → **New** → **Web Service**
2. Connect GitHub repository của bạn
3. Chọn repository và branch (thường là `main`)

### 3.2. Cấu hình Backend

Điền các thông tin sau:

- **Name:** `hotel-management-backend`
- **Environment:** `Node`
- **Build Command:** `cd backend && npm install`
- **Start Command:** `cd backend && npm start`
- **Plan:** Free

### 3.3. Thêm Environment Variables

Trong phần **Environment Variables**, click **Add Environment Variable** và thêm từng biến:

| Key | Value | Ghi chú |
|-----|-------|---------|
| `NODE_ENV` | `production` | |
| `PORT` | `3001` | |
| `DB_HOST` | `<your-db-host>` | Lấy từ database service |
| `DB_USER` | `<your-db-user>` | Lấy từ database service |
| `DB_PASSWORD` | `<your-db-password>` | Lấy từ database service |
| `DB_NAME` | `hotel_management` | |
| `DB_PORT` | `3306` | (hoặc 5432 nếu PostgreSQL) |
| `DB_SSL` | `true` | |
| `FRONTEND_URL` | `https://your-frontend.onrender.com` | **Cập nhật sau khi deploy frontend** |

**Lưu ý:** 
- Thay `<your-db-host>`, `<your-db-user>`, `<your-db-password>` bằng thông tin thực tế
- `FRONTEND_URL` sẽ cập nhật sau khi deploy frontend xong (Bước 5)

### 3.4. Deploy

1. Click **Create Web Service**
2. Đợi build và deploy (5-10 phút)
3. **Lưu lại Backend URL:** `https://your-backend.onrender.com`
4. Test API: `https://your-backend.onrender.com/api/test`

## 🎨 Bước 4: Deploy Frontend

### 4.1. Cập nhật API URL trong Frontend

**QUAN TRỌNG:** Trước khi deploy frontend, cần cập nhật API URL.

Mở file `frontend/index.html`, tìm dòng khoảng **dòng 2135**:
```javascript
window.API_BASE = "http://localhost:3001/api";
```

Thay bằng Backend URL của bạn (từ Bước 3):
```javascript
window.API_BASE = "https://your-backend.onrender.com/api";
```

**Ví dụ:** Nếu backend URL là `https://hotel-backend-abc123.onrender.com`
```javascript
window.API_BASE = "https://hotel-backend-abc123.onrender.com/api";
```

### 4.2. Commit và Push thay đổi

```bash
git add frontend/index.html
git commit -m "Update API URL for production"
git push
```

### 4.3. Tạo Static Site trên Render

1. Vào Render Dashboard → **New** → **Static Site**
2. Connect GitHub repository
3. Cấu hình:
   - **Name:** `hotel-management-frontend`
   - **Build Command:** (để trống)
   - **Publish Directory:** `frontend`
   - **Plan:** Free

### 4.4. Deploy Frontend

1. Click **Create Static Site**
2. Đợi deploy (2-3 phút)
3. **Lưu lại Frontend URL:** `https://your-frontend.onrender.com`

## ✅ Bước 5: Cập nhật CORS

1. Quay lại **Backend Service** trên Render
2. Vào **Environment** tab
3. Cập nhật `FRONTEND_URL` = Frontend URL của bạn
4. Click **Save Changes**
5. Render sẽ tự động restart service

## 🧪 Bước 6: Kiểm tra

1. Truy cập Frontend URL
2. Đăng nhập với:
   - Username: `admin`
   - Password: `admin123`
3. Test các chức năng:
   - ✅ Thêm/sửa/xóa khách hàng
   - ✅ Thêm/sửa/xóa phòng
   - ✅ Tạo đặt phòng
   - ✅ Check-in/Check-out
   - ✅ Tạo hóa đơn
   - ✅ QR code thanh toán

## 🔧 Troubleshooting

### Lỗi kết nối database:
- ✅ Kiểm tra DB_HOST, DB_USER, DB_PASSWORD đúng chưa
- ✅ Kiểm tra DB_SSL=true nếu dùng Render database
- ✅ Kiểm tra database đã chạy script setup.sql chưa

### Lỗi CORS:
- ✅ Cập nhật FRONTEND_URL trong backend env vars
- ✅ Restart backend service

### Lỗi 404:
- ✅ Kiểm tra Build Command và Start Command đúng chưa
- ✅ Kiểm tra file structure

### Service bị sleep:
- ✅ Render free tier sẽ sleep sau 15 phút không dùng
- ✅ Lần đầu truy cập sẽ mất 30-60 giây để wake up
- ✅ Cân nhắc upgrade plan cho production

## 📝 Lưu ý quan trọng

1. **Database:** Render free tier chỉ có PostgreSQL. Nếu cần MySQL, dùng:
   - Railway (có MySQL free)
   - PlanetScale (MySQL free tier)
   - Hoặc dịch vụ MySQL hosting khác

2. **Environment Variables:** Không commit file `.env` lên GitHub

3. **API URL:** Nhớ cập nhật trong `frontend/index.html` trước khi deploy frontend

4. **Free Tier Limitations:**
   - Service có thể sleep sau 15 phút
   - Database có giới hạn storage
   - Có thể chậm khi wake up

## 🎯 Tóm tắt các URL cần lưu

- **Backend URL:** `https://your-backend.onrender.com`
- **Frontend URL:** `https://your-frontend.onrender.com`
- **Database Info:** (lưu trong Render dashboard)
