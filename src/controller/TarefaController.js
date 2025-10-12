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

async function updateTarefa(req, res) {
    try {
        const { metaId, tarefaId } = req.params;
        const updatedTarefa = await tarefaService.updateTarefa(tarefaId,metaId, req.body, req.user);

        return res.status(200).json({
            data: updatedTarefa,
            message: "Tarefa atualizada com sucesso!"
        });
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message
        });
    }
}


const deleteTarefa = async (req, res) => {
    try {
        const { tarefaId } = req.params;
        const { metaId } = req.params;

        await tarefaService.deleteTarefa(tarefaId, metaId);

        return res.status(201).json({ message: 'Tarefa excluída com sucesso!' }); 
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
};

export default {
    createTask,
    updateTarefa,
    deleteTarefa
};