const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Inserir projeto educacional
router.post('/projetos', async (req, res) => {
    const {
        titulo, descricao, data_inicio, data_fim, id_status,
        id_tema, possui_inscricao, gera_certificado,
        id_publico_alvo, id_organizador, imagem, palavra_chave
    } = req.body;

    if (!titulo || !id_status || possui_inscricao == null || gera_certificado == null) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    }

    try {
        const [result] = await db.query(
            `INSERT INTO ProjetoEducacional 
        (titulo, descricao, data_inicio, data_fim, id_status, id_tema, 
         possui_inscricao, gera_certificado, id_publico_alvo, id_organizador, imagem, palavra_chave)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [titulo, descricao, data_inicio, data_fim, id_status, id_tema,
                possui_inscricao, gera_certificado, id_publico_alvo, id_organizador, imagem, palavra_chave]
        );

        res.status(201).json({ id_evento: result.insertId });
    } catch (err) {
        console.error('Erro ao inserir projeto:', err);
        res.status(500).json({ error: 'Erro interno ao inserir projeto' });
    }
});

// Atualizar projeto
router.put('/projetos/:id', async (req, res) => {
    const { id } = req.params;
    const {
        titulo, descricao, data_inicio, data_fim, id_status,
        id_tema, possui_inscricao, gera_certificado,
        id_publico_alvo, id_organizador, imagem, palavra_chave
    } = req.body;

    try {
        const [[projeto]] = await db.query(
            'SELECT id_status FROM ProjetoEducacional WHERE id_evento = ?',
            [id]
        );
        if (!projeto) return res.status(404).json({ error: 'Projeto não encontrado' });

        // REGRA 1: status atual = 1 → pode alterar tudo
        if (projeto.id_status === 1) {
            await db.query(
                `UPDATE ProjetoEducacional SET 
          titulo = ?, descricao = ?, data_inicio = ?, data_fim = ?, id_status = ?, 
          id_tema = ?, possui_inscricao = ?, gera_certificado = ?, 
          id_publico_alvo = ?, id_organizador = ?, imagem = ?, palavra_chave = ?
         WHERE id_evento = ?`,
                [titulo, descricao, data_inicio, data_fim, id_status, id_tema,
                    possui_inscricao, gera_certificado, id_publico_alvo, id_organizador, imagem, palavra_chave, id]
            );
            return res.status(200).json({ message: 'Projeto atualizado com sucesso (completo)' });
        }

        // REGRA 2: status novo = 2 ou 3 → todos os dados obrigatórios precisam estar preenchidos
        if (id_status === 2) {
            if (
                !titulo || !possui_inscricao == null || !gera_certificado == null ||
                !descricao || !data_inicio || !data_fim || !id_tema ||
                !id_publico_alvo || !id_organizador || !imagem || !palavra_chave
            ) {
                return res.status(400).json({ error: 'Para alterar para status 2-Publicavel, todos os campos devem estar preenchidos.' });
            }

            await db.query(
                `UPDATE ProjetoEducacional SET titulo = ?, descricao = ?, data_inicio = ?, data_fim = ?, id_status = ?, 
                id_tema = ?, possui_inscricao = ?, gera_certificado = ?, 
                id_publico_alvo = ?, id_organizador = ?, imagem = ?, palavra_chave = ?
                WHERE id_evento = ?`,
                [titulo, descricao, data_inicio, data_fim, id_status, id_tema,
                    possui_inscricao, gera_certificado, id_publico_alvo, id_organizador, imagem, palavra_chave, id]
            );
            return res.status(200).json({ message: 'Projeto atualizado com sucesso (status 2-Publicavel)' });
        }

        // REGRA 3: status entre 3–6 → só pode atualizar o status
        if (id_status >= 3 && id_status <= 6) {
            if (id_status >= 3 && id_status <= 6) {
                const [[atual]] = await db.query(
                    'SELECT * FROM ProjetoEducacional WHERE id_evento = ?',
                    [id]
                );

                // Verifica se algum campo (exceto id_status) está diferente do atual no banco
                const camposModificados =
                    titulo !== atual.titulo ||
                    descricao !== atual.descricao ||
                    String(data_inicio) !== String(atual.data_inicio) ||
                    String(data_fim) !== String(atual.data_fim) ||
                    id_tema !== atual.id_tema ||
                    possui_inscricao !== atual.possui_inscricao ||
                    gera_certificado !== atual.gera_certificado ||
                    id_publico_alvo !== atual.id_publico_alvo ||
                    id_organizador !== atual.id_organizador ||
                    imagem !== atual.imagem ||
                    palavra_chave !== atual.palavra_chave;

                if (camposModificados) {
                    return res.status(400).json({
                        error: 'Para alterar para status 3-Publicado, 4-Inscriçoes Abertas, 5-Inscricoes encerradas ou 6-Finalizado, nenhum outro campo além do status pode ser modificado.'
                    });
                }

                await db.query('UPDATE ProjetoEducacional SET id_status = ? WHERE id_evento = ?', [id_status, id]);
                return res.status(200).json({ message: 'Status do projeto atualizado com sucesso (restrito)' });
            }

        }

        return res.status(403).json({ error: 'Status inválido para esta operação.' });
    } catch (err) {
        console.error('Erro ao atualizar projeto:', err);
        res.status(500).json({ error: 'Erro interno ao atualizar projeto' });
    }
});
// Listar todos os projetos
router.get('/projetos', async (req, res) => {
    try {
        const [result] = await db.query(`
      SELECT
        pe.titulo,
        pe.data_inicio,
        sp.descricao AS status,
        pe.possui_inscricao,
        pe.gera_certificado,
        pe.palavra_chave
      FROM ProjetoEducacional pe
      JOIN StatusProjeto sp ON sp.id_status = pe.id_status
      ORDER BY pe.id_evento DESC; 
    `);
        res.status(200).json(result);
    } catch (err) {
        console.error('Erro ao listar projetos:', err);
        res.status(500).json({ error: 'Erro ao buscar projetos' });
    }
});

// Listar status de um projeto
router.get('/statusProjeto', async (req, res) => {
    try {
        const [statusProjeto] = await db.query(`
      SELECT id_status, descricao 
      FROM StatusProjeto
    `);

        //Verifica se retornou algum dado
        if (!statusProjeto || statusProjeto.length === 0) {
            return res.status(204).json({ message: 'Nenhum status encontrado.' });
        }

        //Resposta com sucesso: envia JSON
        return res.status(200).json(statusProjeto);
    }
    catch (error) {
        console.error('Erro ao listar status:', error);
        return res.status(500).json({ erro: 'Erro interno ao listar status.' });
    }
});

// Listar temas de um projeto
router.get('/temas', async (req, res) => {
    try {
        const [temas] = await db.query(`
      SELECT id_tema, descricao
      FROM Tema
      ORDER BY descricao
    `);

        //Verifica se retornou algum dado
        if (!temas || temas.length === 0) {
            return res.status(204).json({ message: 'Nenhum tema encontrado.' });
        }

        //Resposta com sucesso: envia JSON
        return res.status(200).json(temas);
    }
    catch (error) {
        console.error('Erro ao listar temas:', error);
        return res.status(500).json({ erro: 'Erro interno ao listar temas.' });
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

// Listar publico-alvo
router.get('/publicoAlvo', async (req, res) => {
    try {
        const [publicoAlvo] = await db.query(`
      SELECT id_publico_alvo, descricao 
      FROM PublicoAlvo
      ORDER BY descricao
    `);

        //Verifica se retornou algum dado
        if (!publicoAlvo || publicoAlvo.length === 0) {
            return res.status(204).json({ message: 'Nenhum publico alvo encontrado.' });
        }

        //Resposta com sucesso: envia JSON
        return res.status(200).json(publicoAlvo);
    }
    catch (error) {
        console.error('Erro ao listar publico alvo:', error);
        return res.status(500).json({ erro: 'Erro interno ao listar publico alvo.' });
    }
});

// Listar organizadores
router.get('/organizadores', async (req, res) => {
    try {
        const [organizadores] = await db.query(`
      SELECT id_organizador, nome 
      FROM Organizador
      ORDER BY nome
    `);

        //Verifica se retornou algum dado
        if (!organizadores || organizadores.length === 0) {
            return res.status(204).json({ message: 'Nenhum organizador encontrado.' });
        }

        //Resposta com sucesso: envia JSON
        return res.status(200).json(organizadores);
    }
    catch (error) {
        console.error('Erro ao listar organizadores:', error);
        return res.status(500).json({ erro: 'Erro interno ao listar organizadores.' });
    }
});

module.exports = router;
