const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Destaques (últimos 3 projetos com status 3 ou 4)
router.get('/projetos-destaques', (req, res) => {
  const sql = `
    SELECT 
      pe.id_evento,
      pe.titulo,
      pe.data_inicio,
      pa.nome AS palestrante
    FROM ProjetoEducacional pe
    JOIN Produto p ON p.id_evento = pe.id_evento
    JOIN ProdutoPalestrante pp ON pp.id_produto = p.id_evento
    JOIN Palestrante pa ON pa.id_palestrante = pp.id_palestrante
    WHERE pe.id_status IN (3,4)
    ORDER BY pe.id_evento DESC
    LIMIT 3
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


router.get('/projetos-eventos', (req, res) => {
  const sql = `
    SELECT 
      pe.id_evento,
      pe.titulo,
      pe.data_inicio,
      pa.nome AS palestrante
    FROM ProjetoEducacional pe
    JOIN Produto p ON p.id_evento = pe.id_evento
    JOIN ProdutoPalestrante pp ON pp.id_produto = p.id_produto
    JOIN Palestrante pa ON pa.id_palestrante = pp.id_palestrante
    WHERE pe.id_status = 4 AND p.id_tipo_produto = 4
    ORDER BY pe.id_evento DESC
    LIMIT 3
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


// Podcasts (últimos 3 podcasts com status 4)
router.get('/projetos-podcasts', (req, res) => {
  const sql = `
    SELECT 
      pe.id_evento,
      pe.titulo,
      pa.nome AS palestrante
    FROM ProjetoEducacional pe
    JOIN Produto p ON p.id_evento = pe.id_evento
    JOIN ProdutoPalestrante pp ON pp.id_produto = p.id_produto
    JOIN Palestrante pa ON pa.id_palestrante = pp.id_palestrante
    WHERE pe.id_status = 4 AND p.id_tipo_produto = 5
    ORDER BY pe.id_evento DESC
    LIMIT 3
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});



module.exports = router;
