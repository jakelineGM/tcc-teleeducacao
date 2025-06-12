//Lista as ocupações para selecionar no cadastro do usuário público
const express = require('express');
const router = express.Router();
const db = require('../models/db');

//ROTA: GET /api/ocupacao
router.get('/ocupacao', async (req, res) => {
  try {
    const [ocupacao] = await db.query(`
      SELECT id_ocupacao, nome 
      FROM Ocupacao
      ORDER BY nome
    `);

    //Verifica se retornou algum dado
    if (!ocupacao || ocupacao.length === 0) {
      return res.status(204).json({ message: 'Nenhuma ocupação encontrada.' });
    }

    //Resposta com sucesso: envia JSON
    return res.status(200).json(ocupacao);
  }
  catch (error) {
    console.error('Erro ao buscar ocupações:', error);
    return res.status(500).json({ erro: 'Erro interno ao buscar ocupações.' });
  }
});

module.exports = router;