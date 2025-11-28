# Hướng dẫn Deploy lên Render

## ✅ Đã hoàn thành:
- [x] Push code lên GitHub
- [x] Setup database trên Clever Cloud
- [x] Chạy SQL files (setup.sql, users.sql)

## 📋 Bước tiếp theo:

### 1. Deploy Backend lên Render

1. Vào https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect repository GitHub của bạn
4. Cấu hình:
   - **Name**: `hotel-backend` (hoặc tên bạn muốn)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Environment Variables** (thêm các biến sau):
   ```
   DB_HOST=btqaqrhlubq9jx1mnksw-mysql.services.clever-cloud.com
   DB_USER=uyyjr0zureey1qzy
   DB_PASSWORD=<password từ Clever Cloud>
   DB_NAME=btqaqrhlubq9jx1mnksw
   DB_PORT=3306
   DB_SSL=true
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-name.onrender.com
   ```
   ⚠️ **Lưu ý**: `FRONTEND_URL` tạm thời để `http://localhost:5500`, sau khi deploy frontend xong sẽ cập nhật lại.

6. Click **"Create Web Service"** và đợi deploy xong
7. **Lưu lại Backend URL** (ví dụ: `https://hotel-backend.onrender.com`)

---

### 2. Cập nhật Frontend với Backend URL

1. Mở file `frontend/index.html`
2. Tìm dòng:
   ```javascript
   const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
   window.API_BASE = isProduction 
     ? "https://your-backend.onrender.com/api" // ← Sửa dòng này
     : "http://localhost:3001/api";
   ```
3. Thay `https://your-backend.onrender.com/api` bằng Backend URL thực tế của bạn
4. Commit và push lên GitHub:
   ```bash
   git add frontend/index.html
   git commit -m "Update backend URL"
   git push
   ```

---

### 3. Deploy Frontend lên Render

1. Vào https://dashboard.render.com
2. Click **"New +"** → **"Static Site"**
3. Connect repository GitHub của bạn
4. Cấu hình:
   - **Name**: `hotel-frontend` (hoặc tên bạn muốn)
   - **Root Directory**: `frontend`
   - **Build Command**: (để trống)
   - **Publish Directory**: `frontend`
   - **Plan**: Free

5. Click **"Create Static Site"** và đợi deploy xong
6. **Lưu lại Frontend URL** (ví dụ: `https://hotel-frontend.onrender.com`)

---

### 4. Cập nhật CORS trong Backend

1. Vào Backend service trên Render
2. Vào tab **"Environment"**
3. Cập nhật biến `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://hotel-frontend.onrender.com
   ```
   (Thay bằng Frontend URL thực tế của bạn)

4. Click **"Save Changes"** → Render sẽ tự động redeploy

---

### 5. Kiểm tra

1. Mở Frontend URL trên trình duyệt
2. Đăng nhập với:
   - Username: `admin`
   - Password: `admin123`
3. Kiểm tra các chức năng hoạt động

---

## 🔑 Thông tin đăng nhập mặc định:
- **Admin**: `admin` / `admin123`
- **Nhân viên**: `nhanvien1` / `nv123`
- **Quản lý**: `quanly1` / `ql123`

---

## ⚠️ Lưu ý quan trọng:

1. **Database Password**: Lấy từ Clever Cloud console (đã có sẵn)
2. **Backend URL**: Phải có format `https://xxx.onrender.com` (không có `/api` ở cuối)
3. **Frontend URL**: Phải có format `https://xxx.onrender.com`
4. **CORS**: Sau khi deploy frontend xong, nhớ cập nhật `FRONTEND_URL` trong backend environment variables

