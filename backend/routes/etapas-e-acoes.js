const express = require('express');
const router = express.Router();
const db = require('../models/db');

const normalizarData = (data) => {
    if (!data) return null;
    return new Date(data).toISOString().slice(0, 19);  // yyyy-MM-ddTHH:mm:ss
};

// Inserir Etapa
router.post('/etapas', async (req, res) => {
    const { nome, id_status, data_inicio, data_fim, id_evento } = req.body;

    // Validação dos campos obrigatórios
    if (!nome || !id_status || !data_fim || !id_evento) {
        console.log('Dados obrigatórios ausentes ao inserir etapa');
        return res.status(400).json({ error: 'Campos obrigatórios: nome, id_status, data_fim, id_evento' });
    }

    try {
        const [result] = await db.query(
            `INSERT INTO Etapa (nome, id_status, data_inicio, data_fim, id_evento) VALUES (?, ?, ?, ?, ?)`,
            [nome, id_status, data_inicio || null, data_fim, id_evento]
        );

        console.log('Etapa inserida com sucesso, ID:', result.insertId);
        res.status(201).json({ id_etapa: result.insertId });
    } catch (err) {
        console.error('Erro ao inserir etapa:', err);
        res.status(500).json({ error: 'Erro interno ao inserir etapa' });
    }
});

