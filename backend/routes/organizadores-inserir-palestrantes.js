const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.post('/inserir-palestrante', async (req, res) => {
  try {
    const { nome, email, telefone, especialidade, crm, preferencias } = req.body;

    if (!/^\d{11}$/.test(telefone)) return res.status(400).json({ message: 'Telefone inválido, inserir apenas números.' });

    // Validação dos campos obrigatórios
    if (!nome || !telefone || !especialidade) {
      console.log('Campos obrigatórios ausentes');
      return res.status(400).json({ error: 'Nome, telefone e especialidade são obrigatórios.' });
    }

    // Verificar se já existe um palestrante com mesmo nome e especialidade
    const [existente] = await db.query(
      'SELECT * FROM Palestrante WHERE nome = ? AND especialidade = ?',
      [nome, especialidade]
    );

    if (existente.length > 0) {
      console.log('Palestrante já existe:', nome, especialidade);
      return res.status(409).json({ error: 'Palestrante com mesmo nome e especialidade já cadastrado.' });
    }

    // Inserir palestrante
    const [result] = await db.query(
      'INSERT INTO Palestrante (nome, email, telefone, especialidade, crm) VALUES (?, ?, ?, ?, ?)',
      [nome, email || null, telefone, especialidade, crm || null]
    );

    console.log('Palestrante inserido com sucesso. ID:', result.insertId);

    // Inserir preferências (opcional)
    if (Array.isArray(preferencias) && preferencias.length > 0) {
      const valores = preferencias.map((id) => [result.insertId, id]);
      await db.query(
        'INSERT INTO PalestranteTipoProduto (id_palestrante, id_tipo_produto) VALUES ?',
        [valores]
      );
      console.log('Preferências associadas:', preferencias);
    }

    return res.status(201).json({ message: 'Palestrante cadastrado com sucesso.' });
  } catch (error) {
    console.error('Erro ao inserir palestrante:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

module.exports = router;
