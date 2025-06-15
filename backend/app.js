const express = require('express');
const cors = require('cors');
const path = require('path');
const publico_cadastro = require('./routes/publico-cadastro');
const ocupacao = require('./routes/ocupacao');
const atuacao = require('./routes/atuacao');
const estado_cidade = require('./routes/estado-cidade');
const publico_login = require('./routes/publico-login');
const home = require('./routes/index-home');
const projeto = require('./routes/index-projeto');
const dashboard_publico= require('./routes/publico-dashboard');
const participacoes = require('./routes/publico-participacoes');
const certificados_publico = require('./routes/publico-certificado');
const certificados = require('./routes/certificado');
const registro_presenca = require('./routes/registro-presenca');
const organizador_cadastro = require('./routes/organizadores-cadastro');
const cargo = require('./routes/cargo');
const organizador_login = require('./routes/organizadores-login');
const organizador_lista_palestrantes = require('./routes/organizadores-lista-de-palestrantes');
const organizador_inserir_palestrante = require('./routes/organizadores-inserir-palestrantes');
//const projeto_educacional = require('./routes/projeto-educacional');
//const produto = require('./routes/produto');
const etapas_e_acoes = require('./routes/etapas-e-acoes');

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
app.use('/api', projeto);
app.use('/api', dashboard_publico);
app.use('/api', participacoes);
app.use('/api', certificados_publico);
app.use('/api', certificados);
app.use('/api', registro_presenca);
app.use('/api', organizador_cadastro);
app.use('/api', cargo);
app.use('/api', organizador_login);
app.use('/api', organizador_lista_palestrantes);
app.use('/api', organizador_inserir_palestrante);
//app.use('/api', projeto_educacional);
//app.use('/api', produto);
app.use('/api', etapas_e_acoes);

//Servidor frontend
app.use(express.static(path.join(__dirname, '../frontend/prototype')));

//Servidor de uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//Servidor de certificados
app.use('/certificados', express.static(path.join(__dirname, 'certificados')));

app.listen(4000, () => console.log('Servidor rodando na porta 4000'));
