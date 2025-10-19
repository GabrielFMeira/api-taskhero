import MetaService from "../services/MetaService.js";

const metaService = new MetaService();

async function createMeta(req, res) {
    try {
        let createdMeta = await metaService.create(req.body, req.user);
        return res.status(200).json({
            data: createdMeta
        });
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message
        });
    }
}
async function updateMeta(req, res) {
    try {
        const { metaId } = req.params;
        const updatedMeta = await metaService.updateMeta(metaId, req.body, req.user);

        return res.status(200).json({
            data: updatedMeta,
            message: "Meta atualizada com sucesso!"
        });
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message
        });
    }
}

const deleteMeta = async (req, res) => {
    try {
        const { metaId } = req.params;
        await metaService.deleteMeta(metaId, req.user);
        return res.status(200).json({
            data: 'Meta excluída com sucesso!'
        });
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message
        });
    }
};

const concludeMeta = async (req, res) => {
    try {
        const { metaId } = req.params;
        const updatedMeta = await metaService.concludeMeta(metaId, req.user);
        return res.status(200).json({
            message: 'Meta excluída com sucesso!',
            data: updatedMeta
        });
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message
        });
    }
}

export default {
    createMeta,
    updateMeta, 
    deleteMeta,
    concludeMeta
};