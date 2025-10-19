export default class ObjectUtils{
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
}