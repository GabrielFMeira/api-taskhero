import UsuarioService from "../services/UsuarioService.js";

const usuarioService = new UsuarioService();

const compraAvatar = async (req, res) => {
    try {
        const { recompensaId } = req.params
        let recompensas = await usuarioService.buyAvatar(recompensaId, req.user);
        return res.status(200).json({
            data: recompensas,
            message: 'Avatar comprado com sucesso!'
        });
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message
        });
    }
};

const listarRecompensas = async (req, res) => {
    try {
        const recompensas = await usuarioService.getUserRecompensas(req.user.id);
        return res.status(200).json({
            data: recompensas
        });
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message
        });
    }
};

export default { compraAvatar, listarRecompensas };