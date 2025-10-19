import seq from '../db.js';
import Usuario from '../models/Usuario.js';

export default class UsuarioRepository {
    async updateUserPointsAndExperience({points, xp, userId}) {
        const dataToUpdate = {};

        if (points !== undefined) dataToUpdate.lula_coins = seq.literal(`lula_coins + ${Number(points)}`);
        if (xp !== undefined) dataToUpdate.xp_points = seq.literal(`xp_points + ${Number(xp)}`);

        await Usuario.update(
            dataToUpdate,
            {
                where: {
                    id: userId
                },
                returning: true
            }
        );
    }
}