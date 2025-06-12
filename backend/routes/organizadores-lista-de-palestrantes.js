const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/palestrantes/', async (req, res) => {
  try {
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

    const [palestrantes]= await db.query(sql, params);
    
    //Resposta com sucesso: envia JSON
    return res.status(200).json(palestrantes);

  }
  catch {
    console.error('Erro ao buscar palestrantes:', error);
    return res.status(500).json({ erro: 'Erro interno ao buscar palestrantes.' });
  }
});


//para criar a caixa de seleção das especialidades
router.get('/especialidades', async (req, res) => {
  try {
    const [especialidades] = await db.query(`
      SELECT DISTINCT especialidade
      FROM Palestrante
      WHERE especialidade IS NOT NULL
      ORDER BY especialidade
    `);

    //Verifica se retornou algum dado
    if (!especialidades || especialidades.length === 0) {
      return res.status(204).json({ message: 'Nenhuma especialidade encontrada.' });
    }

    //Resposta com sucesso: envia JSON
    return res.status(200).json(especialidades);

  }
  catch {
    console.error('Erro ao buscar especialidades:', error);
    return res.status(500).json({ erro: 'Erro interno ao buscar especialidades.' });
  }
});


module.exports = router;