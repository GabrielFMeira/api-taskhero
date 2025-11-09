import Meta from '../models/Meta.js';
import Tarefa from '../models/Tarefa.js';
import StatusEnum from '../enums/StatusEnum.js';
import ObjectUtils from '../utils/ObjectUtils.js';
import UsuarioService from './UsuarioService.js';
import MetaRepository from '../repository/MetaRepository.js';
import RecompensaService from "./RecompensaService.js";

const usuarioService = new UsuarioService();
const metaRepository = new MetaRepository();
const recompensaService = new RecompensaService();

export default class MetaService {
    async create(createMetaDTO, payload) {
        const user = await ObjectUtils.extractUserFromPayload(payload);
        const meta = await Meta.create({
            titulo: createMetaDTO.titulo,
            descricao: createMetaDTO.descricao,
            data_inicio: createMetaDTO.data_inicio,
            data_fim: createMetaDTO.data_fim,
            status: StatusEnum.PENDENTE,
            usuario_id: user.id
        });

        recompensaService.verifyFirstGoal(user);
        return meta;
    }

    async updateMeta(metaId, updateMetaDTO, payload) {
        const user = await ObjectUtils.extractUserFromPayload(payload);

        const meta = await Meta.findOne({
            where: {
                id: metaId,
                usuario_id: user.id
            }
        });

        if (!meta) {
            throw new Error(`Meta não encontrada para o id ${metaId}`);
        }

        meta.titulo = updateMetaDTO.titulo ?? meta.titulo;
        meta.descricao = updateMetaDTO.descricao ?? meta.descricao;
        meta.status = updateMetaDTO.status ?? meta.status;
        
        if (updateMetaDTO.data_inicio) {
            meta.data_inicio = updateMetaDTO.data_inicio;
        }
        if (updateMetaDTO.data_fim) {
            meta.data_fim = updateMetaDTO.data_fim;
        }

        await meta.save();


        const metaCompleta = await Meta.findOne({
            where: {
                id: metaId,
                usuario_id: user.id
            },
            include: [{
                model: Tarefa,
                as: 'tarefas'
            }]
        });

        const metaJSON = metaCompleta.toJSON();
        
        return metaJSON;
    }

    async deleteMeta(metaId, payload) {
        const user = await ObjectUtils.extractUserFromPayload(payload);

        const deletedCount = await Meta.destroy({ where: { id: metaId, usuario_id: user.id } });

        if (deletedCount === 0) {
            throw new Error(`Meta não encontrada para o id ${metaId}`);
        }
    }

    async concludeMeta(metaId, payload) {
        const user = await ObjectUtils.extractUserFromPayload(payload);
        
        const meta = await Meta.findOne({
            where: {
                id: metaId,
                usuario_id: user.id
            },
            include: [{
                model: Tarefa,
                as: 'tarefas'
            }]
        });

        if (!meta) {
            throw new Error(`Meta não encontrada para o id ${metaId}`);
        }

        // Metas expiradas podem ser concluídas, mas receberão status CONCLUIDO_COM_ATRASO
        const tarefas = meta.tarefas || [];
        
        if (tarefas.length === 0) {
            throw new Error('Não é possível concluir uma meta sem tarefas');
        }

        const tarefasPendentes = tarefas.filter(t => t.status !== 'CONCLUIDO');
        
        if (tarefasPendentes.length > 0) {
            throw new Error(`Não é possível concluir a meta. Ainda existem ${tarefasPendentes.length} tarefa(s) pendente(s)`);
        }

        const now = new Date();
        const dataFim = new Date(meta.data_fim);
        const statusConclusao = now > dataFim ? StatusEnum.CONCLUIDO_COM_ATRASO : StatusEnum.CONCLUIDO;

        const updatedMeta = await metaRepository.updateMetaStatusToConcluido(metaId, user.id);
        await usuarioService.addExperienceAndCoinsForConcludedMeta(user, statusConclusao);
        
        const metaCompleta = await Meta.findOne({
            where: {
                id: metaId,
                usuario_id: user.id
            },
            include: [{
                model: Tarefa,
                as: 'tarefas'
            }]
        });

        const metaJSON = metaCompleta.toJSON();
        
        return metaJSON;
    }
    
    async listMetas(payload, page = 1, status = null, sortField = 'createdAt', sortOrder = 'DESC') {
        const user = await ObjectUtils.extractUserFromPayload(payload);

        const { metas, total, concluidas, totalPages } =
            await metaRepository.listMetasByUser(user.id, page, 10, status, sortField, sortOrder);

        const metasWithProgress = metas.map(meta => {
            const tarefas = meta.tarefas ?? [];
            const concluidasTarefas = tarefas.filter(t => t.status === 'CONCLUIDO').length;
            const progresso = tarefas.length
                ? Math.round((concluidasTarefas / tarefas.length) * 100)
                : 0;

            const metaJSON = { ...meta };

            return { ...metaJSON, progresso };
        });

        return {
            metas: metasWithProgress,
            totalMetas: total,
            concluidas,
            page,
            totalPages
        };
    }

    async getMetaById(metaId, payload) {
        const user = await ObjectUtils.extractUserFromPayload(payload);

        const meta = await Meta.findOne({
            where: {
                id: metaId,
                usuario_id: user.id
            },
            include: [{
                model: Tarefa,
                as: 'tarefas'
            }]
        });

        if (!meta) {
            throw new Error(`Meta não encontrada para o id ${metaId}`);
        }

        const metaJSON = meta.toJSON();
        const tarefas = metaJSON.tarefas ?? [];
        const concluidasTarefas = tarefas.filter(t => t.status === 'CONCLUIDO').length;
        const progresso = tarefas.length
            ? Math.round((concluidasTarefas / tarefas.length) * 100)
            : 0;

        return { ...metaJSON, progresso };
    }
}
