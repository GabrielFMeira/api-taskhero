import seq from '../db.js';
import StatusEnum from '../enums/StatusEnum.js';
import Tarefa from '../models/Tarefa.js';

export default class TarefaRepository {
    async concludeTarefa(tarefaId, metaId) {
        const [, tarefas] = await Tarefa.update(
            { 
                status: StatusEnum.CONCLUIDO 
            },
            {
                where: {
                    meta_id: metaId,
                    id: tarefaId
                },
                returning: true
            }
        );
        return tarefas[0];
    }

    async findAllRaw(metaId, filtros = {}) {
        const { status, prioridade, sort, order } = filtros;

        const validSortFields = ['titulo', 'prioridade', 'status', 'createdAt'];
        const sortField = validSortFields.includes(sort) ? sort : 'createdAt';
        const sortOrder = order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const whereClauses = [`meta_id = ${metaId}`];
        if (status) {
            if (!Object.values(StatusEnum).includes(status)) {
                throw new Error(`Status inválido: ${status}`);
            }
            whereClauses.push(`status = '${status}'`);
        }
        if (prioridade) {
            whereClauses.push(`prioridade = '${prioridade}'`);
        }

        const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

        const query = `
            SELECT 
                id,
                titulo AS "title",
                descricao AS "description",
                CASE WHEN status = '${StatusEnum.CONCLUIDO}' THEN TRUE ELSE FALSE END AS "completed",
                CASE WHEN status = '${StatusEnum.CONCLUIDO}' THEN "updatedAt" ELSE NULL END AS "completedAt",
                prioridade AS "priority",
                status AS "status",
                "createdAt"
            FROM public.tarefas
            ${whereSQL}
            ORDER BY "${sortField}" ${sortOrder};
        `;

        const [results] = await seq.query(query);
        return results;
    }
}
