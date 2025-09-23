import usuarioService from "../services/UsuarioService"

export async function register(req, res) {
    try {
        let createdUser = usuarioService.register(req.body);
        return res.status(200).json({
            data: createdUser
        })
    } catch (err) {
        res.send(400).json({
            status: 400,
            message: err
        });
    }
}