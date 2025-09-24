class AuthenticatedUserDTO {
    constructor({token, nome, email, level}) {
        this.token = token;
        this.nome = nome;
        this.email = email;
        this.level = level;
    }
}

export default AuthenticatedUserDTO;