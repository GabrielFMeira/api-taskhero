const express = require('express');
const api = express();

const routers = require('./routers');
const db = require('./models');

api.use(express.json());
api.use(routers);

async function start() {
  try {
    await db.seq.authenticate();
    console.log('Banco conectado com sucesso');

    await db.seq.sync(); 
    console.log('Tabelas sincronizadas');

    api.listen(8080, () => {
      console.log('Servidor rodando na porta 8080');
    });
  } catch (err) {
    console.error('Erro ao iniciar aplicação:', err);
  }
}

start();
