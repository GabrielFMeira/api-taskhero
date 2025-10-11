import { DataTypes, Model } from 'sequelize';
import seq from '../db.js';
import StatusEnum from '../enums/StatusEnum.js';

class Meta extends Model {
    static associate(models) {
        this.belongsTo(models.Usuario, {
            foreignKey: "usuario_id",
            as: "usuario",
            onDelete: 'CASCADE'
        });
        this.hasMany(models.Tarefa, {
            foreignKey: "meta_id",
            as: "tarefas",
            onDelete: 'CASCADE'
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
    },
    notificado_expiracao: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize: seq,
    modelName: 'Meta',
    schema: 'public',
    tableName: 'metas'
});

export default Meta;