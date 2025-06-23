const express = require('express');
const router = express.Router();
const db = require('../models/db');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const getUpload = require('../middlewares/upload');

const uploadProduto = getUpload('produtos', ['application/pdf', 'video/mp4', 'image/png', 'image/jpeg']); //acrescentar audio
const limparUpload = require('../utils/limpar-upload');

// Inserir produto
router.post('/produtos', uploadProduto.single('arquivo'), async (req, res) => {
  const { id_tipo_produto, id_evento, id_palestrante } = req.body;
  let link_arquivo = req.body.link_arquivo || null;

  if (!id_tipo_produto || !id_evento || !id_palestrante) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos.' });
  }

  try {
    // Validação: Projeto precisa estar no status 1
    const [[projeto]] = await db.query('SELECT id_status FROM ProjetoEducacional WHERE id_evento = ?', [id_evento]);
    if (!projeto || projeto.id_status !== 1) {
      limparUpload(req);
      return res.status(400).json({ error: 'Só é permitido cadastrar produtos em projetos com status 1 (Em produção).' });
    }

    // Se o arquivo veio por upload, sobrescreve o link_arquivo
    if (req.file) {
      link_arquivo = `/uploads/imagens/produtos/${req.file.filename}`;
    }

    const [result] = await db.query(
      `INSERT INTO Produto (id_tipo_produto, link_arquivo, id_evento) VALUES (?, ?, ?)`,
      [id_tipo_produto, link_arquivo, id_evento]
    );

    // Associar palestrante ao produto (se informado)
    if (id_palestrante) {
      await db.query(
        `INSERT INTO ProdutoPalestrante (id_produto, id_palestrante) VALUES (?, ?)`,
        [result.insertId, id_palestrante]
      );
    }

    res.status(201).json({ message: 'Produto cadastrado com sucesso.', id_produto: result.insertId });
  } catch (err) {
    console.error('Erro ao inserir produto:', err);
    limparUpload(req);
    res.status(500).json({ error: 'Erro interno ao inserir produto.' });
  }
});

// Excluir produto
router.delete('/produtos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar se o produto existe
    const [[produto]] = await db.query('SELECT id_evento, link_arquivo FROM Produto WHERE id_produto = ?', [id]);
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    // Validação: Só permite excluir se o projeto estiver no status 1
    const [[projeto]] = await db.query('SELECT id_status FROM ProjetoEducacional WHERE id_evento = ?', [produto.id_evento]);
    if (!projeto || projeto.id_status !== 1) {
      return res.status(400).json({ error: 'Só é permitido excluir produtos de projetos com status 1 (Em produção).' });
    }

    // Excluir associações na tabela ProdutoPalestrante
    await db.query('DELETE FROM ProdutoPalestrante WHERE id_produto = ?', [id]);

    // Se for arquivo salvo fisicamente, deleta o arquivo
    if (produto.link_arquivo && !produto.link_arquivo.startsWith('http')) {
      const fullPath = path.join(__dirname, '..', produto.link_arquivo);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    }

    // Deletar produto do banco
    await db.query('DELETE FROM Produto WHERE id_produto = ?', [id]);
    res.status(200).json({ message: 'Produto deletado com sucesso.' });

  } catch (err) {
    console.error('Erro ao deletar produto:', err);
    res.status(500).json({ error: 'Erro interno ao deletar produto' });
  }
});

// Listar todos os produtos
router.get('/produtos', async (req, res) => {
  try {
    const [produtos] = await db.query(`
      SELECT
        p.id_produto,
        tp.descricao AS tipo_produto,
        p.link_arquivo,
        pe.titulo AS nome_projeto,
        pe.id_status AS status_projeto,
        pa.nome AS nome_palestrante
      FROM Produto p
      LEFT JOIN TipoProduto tp ON tp.id_tipo_produto = p.id_tipo_produto
      LEFT JOIN ProjetoEducacional pe ON pe.id_evento = p.id_evento
      LEFT JOIN ProdutoPalestrante pp ON pp.id_produto = p.id_produto
      LEFT JOIN Palestrante pa ON pa.id_palestrante = pp.id_palestrante
      ORDER BY p.id_produto DESC;
    `);

    if (produtos.length === 0) {
      return res.status(200).json([]);  // Retorna um array vazio
    }

    res.status(200).json(produtos);
  } catch (err) {
    console.error('Erro ao listar produtos:', err);
    res.status(500).json({ error: 'Erro interno ao listar produtos.' });
  }
});

