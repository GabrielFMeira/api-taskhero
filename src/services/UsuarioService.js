import Usuario from '../models/Usuario.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//TODO: colocar isso em um .env
const JWT_SECRET = 'ksbflkno7u7985perij9*)Y&(';
const SALT_ROUNDS = 10;

export default class UsuarioService {
    async register(createUserDTO) {
        const existingUser = await Usuario.findOne({
            where: {email: createUserDTO.email}
        });

        if (existingUser) {
            throw new Error('O usuário já existe no sistema!');
        }

        const hashedPass = await bcrypt.hash(createUserDTO.senha, SALT_ROUNDS);

        const user = await Usuario.create({
            nome: createUserDTO.nome,
            email: createUserDTO.email,
            senha: hashedPass,
            level: 1
        });

        const token = jwt.sign(
            {id: user.id, email: user.email},
            JWT_SECRET,
            {expiresIn: '4h'}
        )

        return {token};
    }
}