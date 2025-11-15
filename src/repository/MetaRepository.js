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

        // Validação de campos permitidos para ordenação
        const allowedFields = ['createdAt', 'titulo', 'data_inicio', 'data_fim', 'status', 'progress_calculated'];
        const allowedOrder = ['ASC', 'DESC'];

        const field = allowedFields.includes(sortField) ? sortField : 'createdAt';
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

        let statusCondition = ':status IS NULL OR m.status = :status';
        if (status === 'CONCLUIDO') {

            statusCondition = `m.status IN ('CONCLUIDO', 'CONCLUIDO_COM_ATRASO')`;
        } else if (status) {
            statusCondition = 'm.status = :status';
        }

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
                SUM(CASE WHEN m.status IN ('CONCLUIDO', 'CONCLUIDO_COM_ATRASO') THEN 1 ELSE 0 END) OVER() AS concluidas
            FROM metas m
            WHERE m.usuario_id = :userId
            AND (${statusCondition})
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

    async markMetasAsExpired() {
        const metasExpiradasMap = new Map();

        const [results] = await seq.query(
            `
            update metas m
            set status = 'EXPIRADO'::enum_metas_status
            where m.data_fim < current_timestamp
            and status <> 'EXPIRADO'
            RETURNING id, usuario_id
            `
        )

        results.forEach(r => {
            if (!metasExpiradasMap.has(r.usuario_id)) {
                metasExpiradasMap.set(r.usuario_id, []);
            }
            metasExpiradasMap.get(r.usuario_id).push(r.id);
        });

        return metasExpiradasMap;
    }
}