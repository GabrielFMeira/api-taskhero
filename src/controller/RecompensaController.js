import UsuarioService from "../services/UsuarioService.js";

const usuarioService = new UsuarioService();

const compraLogotipo = async (req, res) => {
    try {
        const { recompensaId } = req.params
        let recompensas = await usuarioService.buyLogo(recompensaId, req.user);
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

export default { compraLogotipo };