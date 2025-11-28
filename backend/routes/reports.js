const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// Monthly revenue report
router.get('/monthly-revenue', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                YEAR(hd.NgayLap) AS Nam,
                MONTH(hd.NgayLap) AS Thang,
                COUNT(hd.MaHD) AS SoHoaDon,
                SUM(hd.TongTien) AS TongDoanhThu,
                AVG(hd.TongTien) AS DoanhThuTrungBinh
            FROM HOADON hd
            WHERE hd.TrangThai = 'da_thanh_toan'
            GROUP BY YEAR(hd.NgayLap), MONTH(hd.NgayLap)
            ORDER BY Nam DESC, Thang DESC
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Room performance report
router.get('/room-performance', async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                lp.TenLoai,
                COUNT(p.MaPhong) AS TongPhong,
                SUM(CASE WHEN p.TinhTrang = 'trong' THEN 1 ELSE 0 END) AS PhongTrong,
                SUM(CASE WHEN p.TinhTrang = 'dang_su_dung' THEN 1 ELSE 0 END) AS PhongDangSuDung,
                ROUND(
                    (SUM(CASE WHEN p.TinhTrang IN ('dang_su_dung', 'da_dat') THEN 1 ELSE 0 END) * 100.0 / COUNT(p.MaPhong)),
                    2
                ) AS TyLeLapDay
            FROM LOAIPHONG lp
            LEFT JOIN PHONG p ON lp.MaLoai = p.MaLoai
            GROUP BY lp.MaLoai, lp.TenLoai
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;