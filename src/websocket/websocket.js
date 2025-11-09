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

        // Converter para string para garantir consistência
        const userIdString = String(userId);
        
        // Fechar conexão anterior se existir
        const existingWs = clients.get(userIdString);
        if (existingWs && existingWs.readyState === existingWs.OPEN) {
            existingWs.close();
        }

        clients.set(userIdString, ws);
        console.log(`Usuário ${userIdString} conectado`);

        ws.on('message', (message) => {
            console.log(`Mensagem de ${userIdString}:`, message.toString());
        });

        ws.on('close', () => {
            clients.delete(userIdString);
            console.log(`Usuário ${userIdString} desconectado`);
        });

        ws.on('error', (error) => {
            console.error(`Erro no WebSocket do usuário ${userIdString}:`, error.message);
        });
    });

    console.log('Servidor WebSocket ativo');
}

export function sendToUser(userId, data) {
    // Converter userId para string para consistência
    const userIdString = String(userId);
    
    const ws = clients.get(userIdString);
    
    if (ws && ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify(data));
    }
}