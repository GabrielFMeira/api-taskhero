import Meta from "../models/Meta.js";
import {sendToUser} from "../websocket/websocket.js";
import Recompensa from "../models/Recompensa.js";
import Usuario from "../models/Usuario.js";
import Tarefa from "../models/Tarefa.js";
import {Op} from "sequelize";

export default class RecompensaService {
     async verifyMetaAchievements(usuario) {
        const metas = await Meta.findAll({ where: { usuario_id: usuario.id } });
        const recompensas = await usuario.getRecompensas();

        await this.checkMetaMaster(usuario, metas, recompensas);
    }

    async checkMetaMaster(usuario, metas, recompensas) {
        const temRecompensa = recompensas.some(r => r.image_id === 'goal_master');
        if (metas.length === 1 && !temRecompensa) {
            await this.findRecompensaAndNotify(usuario, 'goal_master');
        }
    }

    async verifyTarefaAchievements(usuario) {
        const metas = await Meta.findAll({ where: { usuario_id: usuario.id } });
        const metasIds = metas.map(m => m.id);
        const tarefas = await Tarefa.findAll({ where: { meta_id: { [Op.in] : metasIds } } });
        const recompensas = await usuario.getRecompensas();

        if (tarefas.length >= 10 && tarefas.length < 50 && !recompensas.some(r => r.image_id === 'task_warrior')) {
            await this.findRecompensaAndNotify(usuario, 'task_warrior');
        } else if (tarefas.length >= 50 && !recompensas.some(r => r.image_id === 'task_champion')) {
            await this.findRecompensaAndNotify(usuario, 'task_champion');
        }
    }

    async verifyFirstGoal(user) {
        const usuario = await Usuario.findByPk(user.id);
        const metas = await Meta.findAll({ where: {usuario_id: usuario.id} });
        const recompensas = usuario.getRecompensas();
        if (metas.length === 1 && !recompensas.some(r => r.image_id === 'first_goal')) {
            await this.findRecompensaAndNotify(usuario, 'first_goal');
        }
    }

    async findRecompensaAndNotify(usuario, imageId) {
        const recompensa = await Recompensa.findOne({ where: { image_id: imageId } });
        if (!recompensa) return;

        await usuario.addRecompensa(recompensa);
        sendToUser(usuario.id, {
            message: 'Você alcançou uma conquista',
            titulo: recompensa.name,
            id: recompensa.id,
        });
    }
}