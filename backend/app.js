const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();
const app = express();

// CORS configuration
// Cho phép TẤT CẢ origins để hỗ trợ web, mobile, và các domain khác nhau
const corsOptions = {
    origin: '*', // Cho phép tất cả origins (web, mobile, Postman, etc.)
    credentials: false, // Không cần credentials khi dùng origin: '*'
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};
app.use(cors(corsOptions));
app.use(express.json());

// Database connection - Sử dụng connection pool để tránh lỗi "connection in closed state"
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'hotel_management',
    port: process.env.DB_PORT || 3306,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    reconnect: true
});

// Test connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed: ' + err.stack);
        return;
    }
    console.log('✅ Connected to hotel_management database');
    connection.release();
});

// Helper function để query với pool
function query(sql, params) {
    return new Promise((resolve, reject) => {
        pool.query(sql, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

// Giữ lại connection cũ để tương thích (sẽ dùng pool thay thế)
const connection = {
    query: (sql, params, callback) => {
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        pool.query(sql, params, callback);
    },
    state: 'authenticated' // Giả lập state
};

// ==================== AUTHENTICATION API ====================
app.post('/api/auth/login', (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username và password là bắt buộc' });
        }
        
        // Kiểm tra connection state và reconnect nếu cần
        if (connection.state === 'disconnected') {
            console.log('⚠️ Database disconnected, attempting to reconnect...');
            connection.connect((err) => {
                if (err) {
                    console.error('❌ Reconnection failed:', err);
                    return res.status(500).json({ error: 'Lỗi kết nối database. Vui lòng thử lại sau.' });
                }
                console.log('✅ Database reconnected');
            });
        }
        
        const query = 'SELECT * FROM USERS WHERE Username = ? AND TrangThai = "active"';
        
        connection.query(query, [username], (err, results) => {
            if (err) {
                console.error('❌ Lỗi query login:', err);
                console.error('Error code:', err.code);
                console.error('Error message:', err.message);
                
                // Xử lý các lỗi cụ thể
                if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT' || err.code === 'PROTOCOL_CONNECTION_LOST') {
                    return res.status(500).json({ error: 'Không thể kết nối đến database. Vui lòng thử lại sau.' });
                }
                if (err.code === 'ER_NO_SUCH_TABLE') {
                    return res.status(500).json({ error: 'Bảng USERS không tồn tại. Vui lòng chạy script setup database.' });
                }
                if (err.code === 'ER_ACCESS_DENIED_ERROR') {
                    return res.status(500).json({ error: 'Lỗi xác thực database. Vui lòng kiểm tra cấu hình.' });
                }
                
                return res.status(500).json({ error: 'Lỗi server: ' + (err.message || 'Vui lòng thử lại sau.') });
            }
            
            if (results.length === 0) {
                return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' });
            }
            
            const user = results[0];
            
            // So sánh password (trong production nên dùng bcrypt)
            if (user.Password !== password) {
                return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' });
            }
            
            // Tạo token đơn giản (trong production nên dùng JWT)
            const token = Buffer.from(`${user.MaUser}:${user.Username}:${Date.now()}`).toString('base64');
            
            // Trả về thông tin user (không bao gồm password)
            const { Password, ...userWithoutPassword } = user;
            
            res.json({
                success: true,
                token: token,
                user: userWithoutPassword
            });
        });
    } catch (error) {
        console.error('❌ Unexpected error in login:', error);
        return res.status(500).json({ error: 'Lỗi server không mong đợi: ' + error.message });
    }
});

// ==================== USERS MANAGEMENT API (Admin only) ====================
app.get('/api/users', (req, res) => {
    const query = 'SELECT MaUser, Username, HoTen, Email, VaiTro, TrangThai, NgayTao, NgayCapNhat FROM USERS ORDER BY MaUser';
    
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Lỗi query users:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results || []);
    });
});

app.post('/api/users', (req, res) => {
    const { Username, Password, HoTen, Email, VaiTro, TrangThai } = req.body;
    
    if (!Username || !Password || !HoTen) {
        return res.status(400).json({ error: 'Username, Password và Họ tên là bắt buộc' });
    }
    
    const query = 'INSERT INTO USERS (Username, Password, HoTen, Email, VaiTro, TrangThai) VALUES (?, ?, ?, ?, ?, ?)';
    
    connection.query(query, [Username, Password, HoTen, Email || null, VaiTro || 'nhan_vien', TrangThai || 'active'], (err, results) => {
        if (err) {
            console.error('Lỗi tạo user:', err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Username đã tồn tại' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Nhân viên thêm thành công', id: results.insertId });
    });
});

