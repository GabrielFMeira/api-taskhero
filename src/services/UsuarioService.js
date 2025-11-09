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

        await this.#ensureAvatarsExist();

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

    async #ensureAvatarsExist() {
        const count = await Recompensa.count();
        
        if (count === 0) {
            const avatares = [
                { image_id: '1', tipo: 'AVATAR', name: 'Arqueiro Verde', preco: 100, minimum_level: 1 },
                { image_id: '2', tipo: 'AVATAR', name: 'Deadpool', preco: 200, minimum_level: 1 },
                { image_id: '3', tipo: 'AVATAR', name: 'Invencível', preco: 200, minimum_level: 1 },
                { image_id: '4', tipo: 'AVATAR', name: 'Flash', preco: 350, minimum_level: 1 },
                { image_id: '5', tipo: 'AVATAR', name: 'Aranha Venom', preco: 350, minimum_level: 1 },
                { image_id: '6', tipo: 'AVATAR', name: 'Homem-Aranha', preco: 400, minimum_level: 1 },
                { image_id: '7', tipo: 'AVATAR', name: 'Aranha Preto', preco: 400, minimum_level: 1 },
                { image_id: '8', tipo: 'AVATAR', name: 'Kratos', preco: 500, minimum_level: 1 },
                { image_id: '9', tipo: 'AVATAR', name: 'Demolidor', preco: 1000, minimum_level: 1 },
                { image_id: '10', tipo: 'AVATAR', name: 'Batman', preco: 1000, minimum_level: 1 },
            ];

            await Recompensa.bulkCreate(avatares);
        }
    }

    async login(userLoginDTO) {
        const user = await this.#findUserByEmail(userLoginDTO.email);
        
        if (!user) {
            throw new Error('Email ou senha incorretos!');
        }
        
        let isPasswordValid = await this.#verifyPassword(userLoginDTO.senha, user.senha);
        
        if (!isPasswordValid) {
            throw new Error('Email ou senha incorretos!');
        }

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

    async updateProfile(userId, updateProfileDTO) {
        const user = await Usuario.findByPk(userId);

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        // Verifica se o email está sendo alterado
        if (updateProfileDTO.email && updateProfileDTO.email !== user.email) {
            const existingUser = await this.#findUserByEmail(updateProfileDTO.email);
            if (existingUser) {
                throw new Error('Este e-mail já está em uso por outro usuário');
            }
        }

        // Se está alterando senha, verifica a senha atual
        if (updateProfileDTO.currentPassword && updateProfileDTO.newPassword) {
            const isPasswordValid = await this.#verifyPassword(
                updateProfileDTO.currentPassword, 
                user.senha
            );

            if (!isPasswordValid) {
                throw new Error('Senha atual incorreta');
            }

            // Hash da nova senha
            const hashedPass = await bcrypt.hash(
                updateProfileDTO.newPassword, 
                Number(process.env.SALT_ROUNDS)
            );

            await Usuario.update(
                { 
                    nome: updateProfileDTO.nome || user.nome,
                    email: updateProfileDTO.email || user.email,
                    senha: hashedPass
                },
                { where: { id: userId } }
            );
        } else {
            // Atualiza apenas nome e/ou email
            await Usuario.update(
                { 
                    nome: updateProfileDTO.nome || user.nome,
                    email: updateProfileDTO.email || user.email
                },
                { where: { id: userId } }
            );
        }

        // Busca o usuário atualizado
        const updatedUser = await Usuario.findByPk(userId);

        // Gera novo token com dados atualizados
        const token = this.#generateToken(updatedUser);

        return {
            token,
            nome: updatedUser.nome,
            email: updatedUser.email,
            level: updatedUser.level
        };
    }

    async addExperienceAndCoinsForConcludedMeta(user, metaStatus) {

        let pointsToAdd = this.#getPointsToAddByStatus(metaStatus);
        let xpToAdd = metaStatus === StatusEnum.CONCLUIDO ? 100 : 0;

        let updatedUser = await usuarioRepository.updateUserPointsAndExperience({
            points: pointsToAdd,
            userId: user.id,
            xp: xpToAdd
        });

        updatedUser = await ObjectUtils.buildUserFromDatabaseReturn(updatedUser);

        this.verifyMetaAchievement(updatedUser);
        sendToUser(user.id, updatedUser);
    }

    async addCoinsForConcludedTarefa(user) {

        let updatedUser = await usuarioRepository.updateUserPointsAndExperience({
            points: 10,
            userId: user.id,
            xp: 10
        });

        updatedUser = await ObjectUtils.buildUserFromDatabaseReturn(updatedUser);

        this.verifyTarefaAchievement(updatedUser);
        sendToUser(user.id, updatedUser);
    }

    async removeCoinsForUncompletedTarefa(user) {

        let updatedUser = await usuarioRepository.updateUserPointsAndExperience({
            points: -10,
            userId: user.id,
            xp: -10
        });

        updatedUser = await ObjectUtils.buildUserFromDatabaseReturn(updatedUser);
        sendToUser(user.id, updatedUser);
    }

    async buyAvatar(recompensaId, user) {
        const recompensa = await Recompensa.findOne({
            where : {image_id: recompensaId}
        });
        const usuario = await this.#findUserByEmail(user.email);

        if (!recompensa) {
            throw new Error(`Recompensa não encontrada para o id ${recompensaId}.`);
        } else if (recompensa.preco > usuario.task_coins) {
            throw new Error('Coins insuficientes para realizar compra deste item.')
        }

        // Verifica se o usuário já possui esta recompensa
        const recompensas = await usuario.getRecompensas();
        const jaPossui = recompensas.some(r => r.id === recompensa.id);
        
        if (jaPossui) {
            throw new Error('Você já possui este avatar.');
        }

        return await this.updateUserAvatarsAndEmblems(usuario, recompensa);
    }

    async updateUserAvatarsAndEmblems(usuario, recompensa) {
        await usuario.addRecompensa(recompensa);
        usuario.task_coins -= recompensa.preco;
        await usuario.save();

        // Notifica via WebSocket sobre a mudança de moedas
        sendToUser(usuario.id, {
            task_coins: usuario.task_coins,
            level: usuario.level,
            xp_points: usuario.xp_points
        });

        return await usuario.getRecompensas();
    }

    async getUserRecompensas(userId) {
        const usuario = await Usuario.findByPk(userId);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }
        return await usuario.getRecompensas();
    }

    async verifyMetaAchievement(updatedUser) {
        const user = await this.#findUserByEmail(updatedUser.email);
        recompensaService.verifyAchievements(user);
    }

    async verifyTarefaAchievement(updatedUser) {
        const user = await this.#findUserByEmail(updatedUser.email);
        recompensaService.verifyTarefaAchievements(user);
    }

    async getUserStats(userId) {
        const { Sequelize } = await import('sequelize');
        const Meta = (await import('../models/Meta.js')).default;
        
        const stats = await Meta.findAll({
            where: { usuario_id: userId },
            attributes: [
                'status',
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
            ],
            group: ['status'],
            raw: true
        });

        const statsMap = {
            total: 0,
            completed: 0,
            completedLate: 0,
            expired: 0,
            inProgress: 0
        };

        stats.forEach(stat => {
            const count = parseInt(stat.count);
            statsMap.total += count;

            switch(stat.status) {
                case StatusEnum.CONCLUIDO:
                    statsMap.completed += count;
                    break;
                case StatusEnum.CONCLUIDO_COM_ATRASO:
                    statsMap.completedLate += count;
                    break;
                case StatusEnum.EXPIRADO:
                    statsMap.expired += count;
                    break;
                case StatusEnum.EM_ANDAMENTO:
                case StatusEnum.PENDENTE:
                    statsMap.inProgress += count;
                    break;
            }
        });

        return statsMap;
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

    async selectAvatar(userId, avatarId) {
        const user = await Usuario.findByPk(userId);

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        // Verifica se o usuário possui esse avatar
        const userAvatars = await user.getRecompensas({
            where: {
                image_id: avatarId,
                tipo: 'AVATAR'
            }
        });

        if (userAvatars.length === 0) {
            throw new Error('Você não possui este avatar. Compre-o primeiro!');
        }

        // Atualiza o avatar selecionado
        await user.update({ selected_avatar_id: avatarId });

        const token = this.#generateToken(user);

        sendToUser(userId, {
            type: 'AVATAR_UPDATED',
            data: {
                selected_avatar_id: avatarId
            }
        });

        return { token, selected_avatar_id: avatarId };
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
                task_coins: user.task_coins,
                selected_avatar_id: user.selected_avatar_id || null
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