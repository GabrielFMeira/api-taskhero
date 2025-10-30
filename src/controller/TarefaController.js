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

const concludeTarefa = async (req, res) => {
    try {
        const { tarefaId, metaId } = req.params;
        let updatedTarefa = await tarefaService.concludeTarefa(tarefaId, metaId, req.user);
        return res.status(201).json({ 
            message: 'Tarefa concluída com sucesso!',
            data: updatedTarefa
        }); 
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
}

async function getTarefas(req, res) {
  try {
    const { metaId } = req.params;
    const filtros = req.query; 
    const tarefas = await tarefaService.findAll(metaId, filtros);

    return res.status(200).json({
      data: tarefas,
      message: 'Tarefas listadas com sucesso!'
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
}

export default {
    createTask,
    updateTarefa,
    deleteTarefa,
    concludeTarefa,
    getTarefas
};