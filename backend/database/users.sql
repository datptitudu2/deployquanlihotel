-- Bảng USERS cho hệ thống đăng nhập
USE btqaqrhlubq9jx1mnksw;

CREATE TABLE IF NOT EXISTS USERS (
    MaUser INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    HoTen VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    VaiTro ENUM('admin', 'nhan_vien', 'quan_ly') DEFAULT 'nhan_vien',
    TrangThai ENUM('active', 'inactive') DEFAULT 'active',
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayCapNhat DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert user mặc định
-- Lưu ý: Trong production, nên hash password bằng bcrypt
-- Tạm thời dùng plain text để dễ test
INSERT IGNORE INTO USERS (Username, Password, HoTen, Email, VaiTro, TrangThai) VALUES
('admin', 'admin123', 'Quản trị viên', 'admin@northwest.com', 'admin', 'active'),
('nhanvien1', 'nv123', 'Nhân viên 1', 'nv1@northwest.com', 'nhan_vien', 'active'),
('quanly1', 'ql123', 'Quản lý 1', 'ql1@northwest.com', 'quan_ly', 'active');

-- Tài khoản test:
-- admin / admin123 (Quản trị viên)
-- nhanvien1 / nv123 (Nhân viên)
-- quanly1 / ql123 (Quản lý)

