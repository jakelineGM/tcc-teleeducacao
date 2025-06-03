const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Listar todos os estados
router.get('/estados', (req, res) => {
  db.query('SELECT id_estado, nome FROM Estado', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Listar cidades por estado_id
router.get('/cidades/:id_estado', (req, res) => {
  const estadoId = req.params.id_estado;
  db.query('SELECT id_cidade, nome FROM Cidade WHERE id_estado = ?', [estadoId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