app.put('/api/users/:id', (req, res) => {
    const { Username, Password, HoTen, Email, VaiTro, TrangThai } = req.body;
    
    // Nếu có password, cập nhật cả password
    if (Password && Password.trim() !== '') {
        const query = 'UPDATE USERS SET Username=?, Password=?, HoTen=?, Email=?, VaiTro=?, TrangThai=? WHERE MaUser=?';
        connection.query(query, [Username, Password, HoTen, Email || null, VaiTro, TrangThai, req.params.id], (err, results) => {
            if (err) {
                console.error('Lỗi cập nhật user:', err);
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Nhân viên cập nhật thành công' });
        });
    } else {
        // Không có password, chỉ cập nhật các trường khác
        const query = 'UPDATE USERS SET Username=?, HoTen=?, Email=?, VaiTro=?, TrangThai=? WHERE MaUser=?';
        connection.query(query, [Username, HoTen, Email || null, VaiTro, TrangThai, req.params.id], (err, results) => {
            if (err) {
                console.error('Lỗi cập nhật user:', err);
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Nhân viên cập nhật thành công' });
        });
    }
});

app.delete('/api/users/:id', (req, res) => {
    // Thay vì xóa, vô hiệu hóa user
    const query = 'UPDATE USERS SET TrangThai="inactive" WHERE MaUser=?';
    
    connection.query(query, [req.params.id], (err, results) => {
        if (err) {
            console.error('Lỗi vô hiệu hóa user:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Nhân viên đã được vô hiệu hóa' });
    });
});

// ==================== CUSTOMERS API ====================
app.get('/api/customers', (req, res) => {
    connection.query('SELECT * FROM KHACH_HANG ORDER BY MaKH', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/customers', (req, res) => {
    const { HoTen, Email, SoDienThoai, CCCD, DiaChi } = req.body;
    const query = 'INSERT INTO KHACH_HANG (HoTen, Email, SoDienThoai, CCCD, DiaChi) VALUES (?, ?, ?, ?, ?)';
    
    connection.query(query, [HoTen, Email, SoDienThoai, CCCD, DiaChi], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Khách hàng thêm thành công', id: results.insertId });
    });
});

app.put('/api/customers/:id', (req, res) => {
    const { HoTen, Email, SoDienThoai, CCCD, DiaChi } = req.body;
    const query = 'UPDATE KHACH_HANG SET HoTen=?, Email=?, SoDienThoai=?, CCCD=?, DiaChi=? WHERE MaKH=?';
    
    connection.query(query, [HoTen, Email, SoDienThoai, CCCD, DiaChi, req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Khách hàng cập nhật thành công' });
    });
});

app.delete('/api/customers/:id', (req, res) => {
    connection.query('DELETE FROM KHACH_HANG WHERE MaKH = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Khách hàng xóa thành công' });
    });
});

// ==================== ROOMS API ====================
app.get('/api/rooms', (req, res) => {
    const query = `
        SELECT 
            p.MaPhong,
            p.SoPhong,
            lp.TenLoai AS LoaiPhong,
            lp.GiaCoBan AS GiaPhong,
            lp.SucChua AS SoNguoiToiDa,
            p.TinhTrang,
            CASE 
                WHEN p.TinhTrang = 'trong' THEN 'Trống'
                WHEN p.TinhTrang = 'da_dat' THEN 'Đã đặt'
                WHEN p.TinhTrang = 'dang_su_dung' THEN 'Đang sử dụng'
                WHEN p.TinhTrang = 'bao_tri' THEN 'Bảo trì'
                ELSE p.TinhTrang
            END AS TrangThai
        FROM PHONG p
        LEFT JOIN LOAIPHONG lp ON p.MaLoai = lp.MaLoai
        ORDER BY p.SoPhong
    `;
    connection.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/rooms', (req, res) => {
    const { SoPhong, MaLoai, TinhTrang } = req.body;
    const query = 'INSERT INTO PHONG (SoPhong, MaLoai, TinhTrang) VALUES (?, ?, ?)';
    
    connection.query(query, [SoPhong, MaLoai || 1, TinhTrang || 'trong'], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Phòng thêm thành công', id: results.insertId });
    });
});

