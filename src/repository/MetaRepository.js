import seq from '../db.js';
import Meta from '../models/Meta.js'

export default class MetaRepository {
    async updateMetaStatusToConcluido(metaId, userId) {
        const [, metas] = await Meta.update(
            {
                status: seq.literal(`
                    CASE
                        WHEN data_fim < NOW() THEN 'CONCLUIDO_COM_ATRASO'
                        ELSE 'CONCLUIDO'
                    END
                `)
            },
            {
                where: {
                    usuario_id: userId,
                    id: metaId
                },
                returning: true
            }
        );

        return metas[0];
    }
}