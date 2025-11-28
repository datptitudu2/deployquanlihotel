-- Tạo database và user
CREATE DATABASE IF NOT EXISTS hotel_management;
USE hotel_management;

-- Bảng KHACH_HANG
CREATE TABLE IF NOT EXISTS KHACH_HANG (
    MaKH INT PRIMARY KEY AUTO_INCREMENT,
    HoTen VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    SoDienThoai VARCHAR(15),
    CCCD VARCHAR(20) UNIQUE,
    DiaChi TEXT,
    NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bảng LOAIPHONG
CREATE TABLE IF NOT EXISTS LOAIPHONG (
    MaLoai INT PRIMARY KEY AUTO_INCREMENT,
    TenLoai VARCHAR(50) NOT NULL,
    MoTa TEXT,
    GiaCoBan DECIMAL(12,2) NOT NULL,
    SucChua INT NOT NULL,
    DienTich INT,
    TienIch TEXT
);

-- Bảng PHONG
CREATE TABLE IF NOT EXISTS PHONG (
    MaPhong INT PRIMARY KEY AUTO_INCREMENT,
    SoPhong VARCHAR(10) UNIQUE NOT NULL,
    MaLoai INT NOT NULL,
    TinhTrang ENUM('trong', 'da_dat', 'dang_su_dung', 'bao_tri') DEFAULT 'trong',
    FOREIGN KEY (MaLoai) REFERENCES LOAIPHONG(MaLoai)
);

-- Bảng DATPHONG
CREATE TABLE IF NOT EXISTS DATPHONG (
    MaDatPhong INT PRIMARY KEY AUTO_INCREMENT,
    MaKH INT NOT NULL,
    MaPhong INT NOT NULL,
    NgayDat DATETIME DEFAULT CURRENT_TIMESTAMP,
    NgayNhan DATE NOT NULL,
    NgayTra DATE NOT NULL,
    SoNguoi INT NOT NULL,
    TrangThai ENUM('cho_xac_nhan', 'da_xac_nhan', 'da_checkin', 'da_checkout', 'da_huy') DEFAULT 'cho_xac_nhan',
    TongTien DECIMAL(12,2) DEFAULT 0,
    GhiChu TEXT,
    FOREIGN KEY (MaKH) REFERENCES KHACH_HANG(MaKH),
    FOREIGN KEY (MaPhong) REFERENCES PHONG(MaPhong),
    CHECK (NgayTra > NgayNhan)
);

-- Bảng DICHVU
CREATE TABLE IF NOT EXISTS DICHVU (
    MaDV INT PRIMARY KEY AUTO_INCREMENT,
    TenDV VARCHAR(100) NOT NULL,
    MoTa TEXT,
    DonGia DECIMAL(10,2) NOT NULL,
    DonViTinh VARCHAR(20),
    TrangThai ENUM('con', 'het') DEFAULT 'con'
);

-- Bảng SUDUNGDV
CREATE TABLE IF NOT EXISTS SUDUNGDV (
    MaSD INT PRIMARY KEY AUTO_INCREMENT,
    MaDatPhong INT NOT NULL,
    MaDV INT NOT NULL,
    SoLuong INT DEFAULT 1,
    NgaySuDung DATE,
    ThanhTien DECIMAL(10,2),
    FOREIGN KEY (MaDatPhong) REFERENCES DATPHONG(MaDatPhong),
    FOREIGN KEY (MaDV) REFERENCES DICHVU(MaDV)
);

-- Bảng HOADON
CREATE TABLE IF NOT EXISTS HOADON (
    MaHD INT PRIMARY KEY AUTO_INCREMENT,
    MaDatPhong INT NOT NULL UNIQUE,
    NgayLap DATETIME DEFAULT CURRENT_TIMESTAMP,
    TongTien DECIMAL(12,2) NOT NULL,
    PhuongThucTT ENUM('tien_mat', 'chuyen_khoan', 'the') DEFAULT 'tien_mat',
    TrangThai ENUM('chua_thanh_toan', 'da_thanh_toan') DEFAULT 'chua_thanh_toan',
    FOREIGN KEY (MaDatPhong) REFERENCES DATPHONG(MaDatPhong)
);

-- Insert sample data (chỉ insert nếu chưa có)
INSERT IGNORE INTO LOAIPHONG (TenLoai, MoTa, GiaCoBan, SucChua, DienTich, TienIch) VALUES
('Standard', 'Phòng tiêu chuẩn, view thành phố', 800000, 2, 25, 'TV, WiFi, Điều hòa, Mini bar'),
('Deluxe', 'Phòng cao cấp, view biển', 1200000, 3, 35, 'TV, WiFi, Điều hòa, Mini bar, Ban công'),
('Suite', 'Suite sang trọng, đầy đủ tiện nghi', 2500000, 4, 50, 'TV, WiFi, Điều hòa, Mini bar, Ban công, Bồn tắm');

INSERT IGNORE INTO PHONG (SoPhong, MaLoai, TinhTrang) VALUES
('101', 1, 'trong'), ('102', 1, 'trong'), ('103', 1, 'trong'),
('201', 2, 'trong'), ('202', 2, 'trong'), ('203', 2, 'dang_su_dung'),
('301', 3, 'trong'), ('302', 3, 'da_dat');

INSERT IGNORE INTO KHACH_HANG (HoTen, Email, SoDienThoai, CCCD, DiaChi) VALUES
('Nguyễn Văn An', 'nguyenvana@email.com', '0912345678', '001123456789', 'Hà Nội'),
('Trần Thị Bình', 'tranthib@email.com', '0912345679', '001123456790', 'Hồ Chí Minh'),
('Lê Văn Cường', 'levanc@email.com', '0912345680', '001123456791', 'Đà Nẵng');

INSERT IGNORE INTO DICHVU (TenDV, MoTa, DonGia, DonViTinh) VALUES
('Buffet sáng', 'Buffet ăn sáng tự chọn', 150000, 'người'),
('Massage thư giãn', 'Dịch vụ massage toàn thân', 300000, 'lần'),
('Giặt ủi', 'Dịch vụ giặt ủi cao cấp', 100000, 'kg');

INSERT IGNORE INTO DATPHONG (MaKH, MaPhong, NgayNhan, NgayTra, SoNguoi, TrangThai, TongTien) VALUES
(1, 6, '2024-01-20', '2024-01-22', 2, 'da_checkin', 2400000),
(2, 8, '2024-01-25', '2024-01-27', 4, 'da_xac_nhan', 5000000);