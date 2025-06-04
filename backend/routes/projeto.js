const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/projeto-educacional/:id', (req, res) => {
  const id = req.params.id;

  // LOG 1: Verificar o ID recebido
  console.log('[DEBUG] ID recebido:', id);

  const sql = `
    SELECT 
      pe.titulo,
      pe.descricao,
      pe.imagem,
      pe.possui_inscricao,
      pe.data_inicio,
      tp.descricao AS tipo_produto,
      pa.nome AS palestrante,
      p.link_arquivo,
      pub.descricao AS publico_alvo,
      t.descricao AS tema
    FROM ProjetoEducacional pe
    LEFT JOIN Produto p ON p.id_evento = pe.id_evento
    LEFT JOIN ProdutoPalestrante pp ON pp.id_produto = p.id_produto
    LEFT JOIN Palestrante pa ON pa.id_palestrante = pp.id_palestrante
    LEFT JOIN TipoProduto tp ON tp.id_tipo_produto = p.id_tipo_produto
    LEFT JOIN PublicoAlvo pub ON pub.id_publico_alvo = pe.id_publico_alvo
    LEFT JOIN Tema t ON t.id_tema = pe.id_tema
    WHERE pe.id_evento = ?
    LIMIT 1
  `;

  // LOG 2: Mostra a query limpa (para inspeção se necessário)
  console.log('[DEBUG] SQL executado:', sql);

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    // LOG 3: Resultado retornado
    console.log('[DEBUG] Resultado da consulta:', results);
    if (!results.length) return res.status(404).json({ message: 'Projeto não encontrado' });
    res.json(results[0]);
  });
  
});

module.exports = router;
