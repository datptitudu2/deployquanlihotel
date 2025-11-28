const express = require("express");
const router = express.Router();
const db = require("../config/database");

// GET all rooms
router.get("/", (req, res) => {
  db.query("SELECT * FROM phong", (err, results) => {
    // ĐỔI TÊN BẢNG
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET room by ID
router.get("/:id", (req, res) => {
  db.query(
    "SELECT * FROM phong WHERE MaPhong = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results[0] || {});
    }
  );
});

// POST new room
router.post("/", (req, res) => {
  const { MaPhong, LoaiPhong, Tang, TinhTrang, SoNguoiToiDa, GiaPhong } =
    req.body; // ĐỔI TÊN CỘT
  db.query(
    "INSERT INTO phong (MaPhong, LoaiPhong, Tang, TinhTrang, SoNguoiToiDa, GiaPhong) VALUES (?, ?, ?, ?, ?, ?)",
    [MaPhong, LoaiPhong, Tang, TinhTrang || "Trong", SoNguoiToiDa, GiaPhong],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Phòng thêm thành công", id: MaPhong });
    }
  );
});

// PUT update room
router.put("/:id", (req, res) => {
  const { LoaiPhong, Tang, TinhTrang, SoNguoiToiDa, GiaPhong } = req.body;
  db.query(
    "UPDATE phong SET LoaiPhong=?, Tang=?, TinhTrang=?, SoNguoiToiDa=?, GiaPhong=? WHERE MaPhong=?",
    [LoaiPhong, Tang, TinhTrang, SoNguoiToiDa, GiaPhong, req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Phòng cập nhật thành công" });
    }
  );
});

// DELETE room
router.delete("/:id", (req, res) => {
  db.query(
    "DELETE FROM phong WHERE MaPhong = ?",
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Phòng xóa thành công" });
    }
  );
});

module.exports = router;
