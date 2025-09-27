export default class ObjectUtils{
    static async extractUserFromPayload(payload){
        if (!payload && typeof payload !== 'object' && !payload.id && !payload.email) {
            return null;
        }
        return { id: payload.id, email: payload.email };
    }
}