const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models/db');

// Cadastro de usuário
router.post('/cadastro-publico', async (req, res) => {
  const { nome, cpf, telefone, estado, cidade, ocupacao, atuacao, email, senha } = req.body;

  // Validação simples (mais forte no futuro)
  if (!/^\d{11}$/.test(cpf)) return res.status(400).json({ message: 'CPF inválido' });
  if (!/^\(\d{2}\) 9\d{4}-\d{4}$/.test(telefone)) return res.status(400).json({ message: 'Telefone inválido' });

  // Verifica email único
  db.query('SELECT id_publico FROM Publico WHERE email = ?', [email], async (err, results) => {
    if (results.length > 0) return res.status(400).json({ message: 'Email já cadastrado' });

    const hash = await bcrypt.hash(senha, 10);

    const novoUsuario = {
      nome,
      cpf,
      telefone,
      email,
      senha_publico: hash,
      id_estado: estado,   // <- Alinhado com o banco
      id_cidade: cidade,   // <- Alinhado com o banco
      id_ocupacao: ocupacao, // <- Alinhado com o banco
      id_atuacao: atuacao    // <- Alinhado com o banco
    };

    db.query('INSERT INTO Publico SET ?', novoUsuario, (err) => {
      if (err) return res.status(500).json({ message: 'Erro ao cadastrar' });
      res.json({ message: 'Cadastro realizado com sucesso!' });
    });
  });
});

module.exports = router;