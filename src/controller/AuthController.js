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

async function resetPassword(req, res) {
    try {
        await usuarioService.resetPassword(req.body);
        return res.status(200).json({
            message: 'Senha atualizada com sucesso!'
        });
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message
        });
    }
}

async function updateProfile(req, res) {
    try {
        const userId = req.user.id;
        const updatedData = await usuarioService.updateProfile(userId, req.body);
        return res.status(200).json({
            data: updatedData,
            message: 'Perfil atualizado com sucesso!'
        });
    } catch (err) {
        res.status(400).json({
            status: 400,
            message: err.message
        });
    }
}

async function getUserStats(req, res) {
    try {
        const userId = req.user.id;
        const stats = await usuarioService.getUserStats(userId);
        return res.status(200).json({
            data: stats
        });
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err.message
        });
    }
}

async function selectAvatar(req, res) {
    try {
        const userId = req.user.id;
        const { avatarId } = req.body;
        
        if (!avatarId) {
            return res.status(400).json({
                status: 400,
                message: 'avatarId é obrigatório'
            });
        }

        const result = await usuarioService.selectAvatar(userId, avatarId);
        return res.status(200).json({
            data: result,
            message: 'Avatar selecionado com sucesso!'
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
    login,
    resetPassword,
    updateProfile,
    getUserStats,
    selectAvatar
};