# 📖 Hướng dẫn Deploy từng bước (Tiếng Việt)

## 🎯 Tổng quan

Bạn sẽ deploy 2 phần:
1. **Backend** (API) - Chạy Node.js
2. **Frontend** (Giao diện) - Static website

## 📋 Checklist chuẩn bị

- [ ] Đã có tài khoản GitHub
- [ ] Đã có tài khoản Render (hoặc Railway cho MySQL)
- [ ] Code đã chạy được local
- [ ] Đã test các chức năng

## 🗄️ Bước 1: Tạo Database

### Cách 1: Railway (MySQL - Khuyến nghị)

1. Vào https://railway.app → Đăng nhập bằng GitHub
2. Click **New Project** → **Add MySQL**
3. Click vào MySQL service → Tab **Variables**
4. **Lưu lại:**
   - `MYSQLHOST`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`
   - `MYSQLPORT`

5. Click tab **Connect** → Copy connection string
6. Dùng MySQL Workbench hoặc CLI kết nối
7. Chạy 2 file SQL:
   - `backend/database/setup.sql`
   - `backend/database/users.sql`

### Cách 2: Render PostgreSQL (Cần sửa code)

Nếu dùng PostgreSQL, cần sửa code backend.

## 📤 Bước 2: Push code lên GitHub

**QUAN TRỌNG:** Push **CẢ DỰ ÁN** (backend + frontend) lên **1 repository**, không tách riêng!

```bash
# 1. Khởi tạo git (nếu chưa có)
git init

# 2. Thêm tất cả files
git add .

# 3. Commit
git commit -m "Ready for deployment"

# 4. Tạo repo trên GitHub (vào github.com → New repository)
#    - Đặt tên: hotel-management (hoặc tên bạn muốn)
#    - Public hoặc Private đều được
#    - KHÔNG tạo README, .gitignore (đã có sẵn)

# 5. Thêm remote (thay YOUR_USERNAME và YOUR_REPO)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 6. Push
git push -u origin main
```

**Lưu ý:** 
- ✅ Push **CẢ backend VÀ frontend** cùng lúc
- ❌ KHÔNG tách thành 2 repo riêng
- ✅ Render sẽ dùng cùng 1 repo này cho cả 2 services

## 🔧 Bước 3: Deploy Backend

### 3.1. Tạo Web Service

1. Vào https://render.com → Dashboard
2. Click **New** → **Web Service**
3. Connect GitHub → Chọn repository của bạn
4. Click **Connect**

### 3.2. Cấu hình

Điền các thông tin:

- **Name:** `hotel-management-backend`
- **Environment:** `Node`
- **Region:** Chọn gần nhất (Singapore)
- **Branch:** `main`
- **Root Directory:** (để trống)
- **Build Command:** `cd backend && npm install`
- **Start Command:** `cd backend && npm start`
- **Plan:** Free

### 3.3. Environment Variables

Scroll xuống phần **Environment Variables**, click **Add Environment Variable** và thêm:

1. `NODE_ENV` = `production`
2. `PORT` = `3001`
3. `DB_HOST` = (lấy từ Railway/Render database)
4. `DB_USER` = (lấy từ Railway/Render database)
5. `DB_PASSWORD` = (lấy từ Railway/Render database)
6. `DB_NAME` = `hotel_management`
7. `DB_PORT` = `3306` (hoặc `5432` nếu PostgreSQL)
8. `DB_SSL` = `true`
9. `FRONTEND_URL` = `https://your-frontend.onrender.com` (sẽ cập nhật sau)

### 3.4. Deploy

1. Click **Create Web Service**
2. Đợi build (5-10 phút)
3. Khi thấy **Live** màu xanh → Thành công!
4. **Copy URL:** `https://your-backend.onrender.com`
5. Test: Mở URL + `/api/test` trong browser

## 🎨 Bước 4: Deploy Frontend

### 4.1. Cập nhật API URL

**QUAN TRỌNG:** Phải làm trước khi deploy!

1. Mở file `frontend/index.html`
2. Tìm dòng **2135** (gần cuối file, trong thẻ `<script>`)
3. Tìm: `window.API_BASE = "http://localhost:3001/api";`
4. Thay bằng Backend URL của bạn:
   ```javascript
   window.API_BASE = "https://your-backend.onrender.com/api";
   ```
5. **Lưu file**

### 4.2. Commit và Push

```bash
git add frontend/index.html
git commit -m "Update API URL for production"
git push
```

### 4.3. Tạo Static Site

**Lưu ý:** Connect **CÙNG repository** như backend, không phải repo mới!

1. Render Dashboard → **New** → **Static Site**
2. Connect GitHub → Chọn **CÙNG repository** như backend
3. Cấu hình:
   - **Name:** `hotel-management-frontend`
   - **Branch:** `main`
   - **Root Directory:** (để trống)
   - **Build Command:** (để trống)
   - **Publish Directory:** `frontend`
   - **Plan:** Free

### 4.4. Deploy

1. Click **Create Static Site**
2. Đợi deploy (2-3 phút)
3. **Copy URL:** `https://your-frontend.onrender.com`

## ✅ Bước 5: Cập nhật CORS

1. Quay lại **Backend Service** trên Render
2. Vào tab **Environment**
3. Tìm `FRONTEND_URL`
4. Click **Edit** → Thay bằng Frontend URL của bạn
5. Click **Save Changes**
6. Render tự động restart

## 🧪 Bước 6: Test

1. Mở Frontend URL
2. Đăng nhập:
   - Username: `admin`
   - Password: `admin123`
3. Test các chức năng

## ❌ Xử lý lỗi

### Backend không chạy:
- Kiểm tra logs trong Render Dashboard
- Kiểm tra environment variables đúng chưa
- Kiểm tra database connection

### Frontend không kết nối được backend:
- Kiểm tra API URL trong `frontend/index.html`
- Kiểm tra CORS settings
- Kiểm tra backend đang chạy chưa

### Database connection error:
- Kiểm tra DB_HOST, DB_USER, DB_PASSWORD
- Kiểm tra DB_SSL=true
- Kiểm tra database đã chạy setup.sql chưa

## 📝 Lưu ý

- Render free tier có thể sleep sau 15 phút
- Lần đầu truy cập sau khi sleep sẽ mất 30-60 giây
- Database free tier có giới hạn storage

