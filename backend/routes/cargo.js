const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/cargo', (req, res) => {
  db.query('SELECT id_cargo, nome FROM Cargo', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


module.exports = router;