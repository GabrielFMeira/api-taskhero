export default class ObjectUtils{
    static async extractUserFromPayload(payload){
        let userFromToken;
        if (payload && typeof payload === 'object' && payload.id && payload.email) {
            userFromToken = { id: payload.id, email: payload.email };
        } else {
            userFromToken = null; 
        }
        return userFromToken;
    }
}