app.put('/api/rooms/:id', (req, res) => {
    const { SoPhong, MaLoai, TinhTrang } = req.body;
    const query = 'UPDATE PHONG SET SoPhong=?, MaLoai=?, TinhTrang=? WHERE MaPhong=?';
    
    connection.query(query, [SoPhong, MaLoai, TinhTrang, req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Phòng cập nhật thành công' });
    });
});

app.delete('/api/rooms/:id', (req, res) => {
    connection.query('DELETE FROM PHONG WHERE MaPhong = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Phòng xóa thành công' });
    });
});

// ==================== SERVICES API ====================
app.get('/api/services', (req, res) => {
    connection.query('SELECT * FROM DICHVU ORDER BY MaDV', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/services', (req, res) => {
    const { TenDV, MoTa, DonGia, DonViTinh } = req.body;
    const query = 'INSERT INTO DICHVU (TenDV, MoTa, DonGia, DonViTinh) VALUES (?, ?, ?, ?)';
    
    connection.query(query, [TenDV, MoTa || null, DonGia, DonViTinh || null], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Dịch vụ thêm thành công', id: results.insertId });
    });
});

app.put('/api/services/:id', (req, res) => {
    const { TenDV, MoTa, DonGia, DonViTinh } = req.body;
    const query = 'UPDATE DICHVU SET TenDV=?, MoTa=?, DonGia=?, DonViTinh=? WHERE MaDV=?';
    
    connection.query(query, [TenDV, MoTa || null, DonGia, DonViTinh || null, req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Dịch vụ cập nhật thành công' });
    });
});

app.delete('/api/services/:id', (req, res) => {
    connection.query('DELETE FROM DICHVU WHERE MaDV = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Dịch vụ xóa thành công' });
    });
});

// ==================== BOOKINGS API ====================
app.get('/api/bookings', (req, res) => {
    const query = `
        SELECT 
            dp.MaDatPhong AS MaDP,
            dp.MaKH,
            kh.HoTen AS TenKH,
            p.SoPhong AS MaPhong,
            lp.TenLoai AS LoaiPhong,
            dp.NgayDat,
            dp.NgayNhan,
            dp.NgayTra,
            dp.SoNguoi,
            dp.TrangThai,
            CASE 
                WHEN dp.TrangThai = 'cho_xac_nhan' THEN 'Chờ xác nhận'
                WHEN dp.TrangThai = 'da_xac_nhan' THEN 'Đã xác nhận'
                WHEN dp.TrangThai = 'da_checkin' THEN 'Đã check-in'
                WHEN dp.TrangThai = 'da_checkout' THEN 'Đã check-out'
                WHEN dp.TrangThai = 'da_huy' THEN 'Đã hủy'
                ELSE dp.TrangThai
            END AS TrangThaiText,
            dp.TongTien
        FROM DATPHONG dp
        JOIN KHACH_HANG kh ON dp.MaKH = kh.MaKH
        JOIN PHONG p ON dp.MaPhong = p.MaPhong
        LEFT JOIN LOAIPHONG lp ON p.MaLoai = lp.MaLoai
        ORDER BY dp.NgayDat DESC
    `;
    connection.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/bookings', (req, res) => {
    const { MaKH, MaPhong, NgayNhan, NgayTra, SoNguoi, TrangThai, TongTien } = req.body;
    const query = 'INSERT INTO DATPHONG (MaKH, MaPhong, NgayNhan, NgayTra, SoNguoi, TrangThai, TongTien) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    connection.query(query, [MaKH, MaPhong, NgayNhan, NgayTra, SoNguoi, TrangThai || 'cho_xac_nhan', TongTien || 0], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Đặt phòng thành công', id: results.insertId });
    });
});

