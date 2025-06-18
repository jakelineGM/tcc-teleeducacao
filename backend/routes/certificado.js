const express = require('express');
const router = express.Router();
const db = require('../models/db');
const getUpload = require('../middlewares/upload');
const gerarCertificado = require('../utils/gerar-certificado');

const uploadAssinatura = getUpload('assinaturas', ['image/png']);

// Inserir assinaturas
router.post('/assinaturas', uploadAssinatura.single('arquivo'), async (req, res) => {
  const { nome, cargo } = req.body;
  const arquivo = req.file;

  if (!nome || !cargo || !arquivo) {
    return res.status(400).json({ error: 'Nome, cargo e arquivo .png são obrigatórios.' });
  }

  const caminho_arquivo = `/uploads/imagens/assinaturas/${arquivo.filename}`;

  try {
    const [result] = await db.query(
      `INSERT INTO Assinatura (nome, cargo, caminho_arquivo) VALUES (?, ?, ?)`,
      [nome, cargo, caminho_arquivo]
    );

    console.log('Assinatura inserida com sucesso, ID:', result.insertId);
    res.status(201).json({ message: 'Assinatura cadastrada com sucesso.', id_assinatura: result.insertId });
  } catch (err) {
    console.error('Erro ao inserir assinatura:', err);
    res.status(500).json({ error: 'Erro interno ao salvar assinatura.' });
  }
});

// Listar assinaturas
router.get('/assinaturas', async (req, res) => {
  try {
    const [assinaturas] = await db.query(
      'SELECT id_assinatura, nome, cargo FROM Assinatura'
    );

    if (assinaturas.length === 0) {
      return res.status(404).json({ message: 'Nenhuma assinatura encontrada.' });
    }

    res.status(200).json(assinaturas);
  } catch (err) {
    console.error('Erro ao listar assinaturas:', err);
    res.status(500).json({ error: 'Erro interno ao listar assinaturas.' });
  }
});

// Associar assinatura(s) a evento
router.post('/associar-assinaturas', async (req, res) => {
  const { id_evento, assinaturas } = req.body;
  // assinaturas deve ser um array de objetos: [{ id_assinatura: X, ordem: Y }, ...]

  // Validar campos obrigatórios
  if (!id_evento || !Array.isArray(assinaturas) || assinaturas.length === 0) {
    return res.status(400).json({ error: 'id_evento e ao menos uma assinatura são obrigatórios.' });
  }

  try {
    // Validar se todas as assinaturas existem
    const idsAssinaturas = assinaturas.map(a => a.id_assinatura);
    const [assinaturasExistentes] = await db.query(
      `SELECT id_assinatura, nome FROM Assinatura WHERE id_assinatura IN (${idsAssinaturas.map(() => '?').join(',')})`,
      idsAssinaturas
    );

    const idsEncontrados = assinaturasExistentes.map(a => a.id_assinatura);
    const idsRecebidos = idsAssinaturas;
    const idsNaoEncontrados = idsRecebidos.filter(id => !idsEncontrados.includes(id));

    if (idsNaoEncontrados.length > 0) {
      return res.status(400).json({
        error: 'As seguintes assinaturas não existem no banco:',
        ids_nao_encontrados: idsNaoEncontrados
      });
    }

    // Fazer os INSERTs
    for (const assinatura of assinaturas) {
      await db.query(
        `INSERT INTO ProjetoAssinatura (id_evento, id_assinatura, ordem) VALUES (?, ?, ?)`,
        [id_evento, assinatura.id_assinatura, assinatura.ordem || null]
      );
    }

    // Montar mensagem de sucesso
    // Buscar o título do evento
    const [[evento]] = await db.query(
      'SELECT titulo FROM ProjetoEducacional WHERE id_evento = ?',
      [id_evento]
    );

    const nomesAssinaturas = assinaturasExistentes.map(a => a.nome).join(', ');

    res.status(201).json({
      message: `O certificado do evento ${id_evento} - ${evento.titulo} conterá a(s) assinatura(s) de ${nomesAssinaturas}.`
    });

  } catch (err) {
    console.error('Erro ao associar assinaturas ao evento:', err);
    res.status(500).json({ error: 'Erro interno ao associar assinaturas.' });
  }
});

