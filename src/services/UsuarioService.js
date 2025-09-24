import Usuario from '../models/Usuario.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AuthenticatedUserDTO from '../dto/AuthenticatedUserDTO.js'
import {JWT_SECRET, SALT_ROUNDS} from '../middlewares/Auth.js';

export default class UsuarioService {
    async register(createUserDTO) {
        const existingUser = await this.#findUserByEmail(createUserDTO.email);

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

        const token = this.#generateToken(user);

        return {token};
    }

    async login(userLoginDTO) {
        const user = await this.#findUserByEmail(userLoginDTO.email);
        if (!user) throw new Error('Usuário inexistente!');

        let isPasswordValid = await this.#verifyPassword(userLoginDTO.senha, user.senha);
        if (!isPasswordValid) throw new Error('Email ou senha incorretos!');

        const token = this.#generateToken(user);

        return this.#createReturnDTO(user, token);
    }

    #findUserByEmail(email) {
        return Usuario.findOne({
            where: {email: email}
        });
    }

    #createReturnDTO(user, token) {
        return new AuthenticatedUserDTO({
            token: token,
            nome: user.nome,
            email: user.email,
            level: user.level
        });
    }

    #verifyPassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    #generateToken(user) {
        return jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '4h' }
        );
    }
}