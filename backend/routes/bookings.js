const express = require("express");
const router = express.Router();
const db = require("../config/database");

// GET all bookings với thông tin khách hàng và phòng
router.get("/", (req, res) => {
  const query = `
        SELECT dp.*, kh.TenKH, p.LoaiPhong, p.GiaPhong
        FROM dat_phong dp
        JOIN khach_hang kh ON dp.MaKH = kh.MaKH
        JOIN phong p ON dp.MaPhong = p.MaPhong
        ORDER BY dp.NgayDat DESC
    `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
