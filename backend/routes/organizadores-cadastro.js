const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models/db');

// Cadastro de usuário
router.post('/cadastro-organizadores', async (req, res) => {
  try {
    const { nome, telefone, cargo, email, senha } = req.body;

    // Validação simples
    if (!/^\d{11}$/.test(telefone)) return res.status(400).json({ message: 'Telefone inválido' });

    // Verifica email único
    const [existente] = await db.query(`SELECT id_organizador FROM Organizador WHERE email = ?`, [email]);
    if (existente.length > 0) return res.status(400).json({ message: 'Email já cadastrado' });

    const hash = await bcrypt.hash(senha, 10);

    const novoUsuario = {
      nome,
      telefone,
      email,
      senha_organizador: hash,
      id_cargo: cargo
    };

    //Cadastrar organizador
    const [cadastro] = await db.query('INSERT INTO Organizador SET ?', novoUsuario);
    console.log('Organizador cadastrado com sucesso. ID:', cadastro.insertId);
    return res.status(201).json({ message: 'Organizador cadastrado com sucesso.' });
  }
  catch (error) {
    console.error('Erro ao cadastrar organizador:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

module.exports = router;