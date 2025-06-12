//Lista os cargos para selecionar no cadastro do usuário organizador
const express = require('express');
const router = express.Router();
const db = require('../models/db');

//ROTA: GET /api/cago
router.get('/cargo', async (req, res) => {
  try {
    const [cargos] = await db.query(`
      SELECT id_cargo, nome
      FROM Cargo
      ORDER BY nome
    `);

    //Verifica se retornou algum dado
    if (!cargos || cargos.length === 0) {
      return res.status(204).json({ message: 'Nenhum cargo encontrado.' });
    }

    //Resposta com sucesso: envia JSON
    return res.status(200).json(cargos);
  }
  catch (error) {
    console.error('Erro ao buscar cargos:', error);
    return res.status(500).json({ erro: 'Erro interno ao buscar cargos.' });
  }
});


module.exports = router;