const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../models/db');

router.post('/publico-login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const [loginPublico] = await db.query('SELECT * FROM Publico WHERE email = ?', [email]);
    
    if (loginPublico.length === 0) return res.status(401).json({ message: 'Email ou senha inválidos' });

    const usuario = loginPublico[0];
    const match = await bcrypt.compare(senha, usuario.senha_publico);

    if (match) {
      res.json({
        message: `Login realizado com sucesso!`,
        usuario: {
          publico: usuario.senha_publico,
          nome: usuario.nome,
          email: usuario.email
        }
      });
    } else {
      res.status(401).json({ message: 'Email ou senha inválidos' });
    }



  }
  catch {
    console.error('Erro ao logar usuário Público:', error);
    return res.status(500).json({ erro: 'Erro interno ao logar usuário Público.' });
  }
});

module.exports = router;