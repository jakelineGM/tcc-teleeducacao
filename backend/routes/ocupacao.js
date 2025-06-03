const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Listar todas as ocupações
router.get('/ocupacao', (req, res) => {
  db.query('SELECT id_ocupacao, nome FROM Ocupacao', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;