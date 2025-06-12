const express = require('express');
const router = express.Router();
const db = require('../models/db');

//ROTA: GET /api/projeto-educacional/:id
router.get('/projeto-educacional/:id_evento', async (req, res) => {
  try{
    const id_evento = req.params.id_evento;
    console.log('ID do projeto educacional recebido:', id_evento);

    const sql = `
    SELECT 
      pe.titulo,
      pe.descricao,
      pe.imagem,
      pe.possui_inscricao,
      pe.data_inicio,
      tp.descricao AS tipo_produto,
      pa.nome AS palestrante,
      p.link_arquivo,
      pub.descricao AS publico_alvo,
      t.descricao AS tema
    FROM ProjetoEducacional pe
    JOIN Produto p ON p.id_evento = pe.id_evento
    JOIN ProdutoPalestrante pp ON pp.id_produto = p.id_produto
    JOIN Palestrante pa ON pa.id_palestrante = pp.id_palestrante
    JOIN TipoProduto tp ON tp.id_tipo_produto = p.id_tipo_produto
    LEFT JOIN PublicoAlvo pub ON pub.id_publico_alvo = pe.id_publico_alvo
    LEFT JOIN Tema t ON t.id_tema = pe.id_tema
    WHERE pe.id_evento = ?
    LIMIT 1
  `;

    const [projEdu] = await db.query(sql, [id_evento]);
    
    //Verifica se retornou algum dado
    if (!projEdu){
      return res.status(404).json({message: 'Projeto não encontrado'});
    }

    //Resposta com sucesso: envia JSON
    return res.status(200).json(projEdu);

  }
  catch (error) {
    console.error('Erro ao buscar projeto educacional:', error);
    return res.status(500).json({ erro: 'Erro interno ao buscar projeto educacional.' });
  }  
});

//id do evento e do usuario publico, 
/*router.post('/inscrever-se/:id', async (req, res) => {
  const id = req.params.id;

  const sql = `
  INSERT INTO Inscricao (id_publico, id_evento) VALUES (?, ?)
  `;
})*/

module.exports = router;
