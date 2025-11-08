import Meta from "../models/Meta.js";
import {sendToUser} from "../websocket/websocket.js";
import Recompensa from "../models/Recompensa.js";

export default class RecompensaService {
     async verifyAchievements(usuario) {
        const metas = await Meta.findAll({ where: { usuario_id: usuario.id } });
        const recompensas = await usuario.getRecompensas();

        await this.checkMetaMaster(usuario, metas, recompensas);
        // TODO fazer o restante
    }

    async checkMetaMaster(usuario, metas, recompensas) {
        const temRecompensa = recompensas.some(r => r.image_id === 'goal_master');
        if (metas.length === 1 && !temRecompensa) {
            const recompensa = await Recompensa.findOne({ where: { image_id: 'goal_master', notified: false } });
            if (!recompensa) return;

            await usuario.addRecompensa(recompensa);
            sendToUser(usuario.id, {
                message: 'Você alcançou uma conquista',
                titulo: recompensa.name,
                id: recompensa.id,
            });
        }
    }
}