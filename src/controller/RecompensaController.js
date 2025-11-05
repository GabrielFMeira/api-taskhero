import UsuarioService from "../services/UsuarioService.js";

const usuarioService = new UsuarioService();

const compraLogotipo = async (req, res) => {
    try {
        const { recompensaId } = req.params
        let user = await usuarioService.buyLogo(recompensaId, req.user);
        //TODO pensar em retornar com user o array dos ids de imagens disponíveis, aqui e em outros lugares
        return res.status(200).json({
            data: user
        });
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message
        });
    }
};

export default { compraLogotipo };