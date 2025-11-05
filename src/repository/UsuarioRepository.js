import seq from '../db.js';
import Usuario from '../models/Usuario.js';

export default class UsuarioRepository {
    async updateUserPointsAndExperience({points, xp, userId}) {
        const dataToUpdate = {};

        if (points !== undefined) dataToUpdate.task_coins = seq.literal(`task_coins + ${Number(points)}`);
        if (xp !== undefined) dataToUpdate.xp_points = seq.literal(`xp_points + ${Number(xp)}`);

        const result = await Usuario.update(
            dataToUpdate,
            {
                where: {
                    id: userId
                },
                returning: true
            }
        );

        const affectedCount = Array.isArray(result) ? result[0] : result;
        const affectedRows = Array.isArray(result) ? result[1] : undefined;

        if (affectedCount === 0) return null;

        if (affectedRows && affectedRows.length) {
            return affectedRows[0];
        }

        return await Usuario.findByPk(userId);
    }
}