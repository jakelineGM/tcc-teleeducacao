const express = require('express');
const cors = require('cors');
const path = require('path');
const publico_cadastro = require('./routes/publico-cadastro');
const ocupacao = require('./routes/ocupacao');
const atuacao = require('./routes/atuacao');
const estado_cidade = require('./routes/estado-cidade');
const publico_login = require('./routes/publico-login');
const home = require('./routes/home');

const app = express();
app.use(cors());
app.use(express.json());

//Roteamento de API
app.use('/api', publico_cadastro);
app.use('/api', estado_cidade);
app.use('/api', ocupacao);
app.use('/api', atuacao);
app.use('/api', publico_login);
app.use('/api', home);

//Servidor frontend
app.use(express.static(path.join(__dirname, '../frontend/prototype')));

//Servidor de uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(4000, () => console.log('Servidor rodando na porta 4000'));
