const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../models/db');
const router = express.Router();

router.post('/registro-presenca', async (req, res) => {
  try {
    const { email, senha, palavra_chave } = req.body;

    if (!email || !senha || !palavra_chave) {
      return res.status(400).json({ message: 'Preencha todos os campos.' });
    }

    const sqlUsuario = 'SELECT * FROM Publico WHERE email = ?';
    console.log('Email: ', email);
    const [dadosUserPublico] = await db.query(sqlUsuario, [email]);
    if (dadosUserPublico.length === 0) return res.status(401).json({ message: 'Email não encontrado.' });

    const usuario = dadosUserPublico[0];
    console.log('Usuario: ', usuario);
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_publico);
    if (!senhaCorreta) return res.status(401).json({ message: 'Senha incorreta.' });

    // Verifica se está inscrito em algum evento com essa palavra-chave
    const sqlEvento = `
      SELECT pe.id_evento FROM ProjetoEducacional pe
      JOIN Inscricao i ON i.id_evento = pe.id_evento
      WHERE pe.palavra_chave = ? AND i.id_publico = ?
    `;
    const [verificaEvento] = await db.query(sqlEvento, [palavra_chave, usuario.id_publico]);
    console.log('VerificaEvento: ', verificaEvento);
    if (verificaEvento.length === 0) {
      return res.status(401).json({ message: 'Palavra-chave inválida ou você não está inscrito nesse evento.' });
    }

    const id_evento = verificaEvento[0].id_evento;

    // Atualiza a presença
    const sqlUpdate = `UPDATE Inscricao SET presente = 1 WHERE id_publico = ? AND id_evento = ?`;
    const [atualizaPresenca] = await db.query(sqlUpdate, [usuario.id_publico, id_evento]);
    return res.status(201).json({ message: 'Presença confirmada com sucesso!' });

  }
  catch (error) {
    console.error('Erro ao registrar presença:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

module.exports = router;