// Listar inscritos em um evento (ORGANIZADOR)
router.get('/presenca/certificados/:id_evento', async (req, res) => {
  const { id_evento } = req.params;

  try {
    // Buscar título do evento
    const [[evento]] = await db.query(
      'SELECT titulo FROM ProjetoEducacional WHERE id_evento = ?',
      [id_evento]
    );

    // Buscar lista de inscritos + presença + certificado (se já gerado)
    // acrescimo de c.id_evento e c.id_certificado
    const [inscritos] = await db.query(`
      SELECT
        i.id_publico,
        p.nome AS nome_publico,
        i.presente,
        c.caminho_arquivo,
        c.id_evento,
        c.id_certificado
      FROM Inscricao i
      INNER JOIN Publico p ON i.id_publico = p.id_publico
      LEFT JOIN Certificado c ON c.id_evento = i.id_evento AND c.id_publico = i.id_publico
      WHERE i.id_evento = ?
      ORDER BY nome_publico ASC
    `, [id_evento]);

    if (inscritos.length === 0) {
      return res.status(404).json({ message: 'Nenhum inscrito encontrado para este evento.' });
    }

    res.status(200).json({
      id_evento,
      titulo_projeto: evento.titulo,
      inscritos: inscritos
    });

  } catch (err) {
    console.error('Erro ao listar certificados:', err);
    res.status(500).json({ error: 'Erro interno ao buscar certificados.' });
  }
});

// Listar certificados com presença confirmada (PÚBLICO)
router.get('/certificados/:id_publico', async (req, res) => {
  const { id_publico } = req.params;

  try {
    const [certificados] = await db.query(`
      SELECT 
        pe.titulo,
        pe.data_inicio,
        pa.nome AS palestrante,
        c.id_certificado,
        c.id_evento,
        c.id_publico
      FROM Inscricao i
      JOIN ProjetoEducacional pe ON pe.id_evento = i.id_evento
      JOIN Produto p ON p.id_evento = pe.id_evento
      JOIN ProdutoPalestrante pp ON pp.id_produto = p.id_produto
      JOIN Palestrante pa ON pa.id_palestrante = pp.id_palestrante
      JOIN Certificado c ON c.id_evento = pe.id_evento AND c.id_publico = i.id_publico
      WHERE i.id_publico = ? AND i.presente = 1
      ORDER BY pe.data_inicio DESC;
    `, [id_publico]);

    console.log('[DEBUG] Resultado de certificados:', certificados);

    if (!certificados.length) {
      return res.status(404).json({ message: 'Nenhum certificado encontrado.' });
    }

    res.status(200).json(certificados);
  } catch (error) {
    console.error('[ERRO] Falha ao listar certificados:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Lista Auxiliar - Listar Projetos
router.get('/projetos-titulo', async (req, res) => {
  try {
    const [projetos] = await db.query('SELECT id_evento, titulo FROM ProjetoEducacional');

    if (projetos.length === 0) {
      return res.status(404).json({ message: 'Nenhum projeto encontrado.' });
    }

    res.status(200).json(projetos);
  } catch (err) {
    console.error('Erro ao listar projetos:', err);
    res.status(500).json({ error: 'Erro ao listar projetos.' });
  }
});

// Lista Auxiliar - Listar nomes da assinatura
router.get('/assinaturas-nomes', async (req, res) => {
  try {
    const [assinaturas] = await db.query('SELECT id_assinatura, nome FROM Assinatura');

    if (assinaturas.length === 0) {
      return res.status(404).json({ message: 'Nenhuma assinatura encontrada.' });
    }

    res.status(200).json(assinaturas);
  } catch (err) {
    console.error('Erro ao listar assinaturas:', err);
    res.status(500).json({ error: 'Erro ao listar assinaturas.' });
  }
});

// Gerar certificado individual
router.get('/certificados/:id_evento/:id_publico/:id_certificado', async (req, res) => {
  const { id_evento, id_publico, id_certificado } = req.params;

  try {
    const caminho = await gerarCertificado(id_evento, id_publico, id_certificado, db);
    const urlAbsoluta = `http://localhost:4000${caminho}`;
    return res.redirect(urlAbsoluta);
  } catch (err) {
    console.error('Erro ao gerar certificado:', err);

    if (err.tipo === 'presenca_invalida') {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: 'Erro interno ao gerar certificado.' });
  }
});


module.exports = router;