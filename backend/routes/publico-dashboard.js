const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/inscricoes-recentes/:id_publico', (req, res) => {
  const { id_publico } = req.params;

  const sql = `
    SELECT 
      pe.titulo,
      pa.nome AS palestrante,
      i.presente,
      pr.link_arquivo
    FROM Inscricao i
    JOIN ProjetoEducacional pe ON pe.id_evento = i.id_evento
    JOIN Produto pr ON pr.id_evento = pe.id_evento
    JOIN ProdutoPalestrante pp ON pp.id_produto = pr.id_produto
    JOIN Palestrante pa ON pa.id_palestrante = pp.id_palestrante
    WHERE i.id_publico = ?
    ORDER BY i.id_evento DESC
    LIMIT 3;
  `;

  db.query(sql, [id_publico], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;