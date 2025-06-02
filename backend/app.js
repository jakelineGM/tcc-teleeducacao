const express = require('express');
const cors = require('cors');
const usuarios = require('./routes/publico');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/usuarios', usuarios);

app.listen(4000, () => console.log('Servidor rodando na porta 4000'));

/* Rota GET para listar os projetos educacionais com status 'Publicado'
app.get('/api/projetospublicados', (req, res) => {
  const sql = `
    SELECT pe.id_evento, pe.titulo, pe.id_status
    FROM ProjetoEducacional pe 
    JOIN StatusProjeto sp ON pe.id_status = sp.id_status
    WHERE 
      sp.id_status = '3';
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});
*/
