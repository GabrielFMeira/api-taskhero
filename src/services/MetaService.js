import Meta from '../models/Meta.js';
import StatusEnum from '../enums/StatusEnum.js';
import ObjectUtils from '../utils/ObjectUtils.js';
import UsuarioService from './UsuarioService.js';
import MetaRepository from '../repository/MetaRepository.js';

const usuarioService = new UsuarioService();
const metaRepository = new MetaRepository();

export default class MetaService {
    async create(createMetaDTO, payload) {
        const user = await ObjectUtils.extractUserFromPayload(payload);
        await Meta.create({
            titulo: createMetaDTO.titulo,
            descricao: createMetaDTO.descricao,
            data_inicio: createMetaDTO.data_inicio,
            data_fim: createMetaDTO.data_fim,
            status: StatusEnum.PENDENTE,
            usuario_id: user.id
        });
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

        await meta.save();

        return meta;
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
        const updatedMeta = await metaRepository.updateMetaStatusToConcluido(metaId, user.id);
        await usuarioService.addExperienceAndCoinsForConcludedMeta(user, updatedMeta.status);
        return updatedMeta;
    }
    
    async listMetas(payload, page = 1, status = null) {
        const user = await ObjectUtils.extractUserFromPayload(payload);

        const { metas, total, concluidas, totalPages } =
            await metaRepository.listMetasByUser(user.id, page, 10, status);

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
}
