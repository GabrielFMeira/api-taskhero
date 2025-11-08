import express from 'express';
import routers from './routers/index.js';
import db from './models/index.js';
import dotenv from 'dotenv';
import http from 'http';
import {setupWebSocket} from './websocket/websocket.js';

dotenv.config();
const api = express();
const server = http.createServer(api);

api.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

api.use(express.json());
api.use(routers);
setupWebSocket(server);

async function start() {
  try {
    await db.seq.authenticate();
    console.log('Banco conectado com sucesso');

    await db.seq.sync({alter: true}); 
    console.log('Tabelas sincronizadas');

    server.listen(8080, () => {
      console.log('Servidor rodando na porta 8080');
    });
  } catch (err) {
    console.error('Erro ao iniciar aplicação:', err);
  }
}

start();
