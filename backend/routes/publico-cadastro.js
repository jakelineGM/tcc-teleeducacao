const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models/db');

// Cadastro de usuário
router.post('/cadastro-publico', async (req, res) => {
  try {
    const { nome, cpf, telefone, estado, cidade, ocupacao, atuacao, email, senha } = req.body;

    // Validação simples (mais forte no futuro)
    if (!/^\d{11}$/.test(cpf)) return res.status(400).json({ message: 'CPF inválido' });
    if (!/^\d{11}$/.test(telefone)) return res.status(400).json({ message: 'Telefone inválido' });

    // Verifica email único
    const [existente] = await db.query('SELECT id_publico FROM Publico WHERE email = ?', [email]);
    if (existente.length > 0) return res.status(400).json({ message: 'Email já cadastrado' });

    const hash = await bcrypt.hash(senha, 10);

    const novoUsuario = {
      nome,
      cpf,
      telefone,
      email,
      senha_publico: hash,
      id_estado: estado,
      id_cidade: cidade,
      id_ocupacao: ocupacao,
      id_atuacao: atuacao
    };

    //Cadastrar público
    const [cadastro] = await db.query('INSERT INTO Publico SET ?', novoUsuario);
    console.log('Cadastro realizado com sucesso. ID:', cadastro.insertId);
    return res.status(201).json({ message: 'Cadastro realizado com sucesso.' });


  }
  catch (error) {
    console.error('Erro ao cadastrar:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

module.exports = router;