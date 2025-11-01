export default class ObjectUtils {
    static async extractUserFromPayload(payload){
        if (!payload && typeof payload !== 'object' && !payload.id && !payload.email) {
            return null;
        }
        return { 
                id: payload.id, 
                email: payload.email, 
                nome: payload.nome, 
                xp_points: payload.xp_points, 
                level: payload.level, 
                lula_coins: payload.lula_coins 
            };
    }

    static async buildUserFromDatabaseReturn(dbReturn) {
        if (!dbReturn && typeof dbReturn !== 'object') {
            return null;
        }
        return {
            id: dbReturn.id,
            email: dbReturn.email,
            nome: dbReturn.nome,
            xp_points: dbReturn.xp_points,
            level: dbReturn.level,
            lula_coins: dbReturn.lula_coins
        };
    }
}