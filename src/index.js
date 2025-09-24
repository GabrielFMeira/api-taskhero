import express from 'express';
import routers from './routers/index.js';
import db from './models/index.js';
import dotenv from 'dotenv';

dotenv.config();
const api = express();

console.log({
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME
});

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
