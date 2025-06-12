const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models/db');

router.post('/organizador-login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const [loginOrganizador] = await db.query(`SELECT * FROM Organizador WHERE email = ?`, [email]);

    if (loginOrganizador.length === 0) return res.status(401).json({ message: 'Email ou senha inválidos' });

    const usuario = loginOrganizador[0];
    const match = await bcrypt.compare(senha, usuario.senha_organizador);

    if (match) {
      res.json({
        message: `Login realizado com sucesso!`,
        usuario: {
          id_organizador: usuario.id_organizador,
          nome: usuario.nome,
          email: usuario.email
        }
      });
    } else {
      res.status(401).json({ message: 'Email ou senha inválidos' });
    }



  }
  catch {
    console.error('Erro ao logar organizador:', error);
    return res.status(500).json({ erro: 'Erro interno ao logar organizador.' });
  }
});

module.exports = router;