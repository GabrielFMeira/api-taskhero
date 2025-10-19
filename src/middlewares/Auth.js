import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export async function validateToken(req, res, next) {
    const [, token] = req.headers.authorization?.split(' ') || [' ', ' '];

    if (!token || token.trim() === '') return res.status(401).send('No token provided');

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        req.user = payload;
        return next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({message: 'Token inválido'});
    }
}