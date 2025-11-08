import Meta from "../models/Meta.js";
import {sendToUser} from "../websocket/websocket.js";
import Recompensa from "../models/Recompensa.js";
import Usuario from "../models/Usuario.js";

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
            await this.findRecompensaAndNotify(usuario, 'goal_master');
        }
    }

    async verifyFirstGoal(user) {
        const usuario = await Usuario.findByPk(user.id);
        const metas = await Meta.findAll({ where: {usuario_id: usuario.id} });
        if (metas.length === 1) {
            await this.findRecompensaAndNotify(usuario, 'first_goal');
        }
    }

    //TODO verificar esse notified, deve existir outra forma de verificar isso, talvez olhar pra uma array de recompensas funcione
    async findRecompensaAndNotify(usuario, imageId) {
        const recompensa = await Recompensa.findOne({ where: { image_id: imageId, notified: false } });
        if (!recompensa) return;

        await usuario.addRecompensa(recompensa);
        sendToUser(usuario.id, {
            message: 'Você alcançou uma conquista',
            titulo: recompensa.name,
            id: recompensa.id,
        });
    }
}