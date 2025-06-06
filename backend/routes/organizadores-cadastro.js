const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models/db');

// Cadastro de usuário
router.post('/cadastro-organizadores', async (req, res) => {
  const { nome, telefone, cargo, email, senha } = req.body;

  // Validação simples (mais forte no futuro)

  if (!/^\d{11}$/.test(telefone)) return res.status(400).json({ message: 'Telefone inválido' });

  // Verifica email único
  db.query('SELECT id_organizador FROM Organizador WHERE email = ?', [email], async (err, results) => {
    if (results.length > 0) return res.status(400).json({ message: 'Email já cadastrado' });

    const hash = await bcrypt.hash(senha, 10);

    const novoUsuario = {
      nome,
      telefone,
      email,
      senha_organizador: hash,
      id_cargo: cargo
    };

    db.query('INSERT INTO Organizador SET ?', novoUsuario, (err) => {
      if (err) return res.status(500).json({ message: 'Erro ao cadastrar' });
      res.json({ message: 'Cadastro realizado com sucesso!' });
    });
  });
});

module.exports = router;