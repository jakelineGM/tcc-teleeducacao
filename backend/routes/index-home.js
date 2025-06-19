const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Destaques (últimos 3 projetos com status 3 ou 4 [Publicado ou Inscrições Abertas])
router.get('/projetos-destaques', async (req, res) => {
  try {
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
    const [destaques] = await db.query(sql);

    //Verifica se retornou algum dado
    if (!destaques || destaques.length === 0) {
      return res.status(204).json({ message: 'Nenhum destaque encontrado.' });
    }

    //Resposta com sucesso: envia JSON
    return res.status(200).json(destaques);
  }
  catch {
    console.error('Erro ao buscar destaques:', error);
    return res.status(500).json({ erro: 'Erro interno ao buscar destaques.' });
  }
});

// Palestras(últimos 3 projetos com tipo 4 [Palestra] com status 4 [Inscrições Abertas])
router.get('/projetos-palestras', async (req, res) => {
  try {
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
    const [palestras] = await db.query(sql);

    //Verifica se retornou algum dado
    if (!palestras || palestras.length === 0) {
      return res.status(204).json({ message: 'Nenhuma palestra encontrada.' });
    }

    //Resposta com sucesso: envia JSON
    return res.status(200).json(palestras);
  }
  catch {
    console.error('Erro ao buscar palestras:', error);
    return res.status(500).json({ erro: 'Erro interno ao buscar palestras.' });
  }
});


// Podcasts (últimos 3 projetos com tipo 5 [Podcast] com status 3 [Publicado])
router.get('/projetos-podcasts', async (req, res) => {
  try {
    const sql = `
      SELECT 
        pe.id_evento,
        pe.titulo,
        pa.nome AS palestrante
      FROM ProjetoEducacional pe
      JOIN Produto p ON p.id_evento = pe.id_evento
      JOIN ProdutoPalestrante pp ON pp.id_produto = p.id_produto
      JOIN Palestrante pa ON pa.id_palestrante = pp.id_palestrante
      WHERE pe.id_status = 3 AND p.id_tipo_produto = 5
      ORDER BY pe.id_evento DESC
      LIMIT 3
    `;
    const [podcasts] = await db.query(sql);

    //Verifica se retornou algum dado
    if (!podcasts || podcasts.length === 0) {
      return res.status(204).json({ message: 'Nenhum podcast encontrado.' });
    }

    //Resposta com sucesso: envia JSON
    return res.status(200).json(podcasts);
  }
  catch {
    console.error('Erro ao buscar podcasts:', error);
    return res.status(500).json({ erro: 'Erro interno ao buscar podcasts.' });
  }
});

module.exports = router;
