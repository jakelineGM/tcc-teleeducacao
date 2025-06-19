const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Inserir produto
router.post('/produtos', async (req, res) => {
  const { id_tipo_produto, link_arquivo, id_evento } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO Produto (id_tipo_produto, link_arquivo, id_evento) VALUES (?, ?, ?)`,
      [id_tipo_produto, link_arquivo, id_evento]
    );
    res.status(201).json({ id_produto: result.insertId });
  } catch (err) {
    console.error('Erro ao inserir produto:', err);
    res.status(500).json({ error: 'Erro interno ao inserir produto' });
  }
});

// Atualizar produto
router.put('/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const { id_tipo_produto, link_arquivo, id_evento } = req.body;

  try {
    await db.query(
      `UPDATE Produto SET id_tipo_produto = ?, link_arquivo = ?, id_evento = ?
       WHERE id_produto = ?`,
      [id_tipo_produto, link_arquivo, id_evento, id]
    );
    res.status(200).json({ message: 'Produto atualizado' });
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    res.status(500).json({ error: 'Erro interno ao atualizar produto' });
  }
});

// Excluir produto
router.delete('/produtos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM Produto WHERE id_produto = ?', [id]);
    res.status(200).json({ message: 'Produto removido' });
  } catch (err) {
    console.error('Erro ao deletar produto:', err);
    res.status(500).json({ error: 'Erro interno ao deletar produto' });
  }
});

// Listar palestrantes
router.get('/nome-palestrantes', async (req, res) => {
    try {
        const [palestrantes] = await db.query(`
      SELECT id_palestrante, nome 
      FROM Palestrante
      ORDER BY nome
    `);

        //Verifica se retornou algum dado
        if (!palestrantes || palestrantes.length === 0) {
            return res.status(204).json({ message: 'Nenhum palestrante encontrado.' });
        }

        //Resposta com sucesso: envia JSON
        return res.status(200).json(ocupacao);
    }
    catch (error) {
        console.error('Erro ao listar palestrantes:', error);
        return res.status(500).json({ erro: 'Erro interno ao listar palestrantes.' });
    }
});

// Listar tipos de um projeto
router.get('/tiposProjeto', async (req, res) => {
    try {
        const [tipos] = await db.query(`
      SELECT id_tipo_projeto, descricao 
      FROM TipoProjeto
      ORDER BY descricao
    `);

        //Verifica se retornou algum dado
        if (!tipos || tipos.length === 0) {
            return res.status(204).json({ message: 'Nenhum tipo encontrado.' });
        }

        //Resposta com sucesso: envia JSON
        return res.status(200).json(tipos);
    }
    catch (error) {
        console.error('Erro ao listar tipos:', error);
        return res.status(500).json({ erro: 'Erro interno ao listar tipos.' });
    }
});

// Listar projeto educacional
router.get('/titulo-projetos', async (req, res) => {
    try {
        const [projeto] = await db.query(`
      SELECT id_evento, titulo 
      FROM ProjetoEducacional
      ORDER BY id_evento DESC; 
    `);

        //Verifica se retornou algum dado
        if (!palestrantes || palestrantes.length === 0) {
            return res.status(204).json({ message: 'Nenhum palestrante encontrado.' });
        }

        //Resposta com sucesso: envia JSON
        return res.status(200).json(ocupacao);
    }
    catch (error) {
        console.error('Erro ao listar palestrantes:', error);
        return res.status(500).json({ erro: 'Erro interno ao listar palestrantes.' });
    }
});

module.exports = router;
