// Bibliotecas
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Cria a instância do app Express
const app = express();
app.use(cors());
app.use(express.json()); // Permite receber JSON no corpo da requisição

// Configura a conexão com o MySQL usando as variáveis do .env
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Testa a conexão com o banco
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar no banco:', err);
  } else {
    console.log('Conectado ao banco de dados MySQL!');
  }
});

// Rota simples para testar (http://localhost:4000/)
app.get('/', (req, res) => {
  res.send('API do TeleeducacaoPrototipo está no ar!');
});

// Exemplo de rota GET para listar eventos
app.get('/api/projetoeducacional', (req, res) => {
  const sql = 'SELECT * FROM ProjetoEducacional';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Porta do servidor (usa .env ou padrão 4000)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