app.put('/api/bookings/:id', (req, res) => {
    const { MaKH, MaPhong, NgayNhan, NgayTra, SoNguoi, TrangThai, TongTien } = req.body;
    
    // Nếu chỉ có TrangThai, chỉ cập nhật trạng thái
    if (Object.keys(req.body).length === 1 && req.body.TrangThai) {
        const query = 'UPDATE DATPHONG SET TrangThai=? WHERE MaDatPhong=?';
        connection.query(query, [TrangThai, req.params.id], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Trạng thái cập nhật thành công' });
        });
    } else {
        // Cập nhật đầy đủ thông tin
        const query = 'UPDATE DATPHONG SET MaKH=?, MaPhong=?, NgayNhan=?, NgayTra=?, SoNguoi=?, TrangThai=?, TongTien=? WHERE MaDatPhong=?';
        connection.query(query, [MaKH, MaPhong, NgayNhan, NgayTra, SoNguoi, TrangThai, TongTien || 0, req.params.id], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Đặt phòng cập nhật thành công' });
        });
    }
});

// Endpoint riêng để cập nhật chỉ trạng thái
app.put('/api/bookings/:id/status', (req, res) => {
    const { TrangThai } = req.body;
    const query = 'UPDATE DATPHONG SET TrangThai=? WHERE MaDatPhong=?';
    
    connection.query(query, [TrangThai, req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Trạng thái cập nhật thành công' });
    });
});

app.delete('/api/bookings/:id', (req, res) => {
    connection.query('DELETE FROM DATPHONG WHERE MaDatPhong = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Đặt phòng xóa thành công' });
    });
});

// ==================== INVOICES API ====================
app.get('/api/invoices', (req, res) => {
    const query = `
        SELECT hd.*, kh.HoTen as TenKH, dp.MaPhong 
        FROM HOADON hd
        JOIN DATPHONG dp ON hd.MaDatPhong = dp.MaDatPhong
        JOIN KHACH_HANG kh ON dp.MaKH = kh.MaKH
        ORDER BY hd.MaHD DESC
    `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Lỗi query invoices:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results || []);
    });
});

// ==================== SERVICE USAGE API ====================
app.get('/api/usage', (req, res) => {
    const query = `
        SELECT sd.*, dv.TenDV, kh.HoTen as TenKH 
        FROM SUDUNGDV sd
        JOIN DICHVU dv ON sd.MaDV = dv.MaDV
        JOIN DATPHONG dp ON sd.MaDatPhong = dp.MaDatPhong
        JOIN KHACH_HANG kh ON dp.MaKH = kh.MaKH
        ORDER BY sd.MaSD DESC
    `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Lỗi query usage:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results || []);
    });
});

app.post('/api/invoices', (req, res) => {
    const { MaDatPhong, TongTien, PhuongThucTT, TrangThai } = req.body;
    const query = 'INSERT INTO HOADON (MaDatPhong, TongTien, PhuongThucTT, TrangThai) VALUES (?, ?, ?, ?)';
    
    connection.query(query, [MaDatPhong, TongTien, PhuongThucTT || 'tien_mat', TrangThai || 'chua_thanh_toan'], (err, results) => {
        if (err) {
            console.error('Lỗi tạo hóa đơn:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Hóa đơn thêm thành công', id: results.insertId });
    });
});

app.put('/api/invoices/:id/status', (req, res) => {
    const { TrangThai } = req.body;
    const query = 'UPDATE HOADON SET TrangThai=? WHERE MaHD=?';
    
    connection.query(query, [TrangThai, req.params.id], (err, results) => {
        if (err) {
            console.error('Lỗi cập nhật trạng thái hóa đơn:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Trạng thái hóa đơn cập nhật thành công' });
    });
});

app.delete('/api/invoices/:id', (req, res) => {
    connection.query('DELETE FROM HOADON WHERE MaHD = ?', [req.params.id], (err, results) => {
        if (err) {
            console.error('Lỗi xóa hóa đơn:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Hóa đơn xóa thành công' });
    });
});

// ==================== PAYMENT WEBHOOK & API ====================
// Webhook endpoint để nhận thông báo thanh toán từ dịch vụ bên thứ 3
// Có thể tích hợp với: VietQR, VNPay, MoMo, ZaloPay, Napas, etc.
app.post('/api/payment/webhook', (req, res) => {
    const { invoiceId, transactionId, amount, status, provider } = req.body;
    
    // Xác thực webhook (nên thêm signature verification)
    // if (!verifyWebhookSignature(req)) {
    //     return res.status(401).json({ error: 'Invalid signature' });
    // }
    
    if (status === 'success' || status === 'paid') {
        // Cập nhật trạng thái hóa đơn
        const query = 'UPDATE HOADON SET TrangThai=? WHERE MaHD=?';
        connection.query(query, ['da_thanh_toan', invoiceId], (err, results) => {
            if (err) {
                console.error('Lỗi cập nhật trạng thái từ webhook:', err);
                return res.status(500).json({ error: err.message });
            }
            console.log(`✅ Webhook: Hóa đơn ${invoiceId} đã được thanh toán qua ${provider || 'unknown'}`);
            res.json({ message: 'Payment confirmed', invoiceId });
        });
    } else {
        res.json({ message: 'Payment status received', status });
    }
});

