import Tarefa from '../models/Tarefa.js'
import StatusEnum from '../enums/StatusEnum.js';
import ObjectUtils from "../utils/ObjectUtils.js"
import TarefaRepository from '../repository/TarefaRepository.js';
import UsuarioService from './UsuarioService.js';

const tarefaRepository = new TarefaRepository();
const usuarioService = new UsuarioService();

export default class TarefaService{
    async create(metaId, tasksDataArray) {
        const tasks = Array.isArray(tasksDataArray) ? tasksDataArray : [tasksDataArray];

        const tasksToCreate = tasks.map(taskDTO => ({
            titulo: taskDTO.titulo,
            prioridade: taskDTO.prioridade,
            status: StatusEnum.PENDENTE,
            meta_id: metaId,
        }));

        const createdTasks = await Tarefa.bulkCreate(tasksToCreate);
        return createdTasks;
    }

    async updateTarefa(tarefaId, metaId, updateTaskDTO, payload) {
        const tarefa = await Tarefa.findOne({
            where: {
              id: tarefaId,
              meta_id: metaId
            }
        });

        if (!tarefa) {
         throw new Error(`Tarefa não encontrada para o id ${tarefaId}`);
        }

        const statusAnterior = tarefa.status;

        tarefa.titulo = updateTaskDTO.titulo ?? tarefa.titulo;
        tarefa.prioridade = updateTaskDTO.prioridade ?? tarefa.prioridade;
        
        if (updateTaskDTO.status !== undefined) {
            tarefa.status = updateTaskDTO.status;
        }

        await tarefa.save();

        if (statusAnterior === StatusEnum.CONCLUIDO && tarefa.status === StatusEnum.PENDENTE && payload) {
            const user = await ObjectUtils.extractUserFromPayload(payload);
            await usuarioService.removeCoinsForUncompletedTarefa(user);
        }

        return tarefa;
    }

    async deleteTarefa(tarefaId, metaId) {
        const deletedCount = Tarefa.destroy({ where: { id: tarefaId, meta_id: metaId }});

        if (deletedCount === 0) {
            throw new Error(`Tarefa não encontrada para o id ${tarefaId}`);
        }
    }

    async concludeTarefa(tarefaId, metaId, payload) {
        const user = await ObjectUtils.extractUserFromPayload(payload);
        const updatedTarefa = tarefaRepository.concludeTarefa(tarefaId, metaId);
        await usuarioService.addCoinsForConcludedTarefa(user);
        return updatedTarefa;
    }

    
    async findAll(metaId, filtros = {}) {
        if (!metaId) throw new Error('metaId é obrigatório para buscar tarefas.');

        const tarefas = await tarefaRepository.findAllRaw(metaId, filtros);

        return tarefas;
    }
}   