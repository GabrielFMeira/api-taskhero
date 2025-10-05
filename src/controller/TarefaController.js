import TarefaService from '../services/TarefaService.js';

const tarefaService = new TarefaService();

async function createTask(req, res) { 
    try {
        const { metaId } = req.params;

        await tarefaService.create(metaId, req.body);

        return res.status(201).json({ message: 'Tarefas criadas com sucesso!' }); 
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
}

export default {createTask};