// API để kiểm tra trạng thái giao dịch (polling)
app.get('/api/payment/check/:invoiceId', (req, res) => {
    const invoiceId = req.params.invoiceId;
    
    // Kiểm tra trạng thái hóa đơn
    connection.query('SELECT TrangThai FROM HOADON WHERE MaHD = ?', [invoiceId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        res.json({ 
            invoiceId, 
            status: results[0].TrangThai,
            isPaid: results[0].TrangThai === 'da_thanh_toan'
        });
    });
});

// API để tạo QR code qua dịch vụ bên thứ 3 (VietQR, VNPay, etc.)
app.post('/api/payment/generate-qr', async (req, res) => {
    const { invoiceId, amount, content } = req.body;
    
    // TODO: Tích hợp với API dịch vụ bên thứ 3
    // Ví dụ với VietQR API:
    // const vietqrResponse = await fetch('https://api.vietqr.io/v2/generate', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //         accountNo: '100878031328',
    //         accountName: 'NORTHWEST HOTEL',
    //         acqId: '970415', // Vietinbank
    //         amount: amount,
    //         addInfo: content,
    //         format: 'text',
    //         template: 'compact'
    //     })
    // });
    // const qrData = await vietqrResponse.json();
    
    // Tạm thời trả về thông tin để frontend tự tạo QR
    res.json({
        success: true,
        message: 'QR code data generated',
        data: {
            accountNo: '100878031328',
            accountName: 'NORTHWEST HOTEL',
            bankCode: '970415', // Vietinbank
            amount: amount,
            content: content
        }
    });
});

app.post('/api/usage', (req, res) => {
    const { MaDatPhong, MaDV, SoLuong, NgaySuDung } = req.body;
    
    // Tính thành tiền từ đơn giá dịch vụ
    connection.query('SELECT DonGia FROM DICHVU WHERE MaDV = ?', [MaDV], (err, serviceResult) => {
        if (err) {
            console.error('Lỗi lấy giá dịch vụ:', err);
            return res.status(500).json({ error: err.message });
        }
        
        if (serviceResult.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy dịch vụ' });
        }
        
        const donGia = parseFloat(serviceResult[0].DonGia) || 0;
        const thanhTien = donGia * (parseInt(SoLuong) || 1);
        
        const query = 'INSERT INTO SUDUNGDV (MaDatPhong, MaDV, SoLuong, NgaySuDung, ThanhTien) VALUES (?, ?, ?, ?, ?)';
        
        connection.query(query, [MaDatPhong, MaDV, SoLuong || 1, NgaySuDung || null, thanhTien], (err, results) => {
            if (err) {
                console.error('Lỗi tạo sử dụng dịch vụ:', err);
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Sử dụng dịch vụ thêm thành công', id: results.insertId });
        });
    });
});

app.delete('/api/usage/:id', (req, res) => {
    connection.query('DELETE FROM SUDUNGDV WHERE MaSD = ?', [req.params.id], (err, results) => {
        if (err) {
            console.error('Lỗi xóa sử dụng dịch vụ:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Sử dụng dịch vụ xóa thành công' });
    });
});

// Test route
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Backend CRUD API is working!', 
        timestamp: new Date(),
        endpoints: [
            '/api/auth/login - POST',
            '/api/users - GET,POST,PUT,DELETE (Admin only)',
            '/api/customers - GET,POST,PUT,DELETE',
            '/api/rooms - GET,POST,PUT,DELETE', 
            '/api/services - GET,POST,PUT,DELETE',
            '/api/bookings - GET,POST,PUT,DELETE',
            '/api/invoices - GET,POST,PUT,DELETE',
            '/api/usage - GET,POST,DELETE',
            '/api/payment/generate-qr - POST',
            '/api/payment/check/:invoiceId - GET'
        ]
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 CRUD Server running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api/test`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});