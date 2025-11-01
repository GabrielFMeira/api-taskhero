import { WebSocketServer } from "ws";

const clients = new Map();

export function setupWebSocket(server) {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws, req) => {
        const params = new URLSearchParams(req.url.replace('/', ''));
        const userId = params.get('userId');

        if (!userId) {
            ws.close(1008, 'User ID not provided');
            return;
        }

        clients.set(userId, ws);
        console.log(`Usuário ${userId} conectado`);

        ws.on('message', (message) => {
            console.log(`Mensagem de ${userId}:`, message.toString());
        });

        ws.on('close', () => {
            clients.delete(userId);
            console.log(`Usuário ${userId} desconectado`);
        });
    });

    console.log('Servidor WebSocket ativo');
}

export function sendToUser(userId, data) {
    const ws = clients.get(userId);
    if (ws && ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(data));
        console.log(`Mensagem enviada para ${userId}`);
    } else {
        console.log(`Usuário ${userId} não está conectado`);
    }
}