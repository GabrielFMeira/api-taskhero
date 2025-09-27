import Meta from '../models/Meta.js';
import StatusEnum from '../enums/StatusEnum.js';
import ObjectUtils from '../utils/ObjectUtils.js';

export default class MetaService{
    async create(createMetaDTO, payload){
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
}

