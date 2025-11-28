const express = require("express");
const router = express.Router();
const db = require("../config/database");

// GET all services
router.get("/", (req, res) => {
  db.query("SELECT * FROM dich_vu", (err, results) => {
    // ĐỔI TÊN BẢNG
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
