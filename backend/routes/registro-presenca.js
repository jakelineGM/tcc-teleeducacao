const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../models/db');
const router = express.Router();

router.post('/registro-presenca', (req, res) => {
  const { email, senha, palavra_chave } = req.body;

  if (!email || !senha || !palavra_chave) {
    return res.status(400).json({ message: 'Preencha todos os campos.' });
  }

  const sqlUsuario = 'SELECT * FROM Publico WHERE email = ?';
  db.query(sqlUsuario, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Erro no servidor.' });
    if (results.length === 0) return res.status(401).json({ message: 'Usuário não encontrado.' });

    const usuario = results[0];
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha_publico);
    if (!senhaCorreta) return res.status(401).json({ message: 'Senha incorreta.' });

    // Verifica se está inscrito em algum evento com essa palavra-chave
    const sqlEvento = `
      SELECT pe.id_evento FROM ProjetoEducacional pe
      JOIN Inscricao i ON i.id_evento = pe.id_evento
      WHERE pe.palavra_chave = ? AND i.id_publico = ?
    `;
    db.query(sqlEvento, [palavra_chave, usuario.id_publico], (err, eventos) => {
      if (err) return res.status(500).json({ message: 'Erro ao verificar evento.' });
      if (eventos.length === 0) {
        return res.status(401).json({ message: 'Palavra-chave inválida ou você não está inscrito nesse evento.' });
      }

      const id_evento = eventos[0].id_projeto;

      // Atualiza a presença
      const sqlUpdate = `UPDATE Inscricao SET presente = 1 WHERE id_publico = ? AND id_evento = ?`;
      db.query(sqlUpdate, [usuario.id_publico, id_evento], (err) => {
        if (err) return res.status(500).json({ message: 'Erro ao registrar presença.' });
        res.json({ message: 'Presença confirmada com sucesso!' });
      });
    });
  });
});

module.exports = router;
