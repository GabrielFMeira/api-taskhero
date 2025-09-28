class CreateTaskDTO {
    constructor({titulo, descricao, data_limite,prioridade}) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.data_limite = data_limite;
        this.prioridade = prioridade;
    }
}
export default CreateTaskDTO; 
