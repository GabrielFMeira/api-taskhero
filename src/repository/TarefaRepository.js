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
        return tarefas;
    }
}