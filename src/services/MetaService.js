import Meta from '../models/Meta.js';
import StatusEnum from '../enums/StatusEnum.js';
import ObjectUtils from '../utils/ObjectUtils.js';

export default class MetaService{
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

    async deleteMeta(metaId, payload) {
        const user = await ObjectUtils.extractUserFromPayload(payload);

        const deletedCount = await Meta.destroy({ where: { id: metaId, usuario_id: user.id } });

        if (deletedCount === 0) {
            throw new Error(`Meta não encontrada para o id ${metaId}`);
        }
    }
}

