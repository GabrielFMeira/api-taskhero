const express = require('express');
const api = express();

const routers = require('./routers');
const seq = require('./db.js');

api.use(express.json());
api.use(routers);

async function start() {
  try {
    await seq.authenticate();
    console.log('Banco conectado com sucesso');

    await seq.sync();
    console.log('Tabelas sincronizadas');

    api.listen(8080, () => {
      console.log('Servidor rodando na porta 8080');
    });
  } catch (err) {
    console.error('Erro ao iniciar aplicação:', err);
  }
}

start();
