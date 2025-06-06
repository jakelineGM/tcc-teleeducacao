const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/participacoes/:id_publico', (req, res) => {
  const { id_publico } = req.params;

  const sql = `
    SELECT 
      pe.id_evento,
      pe.titulo,
      pa.nome AS palestrante,
      i.presente,
      pe.data_inicio,
      p.link_arquivo,
      pe.id_status,
      c.id_certificado,
      a.id_avaliacao
    FROM Inscricao i
    JOIN ProjetoEducacional pe ON pe.id_evento = i.id_evento
    JOIN Produto p ON p.id_evento = pe.id_evento
    JOIN ProdutoPalestrante pp ON pp.id_produto = p.id_produto
    JOIN Palestrante pa ON pa.id_palestrante = pp.id_palestrante
    LEFT JOIN Certificado c ON c.id_evento = pe.id_evento AND c.id_publico = i.id_publico
    LEFT JOIN Avaliacao a ON a.id_evento = pe.id_evento AND a.id_publico = i.id_publico
    WHERE i.id_publico = ?
    ORDER BY pe.data_inicio DESC;
  `;

  db.query(sql, [id_publico], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

  module.exports = router;