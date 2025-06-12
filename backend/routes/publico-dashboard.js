const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/inscricoes-recentes/:id_publico', async (req, res) => {
  try {
    const id_publico = req.params.id_publico;

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

    const [inscricoesRecentes] = await db.query(sql, [id_publico]);
    //Resposta com sucesso: envia JSON
    res.status(200).json(inscricoesRecentes);
  }
  catch (error) {
    console.error('Erro ao carregar inscricoes recentes:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

module.exports = router;