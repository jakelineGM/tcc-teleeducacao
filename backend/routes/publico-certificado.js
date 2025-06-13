const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/certificados-publico/:id_publico', async (req, res) => {
  try {
    const id_publico = req.params.id_publico;

    const sql = `
    SELECT 
      pe.titulo,
      pe.data_inicio,
      pa.nome AS palestrante,
      c.id_certificado
    FROM Inscricao i
    JOIN ProjetoEducacional pe ON pe.id_evento = i.id_evento
    JOIN Produto p ON p.id_evento = pe.id_evento
    JOIN ProdutoPalestrante pp ON pp.id_produto = p.id_produto
    JOIN Palestrante pa ON pa.id_palestrante = pp.id_palestrante
    JOIN Certificado c ON c.id_evento = pe.id_evento AND c.id_publico = i.id_publico
    WHERE i.id_publico = ? AND i.presente = 1
    ORDER BY pe.data_inicio DESC;
  `;

    const [listaCertificado] = await db.query(sql, [id_publico]);

    //Resposta com sucesso: envia JSON
    res.status(200).json(listaCertificado);
  }
  catch (error) {
    console.error('Erro ao lista certificados:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

module.exports = router;