// Listar produtos por projeto educacional
router.get('/produtos/evento/:id_evento', async (req, res) => {
  const { id_evento } = req.params;

  try {
    const [produtos] = await db.query(`
      SELECT
        p.id_produto,
        tp.descricao AS tipo_produto,
        p.link_arquivo,
        pe.titulo AS nome_projeto,
        pe.id_status AS status_projeto,
        pa.nome AS nome_palestrante
      FROM Produto p
      LEFT JOIN TipoProduto tp ON tp.id_tipo_produto = p.id_tipo_produto
      LEFT JOIN ProjetoEducacional pe ON pe.id_evento = p.id_evento
      LEFT JOIN ProdutoPalestrante pp ON pp.id_produto = p.id_produto
      LEFT JOIN Palestrante pa ON pa.id_palestrante = pp.id_palestrante
      WHERE p.id_evento = ?
      ORDER BY p.id_produto DESC;
    `, [id_evento]);

    if (produtos.length === 0) {
      return res.status(204).json({ message: 'Nenhum produto encontrado para esse projeto.' });
    }

    res.status(200).json(produtos);
  } catch (err) {
    console.error('Erro ao listar produtos por projeto:', err);
    res.status(500).json({ error: 'Erro interno ao listar produtos por projeto.' });
  }
});

// Visualização do produto arquivo
router.get('/produtos/view/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '..', 'uploads', 'imagens', 'produtos', filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Arquivo não encontrado.' });
  }

  const contentType = mime.lookup(filePath) || 'application/octet-stream';
  res.setHeader('Content-Type', contentType);
  res.sendFile(filePath);
});

// Lista Auxiliar - Listar palestrantes
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
    return res.status(200).json(palestrantes);
  }
  catch (error) {
    console.error('Erro ao listar palestrantes:', error);
    return res.status(500).json({ erro: 'Erro interno ao listar palestrantes.' });
  }
});

// Lista Auxiliar - Listar tipos de um produto
router.get('/tipos-produto', async (req, res) => {
  try {
    const [tipos] = await db.query(`
      SELECT id_tipo_produto, descricao 
      FROM TipoProduto
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

// Lista Auxiliar - Listar projeto educacional com status Em produção
router.get('/titulo-projetos-em-producao', async (req, res) => {
  try {
    const [projeto] = await db.query(`
      SELECT id_evento, titulo 
      FROM ProjetoEducacional
      WHERE id_status = 1
      ORDER BY id_evento DESC; 
    `);

    //Verifica se retornou algum dado
    if (!projeto || projeto.length === 0) {
      return res.status(204).json({ message: 'Nenhum projeto encontrado.' });
    }

    //Resposta com sucesso: envia JSON
    return res.status(200).json(projeto);
  }
  catch (error) {
    console.error('Erro ao listar titulos de projetos:', error);
    return res.status(500).json({ erro: 'Erro interno ao listar titulos de projetos.' });
  }
});

// Lista Auxiliar - Listar projeto educacional por ordem alfabetica
router.get('/titulo-asc-projetos', async (req, res) => {
  try {
    const [projeto] = await db.query(`
      SELECT id_evento, titulo 
      FROM ProjetoEducacional
      ORDER BY titulo ASC; 
    `);

    //Verifica se retornou algum dado
    if (!projeto || projeto.length === 0) {
      return res.status(204).json({ message: 'Nenhum projeto encontrado.' });
    }

    //Resposta com sucesso: envia JSON
    return res.status(200).json(projeto);
  }
  catch (error) {
    console.error('Erro ao listar titulos de projetos:', error);
    return res.status(500).json({ erro: 'Erro interno ao listar titulos de projetos.' });
  }
});

module.exports = router;
