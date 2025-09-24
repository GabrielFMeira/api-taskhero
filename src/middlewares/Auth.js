import jwt from 'jsonwebtoken';

//TODO: colocar isso em um .env
export const JWT_SECRET = 'ksbflkno7u7985perij9*)Y&(';
export const SALT_ROUNDS = 10;

export async function validateToken(req, res, next) {
    const [, token] = req.headers.authorization?.split(' ') || [' ', ' '];

    if (!token || token.trim() === '') return res.status(401).send('No token provided');

    try {
        const payload = jwt.verify(token, JWT_SECRET);

        req.user = payload;
        return next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({message: 'Token inválido'});
    }
}