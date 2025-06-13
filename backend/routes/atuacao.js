//Lista as atuacoes para selecionar no cadastro do usuário público
const express = require('express');
const router = express.Router();
const db = require('../models/db');

//ROTA: GET /api/atuacao
router.get('/atuacao', async (req, res) => {
  try {
    const [atuacao] = await db.query(`
      SELECT id_atuacao, descricao 
      FROM Atuacao
      ORDER BY descricao
    `);

    //Verifica se retornou algum dado
    if (!atuacao || atuacao.length === 0) {
      return res.status(204).json({ message: 'Nenhuma atuação encontrada.' });
    }

    //Resposta com sucesso: envia JSON
    return res.status(200).json(atuacao);
  }
  catch (error) {
    console.error('Erro ao buscar atuações:', error);
    return res.status(500).json({ erro: 'Erro interno ao buscar atuações.' });
  }
});


module.exports = router;