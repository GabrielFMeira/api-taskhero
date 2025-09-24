import UsuarioService from "../services/UsuarioService.js"

const usuarioService = new UsuarioService();

async function register(req, res) {
    try {
        let createdUser = await usuarioService.register(req.body);
        return res.status(200).json({
            data: createdUser
        });
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message
        });
    }
}

async function login(req, res) {
    try {
        let userData = await usuarioService.login(req.body);
        return res.status(200).json({
            data: userData
        });
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message
        });
    }
}

export default {
    register,
    login
};