const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models/db');

router.post('/organizador-login', (req, res) => {
  const { email, senha } = req.body;

  db.query('SELECT * FROM Organizador WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Erro no servidor' });
    if (results.length === 0) return res.status(401).json({ message: 'Email ou senha inválidos' });

    const usuario = results[0];
    const match = await bcrypt.compare(senha, usuario.senha_organizador);

    if (match) {
      res.json({
        message: `Login realizado com sucesso!`,
        usuario: {
          id_organizador: usuario.id_organizador,
          nome: usuario.nome,
          email: usuario.email
        }});
      } else {
        res.status(401).json({ message: 'Email ou senha inválidos' });
      }
    });
  });
  
  module.exports = router;