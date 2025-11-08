import Usuario from '../models/Usuario.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import UsuarioRepository from '../repository/UsuarioRepository.js';
import StatusEnum from '../enums/StatusEnum.js';
import { sendToUser } from '../websocket/websocket.js';
import ObjectUtils from '../utils/ObjectUtils.js';
import Recompensa from "../models/Recompensa.js";
import RecompensaService from "./RecompensaService.js"

dotenv.config();

const usuarioRepository = new UsuarioRepository();
const recompensaService = new RecompensaService();

export default class UsuarioService {
    async register(createUserDTO) {
        const existingUser = await this.#findUserByEmail(createUserDTO.email);

        if (existingUser) {
            throw new Error('O usuário já existe no sistema!');
        }

        const hashedPass = await bcrypt.hash(createUserDTO.senha, Number(process.env.SALT_ROUNDS));

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

        let updatedUser = await usuarioRepository.updateUserPointsAndExperience({
            points: pointsToAdd,
            userId: user.id,
            xp: xperienceToAdd
        });

        updatedUser = await ObjectUtils.buildUserFromDatabaseReturn(updatedUser);

        this.verifyAchievement(updatedUser);
        sendToUser(user.id, updatedUser);
    }

    async addCoinsForConcludedTarefa(user) {
        let updatedUser = await usuarioRepository.updateUserPointsAndExperience({
            points: 10,
            userId: user.id
        });

        updatedUser = await ObjectUtils.buildUserFromDatabaseReturn(updatedUser);

        this.verifyAchievement(updatedUser);
        sendToUser(user.id, updatedUser);
    }

    async buyLogo(recompensaId, user) {
        const recompensa = await Recompensa.findOne({
            where : {image_id: recompensaId}
        });
        const usuario = await this.#findUserByEmail(user.email);

        if (!recompensa) {
            throw new Error(`Recompensa não encontrada para o id ${recompensaId}.`);
        } else if (recompensa.preco > usuario.task_coins) {
            throw new Error('Coins insuficientes para realixzar compra deste item.')
        }

        return await this.updateUserProfilePicturesAndEmblems(usuario, recompensa);
    }

    async updateUserProfilePicturesAndEmblems(usuario, recompensa) {
        await usuario.addRecompensa(recompensa);
        usuario.task_coins -= recompensa.preco;
        await usuario.save();

        return await usuario.getRecompensas();
    }

    async verifyAchievement(updatedUser) {
        const user = await this.#findUserByEmail(updatedUser.email);
        recompensaService.verifyAchievement(user);
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
                task_coins: user.task_coins
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