// Inserir Acao
router.post('/acoes', async (req, res) => {
    const { descricao, id_status, data_inicio, data_fim, id_etapa, id_organizador } = req.body;

    // Validação dos campos obrigatórios
    if (!descricao || !id_status || !data_fim || !id_etapa || !id_organizador) {
        console.log('Dados obrigatórios ausentes ao inserir ação');
        return res.status(400).json({
            error: 'Campos obrigatórios: descricao, id_status, data_fim, id_etapa, id_organizador'
        });
    }

    try {
        const [result] = await db.query(
            `INSERT INTO Acao (descricao, id_status, data_inicio, data_fim, id_etapa, id_organizador)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [descricao, id_status, data_inicio || null, data_fim, id_etapa, id_organizador]
        );

        console.log('✅ Ação inserida com sucesso, ID:', result.insertId);
        res.status(201).json({ id_acao: result.insertId });
    } catch (err) {
        console.error('Erro ao inserir ação:', err);
        res.status(500).json({ error: 'Erro interno ao inserir ação' });
    }
});

// Alterar todas as variaveis de Etapa
router.put('/etapas/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, id_status, data_inicio, data_fim, id_evento } = req.body;

    if (!nome || !id_status || !data_fim || !id_evento) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    try {
        // Buscar dados atuais
        const [[atual]] = await db.query('SELECT * FROM Etapa WHERE id_etapa = ?', [id]);
        if (!atual) return res.status(404).json({ error: 'Etapa não encontrada.' });

        // Identificar o que mudou
        const alteracoes = {};
        if (nome !== atual.nome) alteracoes.nome = { antes: atual.nome, depois: nome };
        if (id_status !== atual.id_status) alteracoes.id_status = { antes: atual.id_status, depois: id_status };
        if (normalizarData(data_inicio) !== normalizarData(atual.data_inicio)) {
            alteracoes.data_inicio = { antes: normalizarData(atual.data_inicio), depois: normalizarData(data_inicio) };
        }
        if (normalizarData(data_fim) !== normalizarData(atual.data_fim)) {
            alteracoes.data_fim = { antes: normalizarData(atual.data_fim), depois: normalizarData(data_fim) };
        }
        if (id_evento !== atual.id_evento) alteracoes.id_evento = { antes: atual.id_evento, depois: id_evento };

        // Se nada mudou, avisa
        if (Object.keys(alteracoes).length === 0) {
            return res.status(200).json({ message: 'Nenhuma alteração detectada.' });
        }

        // Executar a atualização
        await db.query(
            `UPDATE Etapa SET nome = ?, id_status = ?, data_inicio = ?, data_fim = ?, id_evento = ? WHERE id_etapa = ?`,
            [nome, id_status, data_inicio || null, data_fim, id_evento, id]
        );

        console.log(`Etapa ${id} atualizada. Alterações:`, alteracoes);
        res.status(200).json({
            message: 'Etapa atualizada com sucesso.',
            alteracoes
        });
    } catch (err) {
        console.error('Erro ao atualizar etapa:', err);
        res.status(500).json({ error: 'Erro interno' });
    }
});

// Alterar todas as variaveis de Acao
router.put('/acoes/:id', async (req, res) => {
    const { id } = req.params;
    const { descricao, id_status, data_inicio, data_fim, id_etapa, id_organizador } = req.body;

    if (!descricao || !id_status || !data_fim || !id_etapa || !id_organizador) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    try {
        // Buscar dados atuais
        const [[atual]] = await db.query('SELECT * FROM Acao WHERE id_acao = ?', [id]);
        if (!atual) return res.status(404).json({ error: 'Ação não encontrada.' });

        // Comparar campo a campo
        const alteracoes = {};
        if (descricao !== atual.descricao) alteracoes.descricao = { antes: atual.descricao, depois: descricao };
        if (id_status !== atual.id_status) alteracoes.id_status = { antes: atual.id_status, depois: id_status };
        if (normalizarData(data_inicio) !== normalizarData(atual.data_inicio)) {
            alteracoes.data_inicio = { antes: normalizarData(atual.data_inicio), depois: normalizarData(data_inicio) };
        }
        if (normalizarData(data_fim) !== normalizarData(atual.data_fim)) {
            alteracoes.data_fim = { antes: normalizarData(atual.data_fim), depois: normalizarData(data_fim) };
        }
        if (id_etapa !== atual.id_etapa) alteracoes.id_etapa = { antes: atual.id_etapa, depois: id_etapa };
        if (id_organizador !== atual.id_organizador) alteracoes.id_organizador = { antes: atual.id_organizador, depois: id_organizador };

        // Caso nada tenha mudado
        if (Object.keys(alteracoes).length === 0) {
            return res.status(200).json({ message: 'Nenhuma alteração detectada.' });
        }

        // Executar update
        await db.query(
            `UPDATE Acao SET descricao = ?, id_status = ?, data_inicio = ?, data_fim = ?, id_etapa = ?, id_organizador = ? WHERE id_acao = ?`,
            [descricao, id_status, data_inicio || null, data_fim, id_etapa, id_organizador, id]
        );

        console.log(`Ação ${id} atualizada. Alterações:`, alteracoes);
        res.status(200).json({
            message: 'Ação atualizada com sucesso.',
            alteracoes
        });
    } catch (err) {
        console.error('Erro ao atualizar ação:', err);
        res.status(500).json({ error: 'Erro interno' });
    }
});

// Alterar apenas Status de Etapa
router.put('/etapas/:id/status', async (req, res) => {
    const { id } = req.params;
    const { id_status } = req.body;

    if (!id_status) {
        return res.status(400).json({ error: 'Status é obrigatório' });
    }

    try {
        const [result] = await db.query(
            'UPDATE Etapa SET id_status = ? WHERE id_etapa = ?',
            [id_status, id]
        );

        console.log(`Status da Etapa ${id} atualizado para:`, id_status);
        res.status(200).json({
            message: 'Status da etapa atualizado',
            id_etapa: id,
            novo_status: id_status
        });
    } catch (err) {
        console.error('Erro ao alterar status da etapa:', err);
        res.status(500).json({ error: 'Erro interno' });
    }
});

// Alterar apenas Status de Acao
router.put('/acoes/:id/status', async (req, res) => {
    const { id } = req.params;
    const { id_status } = req.body;

    if (!id_status) {
        return res.status(400).json({ error: 'Status é obrigatório' });
    }

    try {
        const [result] = await db.query(
            'UPDATE Acao SET id_status = ? WHERE id_acao = ?',
            [id_status, id]
        );

        console.log(`Status da Ação ${id} atualizado para:`, id_status);
        res.status(200).json({
            message: 'Status da ação atualizado',
            id_acao: id,
            novo_status: id_status
        });
    } catch (err) {
        console.error('Erro ao alterar status da ação:', err);
        res.status(500).json({ error: 'Erro interno' });
    }
});

// Listar Etapas
router.get('/etapas', async (req, res) => {
  try {
    const [etapas] = await db.query(`
      SELECT 
        e.id_etapa,
        e.nome,
        s.descricao AS status,
        e.data_inicio,
        e.data_fim,
        p.titulo AS projeto
      FROM Etapa e
      LEFT JOIN StatusEtapaAcao s ON e.id_status = s.id_status
      LEFT JOIN ProjetoEducacional p ON e.id_evento = p.id_evento
      ORDER BY e.id_etapa DESC
    `);

    if (etapas.length === 0) {
      return res.status(404).json({ message: 'Nenhuma etapa encontrada.' });
    }

    res.status(200).json(etapas);
  } catch (err) {
    console.error('Erro ao buscar etapas:', err);
    res.status(500).json({ error: 'Erro interno ao listar etapas.' });
  }
});

// Listar Acoes em sua respectiva Etapa
router.get('/etapas/:id_etapa/acoes', async (req, res) => {
  const { id_etapa } = req.params;

  try {
    const [acoes] = await db.query(`
      SELECT 
        a.id_acao,
        a.descricao,
        s.descricao AS status,
        a.data_inicio,
        a.data_fim,
        o.nome AS organizador
      FROM Acao a
      LEFT JOIN StatusEtapaAcao s ON a.id_status = s.id_status
      LEFT JOIN Organizador o ON a.id_organizador = o.id_organizador
      WHERE a.id_etapa = ?
      ORDER BY a.id_acao
    `, [id_etapa]);

    if (acoes.length === 0) {
      return res.status(404).json({ message: 'Nenhuma ação encontrada para essa etapa.' });
    }

    res.status(200).json(acoes);
  } catch (err) {
    console.error('Erro ao buscar ações da etapa:', err);
    res.status(500).json({ error: 'Erro interno ao listar ações da etapa.' });
  }
});


// Listas Auxiliares
// Listar Status
router.get('/status-etapa-acao', async (req, res) => {
  try {
    const [status] = await db.query('SELECT id_status, descricao FROM StatusEtapaAcao');

    if (status.length === 0) {
      return res.status(404).json({ message: 'Nenhum status encontrado.' });
    }

    res.status(200).json(status);
  } catch (err) {
    console.error('Erro ao listar status:', err);
    res.status(500).json({ error: 'Erro ao buscar status.' });
  }
});

//Listar Projetos
router.get('/projetos-titulo', async (req, res) => {
  try {
    const [projetos] = await db.query('SELECT id_evento, titulo FROM ProjetoEducacional ORDER BY id_evento DESC');

    if (projetos.length === 0) {
      return res.status(404).json({ message: 'Nenhum projeto encontrado.' });
    }

    res.status(200).json(projetos);
  } catch (err) {
    console.error('Erro ao listar projetos:', err);
    res.status(500).json({ error: 'Erro ao buscar projetos.' });
  }
});

//Listar Etapas
router.get('/etapas-nomes', async (req, res) => {
  try {
    const [etapas] = await db.query('SELECT id_etapa, nome FROM Etapa ORDER BY id_etapa DESC');

    if (etapas.length === 0) {
      return res.status(404).json({ message: 'Nenhuma etapa encontrada.' });
    }

    res.status(200).json(etapas);
  } catch (err) {
    console.error('Erro ao listar etapas:', err);
    res.status(500).json({ error: 'Erro ao buscar etapas.' });
  }
});

//Listar Organizadores
router.get('/organizadores-nomes', async (req, res) => {
  try {
    const [organizadores] = await db.query('SELECT id_organizador, nome FROM Organizador ORDER BY nome');

    if (organizadores.length === 0) {
      return res.status(404).json({ message: 'Nenhum organizador encontrado.' });
    }

    res.status(200).json(organizadores);
  } catch (err) {
    console.error('Erro ao listar organizadores:', err);
    res.status(500).json({ error: 'Erro ao buscar organizadores.' });
  }
});

module.exports = router;