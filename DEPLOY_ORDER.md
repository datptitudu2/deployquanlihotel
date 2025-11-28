# 📋 Thứ tự Deploy (QUAN TRỌNG)

## ✅ Câu trả lời ngắn gọn:

1. **Git:** Đẩy **CẢ DỰ ÁN** (backend + frontend) lên **1 repository GitHub**
2. **Không tách riêng:** Backend và frontend ở cùng 1 repo
3. **Thứ tự:** Deploy backend TRƯỚC → Sửa frontend → Deploy frontend SAU

## 🔄 Quy trình chi tiết:

### Bước 1: Push toàn bộ dự án lên GitHub (1 repo)

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

**Lưu ý:** Push **CẢ backend VÀ frontend** cùng lúc, không tách riêng!

### Bước 2: Deploy Backend TRƯỚC

1. Tạo Web Service trên Render
2. Connect GitHub repo (cùng repo vừa push)
3. Cấu hình:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
4. Thêm Environment Variables
5. Deploy → **Lấy Backend URL**

**Ví dụ Backend URL:** `https://hotel-backend-abc123.onrender.com`

### Bước 3: Sửa Frontend (QUAN TRỌNG!)

**Phải làm TRƯỚC khi deploy frontend!**

**Lưu ý:** Code đã có tự động detect, nhưng nếu backend và frontend khác domain thì vẫn cần sửa thủ công.

#### Cách 1: Sửa thủ công (Khuyến nghị - Chắc chắn)

1. Mở file `frontend/index.html`
2. Tìm dòng **2135-2138** (trong thẻ `<script>`)
3. Tìm đoạn code:
   ```javascript
   const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
   window.API_BASE = isProduction 
     ? `${window.location.protocol}//${window.location.hostname}/api`
     : "http://localhost:3001/api";
   ```
4. Thay bằng Backend URL thực tế (đơn giản hơn):
   ```javascript
   window.API_BASE = "https://hotel-backend-abc123.onrender.com/api";
   ```
5. **Lưu file**

#### Cách 2: Giữ nguyên (Nếu backend và frontend cùng domain)

Nếu bạn deploy backend và frontend cùng domain (không khuyến nghị), code tự động sẽ hoạt động.

### Bước 4: Commit và Push thay đổi

```bash
git add frontend/index.html
git commit -m "Update API URL for production"
git push
```

### Bước 5: Deploy Frontend SAU

1. Tạo Static Site trên Render
2. Connect **CÙNG GitHub repo** (không phải repo mới!)
3. Cấu hình:
   - Publish Directory: `frontend`
4. Deploy → **Lấy Frontend URL**

### Bước 6: Cập nhật CORS

1. Quay lại Backend service
2. Cập nhật `FRONTEND_URL` = Frontend URL
3. Restart service

## 📁 Cấu trúc Repository:

```
your-repo/
├── backend/
│   ├── app.js
│   ├── package.json
│   ├── env.example
│   └── database/
├── frontend/
│   ├── index.html
│   └── app.js
├── README.md
├── DEPLOY.md
└── .gitignore
```

**1 repo, 2 services trên Render:**
- Service 1: Backend (chạy từ thư mục `backend/`)
- Service 2: Frontend (publish từ thư mục `frontend/`)

## ⚠️ Lưu ý:

1. **KHÔNG tách riêng:** Backend và frontend cùng 1 repo GitHub
2. **Phải sửa frontend:** Sau khi deploy backend, lấy URL và sửa trong `frontend/index.html`
3. **Thứ tự:** Backend → Sửa frontend → Frontend → CORS
4. **Cùng repo:** Cả 2 services trên Render đều connect cùng 1 GitHub repo

## 🎯 Tóm tắt:

```
GitHub (1 repo)
    ↓
    ├── Backend Service (Render) → Lấy URL
    │       ↓
    │   Sửa frontend/index.html với Backend URL
    │       ↓
    └── Frontend Service (Render) → Hoàn thành!
```

