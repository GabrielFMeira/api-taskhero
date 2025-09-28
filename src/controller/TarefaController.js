import TarefaService from '../services/TarefaService.js';
import CreateTaskDTO from '../dto/CreateTaskDTO.js';

const tarefaService = new TarefaService();

async function createTask(req, res) { 
    try {
        console.log('Chegou no controller')
        const { metaId } = req.params;
        const payload = req.payload; 
        const requestBody = req.body;
        
        let tasksToProcess;

        if (Array.isArray(requestBody)) {
            tasksToProcess = requestBody;
        } else if (typeof requestBody === 'object' && requestBody !== null) {
            tasksToProcess = [requestBody]; 
        } else {
            return res.status(400).json({ error: 'O corpo da requisição é inválido.' });
        }

        const tasksDTOArray = tasksToProcess.map(taskData => new CreateTaskDTO(taskData));
        
        await tarefaService.create(metaId, tasksDTOArray, payload);
        
        const message = tasksToProcess.length > 1 ? 
                        'Tarefas criadas com sucesso!' : 
                        'Tarefa criada com sucesso!';
        
        return res.status(201).json({ message }); 
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
}

export default {createTask};