import seq from '../db.js';
import Usuario from '../models/Usuario.js';

export default class UsuarioRepository {
    //TODO verificar se um dos dois parametros é null
    async updateUserPointsAndExperience({points, xp, userId}) {
        const [rowsUpdated] = Usuario.update(
            {
                lula_coins: points,
                xp_points: xp
            },
            {
                where: {
                    id: userId
                },
                returning: true
            }
        );

        return rowsUpdated;
    }
}