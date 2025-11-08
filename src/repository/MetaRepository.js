import Meta from '../models/Meta.js'
import seq from '../db.js'
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

    async listMetasByUser(
        userId,
        page = 1,
        limit = 10,
        status = null,
        sortField = 'createdAt',
        sortOrder = 'DESC'
    ) {
        const offset = (page - 1) * limit;

        const fieldMapping = {
            'created': 'createdAt',
            'deadline': 'data_fim',
            'progress': 'progress_calculated',
            'status': 'status',
            'createdAt': 'createdAt',
            'titulo': 'titulo',
            'data_inicio': 'data_inicio',
            'data_fim': 'data_fim'
        };

        const mappedField = fieldMapping[sortField] || 'createdAt';
        const allowedFields = ['createdAt', 'titulo', 'data_inicio', 'data_fim', 'status', 'progress_calculated'];
        const allowedOrder = ['ASC', 'DESC'];

        const field = allowedFields.includes(mappedField) ? mappedField : 'createdAt';
        const order = allowedOrder.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

        const progressCalculation = `
            CASE 
                WHEN (SELECT COUNT(*) FROM tarefas WHERE meta_id = m.id) = 0 THEN 0
                ELSE ROUND((
                    (SELECT COUNT(*) FROM tarefas WHERE meta_id = m.id AND status = 'CONCLUIDO')::numeric / 
                    (SELECT COUNT(*) FROM tarefas WHERE meta_id = m.id)::numeric
                ) * 100)
            END
        `;

        const query = `
            SELECT 
                m.id,
                m.titulo,
                m.descricao,
                m.data_inicio,
                m.data_fim,
                m.status,
                m."createdAt",
                m."updatedAt",
                ${progressCalculation} as progress_calculated,
                COUNT(*) OVER() AS total_metas,
                SUM(CASE WHEN m.status = 'CONCLUIDO' THEN 1 ELSE 0 END) OVER() AS concluidas
            FROM metas m
            WHERE m.usuario_id = :userId
            AND (:status IS NULL OR m.status = :status)
            ORDER BY ${field === 'progress_calculated' ? progressCalculation : `m."${field}"`} ${order}
            LIMIT :limit OFFSET :offset;
        `;

        const metas = await seq.query(query, {
            replacements: { userId, status, limit, offset },
            type: QueryTypes.SELECT
        });

        const total = metas.length > 0 ? parseInt(metas[0].total_metas, 10) : 0;
        const concluidas = metas.length > 0 ? parseInt(metas[0].concluidas, 10) : 0;

        // Buscar tarefas para cada meta
        for (const meta of metas) {
            const tarefasQuery = `
                SELECT 
                    id,
                    titulo,
                    prioridade,
                    status,
                    "createdAt",
                    "updatedAt"
                FROM tarefas
                WHERE meta_id = :metaId
                ORDER BY "createdAt" DESC;
            `;
            
            meta.tarefas = await seq.query(tarefasQuery, {
                replacements: { metaId: meta.id },
                type: QueryTypes.SELECT
            });
        }

        return {
            metas,
            total,
            concluidas,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
}