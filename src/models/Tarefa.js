import { DataTypes, Model } from 'sequelize';
import seq from '../db.js';
import StatusEnum from '../enums/StatusEnum.js';
import PrioridadeEnum from '../enums/PrioridadeEnum.js';

class Tarefa extends Model {
    static associate(models) {
        this.belongsTo(models.Meta, {
            foreignKey: "meta_id",
            as: "meta",
            onDelete: 'CASCADE'
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
    data_limite: {
        type: DataTypes.DATE,
    },
    status: {
        type: DataTypes.ENUM(...Object.values(StatusEnum))
    },
    prioridade: {
        type: DataTypes.ENUM(...Object.values(PrioridadeEnum)),
        allowNull: false
    },
    meta_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, 
{
  sequelize: seq,
  modelName: 'Tarefa',
  schema: 'public',
  tableName: 'tarefas'
});

export default Tarefa;