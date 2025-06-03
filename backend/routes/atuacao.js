const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/atuacao', (req, res) => {
  db.query('SELECT id_atuacao, descricao FROM Atuacao', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


module.exports = router;