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

        const updatedUser = affectedRows && affectedRows.length 
            ? affectedRows[0] 
            : await Usuario.findByPk(userId);

        let currentLevel = 1;
        let xpNeeded = 100;
        let remainingXP = updatedUser.xp_points;

        while (remainingXP >= xpNeeded) {
            remainingXP -= xpNeeded;
            currentLevel++;
            xpNeeded = 100 * currentLevel;
        }

        if (currentLevel !== updatedUser.level) {
            await Usuario.update(
                { level: currentLevel },
                { where: { id: userId } }
            );
            updatedUser.level = currentLevel;
        }

        return updatedUser;
    }
}