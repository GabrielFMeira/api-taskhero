import Tarefa from '../models/Tarefa.js'
import StatusEnum from '../enums/StatusEnum.js';
import ObjectUtils from "../utils/ObjectUtils.js"

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

    async updateTarefa(tarefaId,metaId, updateTaskDTO, payload) {
        const tarefa = await Tarefa.findOne({
            where: {
              id: tarefaId,
              meta_id: metaId
            }
        });

        if (!tarefa) {
         throw new Error(`Tarefa não encontrada para o id ${tarefaId}`);
        }

        tarefa.titulo = updateTaskDTO.titulo ?? tarefa.titulo;
        tarefa.descricao = updateTaskDTO.descricao ?? tarefa.descricao;
        tarefa.status = updateTaskDTO.status ?? tarefa.status;

        await tarefa.save();

        return tarefa;
    }

    async deleteTarefa(tarefaId, metaId) {
        const deletedCount = Tarefa.destroy({ where: { id: tarefaId, meta_id: metaId }});

        if (deletedCount === 0) {
            throw new Error(`Tarefa não encontrada para o id ${tarefaId}`);
        }
    }
}   