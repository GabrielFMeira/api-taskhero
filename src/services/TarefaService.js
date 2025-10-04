import Tarefa from '../models/Tarefa.js'
import StatusEnum from '../enums/StatusEnum.js';

export default class TarefaService{
    async create(metaId, tasksDataArray){ 
        const tasksToCreate = tasksDataArray.map(taskDTO => ({
            titulo: taskDTO.titulo,
            descricao: taskDTO.descricao,
            data_limite: taskDTO.data_limite,
            prioridade: taskDTO.prioridade, 
            status: StatusEnum.PENDENTE,
            meta_id: metaId,
        }));

        await Tarefa.bulkCreate(tasksToCreate); 
    }
}   