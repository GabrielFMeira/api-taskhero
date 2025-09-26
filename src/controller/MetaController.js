import MetaService from "../services/MetaService.js";

const metaService = new MetaService();

async function createMeta(req, res) {
    try {
        let createdMeta = await metaService.create(req.body);
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
export default{createMeta};