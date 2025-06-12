//Lista as cidades e estados para selecionar no cadastro do usuário público
const express = require('express');
const router = express.Router();
const db = require('../models/db');

//ROTA: GET /api/estados
router.get('/estados', async (req, res) => {
  try {
    const [estados] = await db.query(`
      SELECT id_estado, nome
      FROM Estado
    `);

    //Verifica se retornou algum dado
    if (!estados || estados.length === 0) {
      return res.status(204).json({ message: 'Nenhum estado encontrado.' });
    }

    //Resposta com sucesso: envia JSON
    return res.status(200).json(estados);
  }
  catch (error) {
    console.error('Erro ao buscar estados:', error);
    return res.status(500).json({ erro: 'Erro interno ao buscar estados.' });
  }
});

//ROTA: GET /api/cidades/id_estado
router.get('/cidades/:id_estado', async (req, res) => {
  const estadoId = req.params.id_estado;
  try {
    const [cidades] = await db.query(`
      SELECT id_cidade, nome
      FROM Cidade
      WHERE id_estado = ?`, [estadoId]);

    //Verifica se retornou algum dado
    if (!cidades || cidades.length === 0) {
      return res.status(204).json({ message: 'Nenhuma ciadade encontrada.' });
    }

    //Resposta com sucesso: envia JSON
    return res.status(200).json(cidades);
  }
  catch (error) {
    console.error('Erro ao buscar cidades:', error);
    return res.status(500).json({ erro: 'Erro interno ao buscar cidades.' });
  }
});

module.exports = router;
