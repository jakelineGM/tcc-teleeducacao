const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/palestrantes/', (req, res) => {
  const { nome, especialidade } = req.query;

  let sql = `
    SELECT 
      p.id_palestrante,
      p.nome,
      p.email,
      p.telefone,
      p.especialidade,
      p.crm,
      GROUP_CONCAT (tp.descricao SEPARATOR ', ') AS preferencias
    FROM Palestrante p
    LEFT JOIN PalestranteTipoProduto ptp ON ptp.id_palestrante = p.id_palestrante
    LEFT JOIN TipoProduto tp ON tp.id_tipo_produto = ptp.id_tipo_produto
    WHERE 1 = 1
  `;

  const params = [];

  if (nome) {
    sql += 'AND p.nome LIKE ?';
    params.push(`%${nome}%`);
  }

  if (especialidade) {
    sql += 'AND p.especialidade LIKE ?';
    params.push(`%${especialidade}%`);
  }

  sql += ' Group by p.id_palestrante ORDER BY p.nome';

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('--- ERRO EM /api/palestrantes ---');
      console.error('Mensagem:', err.message);
      console.error('Query:', sql);
      return res.status(500).json({ message: 'Erro ao buscar palestrantes.' });
    }

    res.json(results);
  });
});


//para criar a caixa de seleção das especialidades
router.get('/especialidades', (req, res) => {
  const sql = `SELECT DISTINCT especialidade FROM Palestrante WHERE especialidade IS NOT NULL ORDER BY especialidade`;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Erro ao buscar especialidades.' });
    res.json(results.map(row => row.especialidade));
  });
});


  module.exports = router;