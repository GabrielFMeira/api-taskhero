import Meta from '../models/Meta.js'
import sequelize from '../db.js'
import { QueryTypes } from 'sequelize';

export default class MetaRepository {
    async updateMetaStatusToConcluido(metaId, userId) {
        const [, metas] = await Meta.update(
            {
                status: seq.literal(`
                    CASE
                        WHEN data_fim < NOW() THEN 'CONCLUIDO_COM_ATRASO'::enum_metas_status
                        ELSE 'CONCLUIDO'::enum_metas_status
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

async listMetasByUser(userId, page = 1, limit = 10, status = null, sortField = 'createdAt', sortOrder = 'DESC') {
    const offset = (page - 1) * limit;

    const allowedFields = ['createdAt', 'titulo', 'data_inicio', 'data_fim', 'status'];
    const allowedOrder = ['ASC', 'DESC'];

    const field = allowedFields.includes(sortField) ? `"${sortField}"` : '"createdAt"';
    const order = allowedOrder.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    const query = `
        SELECT 
            m.*,
            COUNT(*) OVER() AS total_metas,
            SUM(CASE WHEN m.status = 'CONCLUIDO' THEN 1 ELSE 0 END) OVER() AS concluidas
        FROM metas m
        WHERE m.usuario_id = :userId
          AND (:status IS NULL OR m.status = :status)
        ORDER BY m.${field} ${order}
        LIMIT :limit OFFSET :offset;
    `;

    const metas = await sequelize.query(query, {
        replacements: { userId, status, limit, offset },
        type: QueryTypes.SELECT
    });

    const total = metas.length > 0 ? parseInt(metas[0].total_metas, 10) : 0;
    const concluidas = metas.length > 0 ? parseInt(metas[0].concluidas, 10) : 0;

    return {
        metas,
        total,
        concluidas,
        page,
        totalPages: Math.ceil(total / limit)
    };
}
}