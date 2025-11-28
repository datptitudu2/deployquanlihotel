const express = require("express");
const router = express.Router();
const db = require("../config/database");

// GET all customers
router.get("/", (req, res) => {
  db.query("SELECT * FROM khach_hang", (err, results) => {
    // ĐỔI TÊN BẢNG
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET customer by ID
router.get("/:id", (req, res) => {
  db.query(
    "SELECT * FROM khach_hang WHERE MaKH = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results[0] || {});
    }
  );
});

// POST new customer
router.post("/", (req, res) => {
  const { MaKH, TenKH, Email, SoDienThoai, CCCD, DiaChi } = req.body; // ĐỔI TÊN CỘT
  db.query(
    "INSERT INTO khach_hang (MaKH, TenKH, Email, SoDienThoai, CCCD, DiaChi) VALUES (?, ?, ?, ?, ?, ?)",
    [MaKH, TenKH, Email, SoDienThoai, CCCD, DiaChi],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Khách hàng thêm thành công", id: MaKH });
    }
  );
});

// PUT update customer
router.put("/:id", (req, res) => {
  const { TenKH, Email, SoDienThoai, CCCD, DiaChi } = req.body;
  db.query(
    "UPDATE khach_hang SET TenKH=?, Email=?, SoDienThoai=?, CCCD=?, DiaChi=? WHERE MaKH=?",
    [TenKH, Email, SoDienThoai, CCCD, DiaChi, req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Khách hàng cập nhật thành công" });
    }
  );
});

// DELETE customer
router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM khach_hang WHERE MaKH = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Khách hàng xóa thành công" });
    }
  );
});

module.exports = router;
