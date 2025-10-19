import Usuario from '../models/Usuario.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UsuarioRepository from '../repository/UsuarioRepository.js';
import StatusEnum from '../enums/StatusEnum.js';

dotenv.config();

const usuarioRepository = new UsuarioRepository();

export default class UsuarioService {
    async register(createUserDTO) {
        const existingUser = await this.#findUserByEmail(createUserDTO.email);

        if (existingUser) {
            throw new Error('O usuário já existe no sistema!');
        }

        const hashedPass = await bcrypt.hash(createUserDTO.senha, process.env.SALT_ROUNDS);

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
        let isPasswordValid = await this.#verifyPassword(userLoginDTO.senha, user.senha);
        if (!isPasswordValid || !user) throw new Error('Email ou senha incorretos!');

        const token = this.#generateToken(user);

        return this.#createReturnDTO(user, token);
    }

    async resetPassword(passwordResetDTO) {
        const user = await Usuario.findOne({
            where: { email: passwordResetDTO.email }
        });

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        const hashedPass = await bcrypt.hash(passwordResetDTO.password, process.env.SALT_ROUNDS);

        await Usuario.update(
            { senha: hashedPass },
            { where: { email: user.email } }
        );
    }

    async addExperienceAndCoinsForConcludedMeta(user, metaStatus) {
        let pointsToAdd = this.#getPointsToAddByStatus(metaStatus);
        let xperienceToAdd = metaStatus === StatusEnum.CONCLUIDO ? 1 : 0;

        await usuarioRepository.updateUserPointsAndExperience({
            points: pointsToAdd,
            userId: user.id,
            xp: xperienceToAdd
        });
    }

    async addCoinsForConcludedTarefa(user) {
        await usuarioRepository.updateUserPointsAndExperience({
            points: 10,
            userId: user.id
        });
    }

    #findUserByEmail(email) {
        return Usuario.findOne({
            where: {email: email}
        });
    }

    #createReturnDTO(user, token) {
        return {
            token: token,
            nome: user.nome,
            email: user.email,
            level: user.level
        };
    }

    #verifyPassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    #generateToken(user) {
        return jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                nome: user.nome, 
                xp_points: user.xp_points, 
                level: user.level, 
                lula_coins: user.lula_coins 
            },
            process.env.JWT_SECRET,
            { expiresIn: '4h' }
        );
    }

    #getPointsToAddByStatus(status) {
        switch(status) {
            case StatusEnum.CONCLUIDO:
                return 100;
            case StatusEnum.CONCLUIDO_COM_ATRASO:
                return 50;
            default:
                throw new Error(`status inválido para atribuição de pontos ${status}`);
        }
    }
}