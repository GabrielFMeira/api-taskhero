const { Sequelize, DataTypes, Model } = require('sequelize');
const seq = require('../db.js');

class Tarefa extends Model {
    static associate(models) {
        this.belongsTo(models.Usuario, {
            foreignKey: "usuario_id",
            as: "usuario"
        });
    }
}

Tarefa.init({
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    data_inicio: {
        type: DataTypes.DATE,
    },
    data_fim: {
        type: DataTypes.DATE,
    },
    status: {
        type: DataTypes.ENUM('pendente', 'em progresso', 'concluida')
    }
}, {
  sequelize: seq,
  modelName: 'Tarefa',
  schema: 'public',
  tableName: 'tarefas'
});

module.exports = Tarefa;