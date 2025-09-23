const { DataTypes, Model } = require('sequelize');
const seq = require('../db.js');
const StatusEnum = require('../enums/StatusEnum.js');

class Meta extends Model {
    static associate(models) {
        this.belongsTo(models.Usuario, {
            foreignKey: "usuario_id",
            as: "usuario"
        });
        this.hasMany(models.Tarefa, {
            foreignKey: "meta_id",
            as: "tarefas"
        });
    }
}

Meta.init({
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
        type: DataTypes.ENUM(...Object.values(StatusEnum))
    }
}, {
    sequelize: seq,
    modelName: 'Meta',
    schema: 'public',
    tableName: 'metas'
});

module.exports = Meta;