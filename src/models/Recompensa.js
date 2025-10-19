import { DataTypes, Model } from 'sequelize';
import seq from '../db.js';
import TipoRecompensaEnum from '../enums/TipoRecompensaEnum.js';

class Recompensa extends Model {
    static associate(models) {
        this.belongsToMany(models.Usuario, {
            through: 'usuario_recompensa',
            foreignKey: 'recompensa_id',
            otherKey: 'usuario_id',
            as: 'usuarios'
        });
    }
}

Recompensa.init({
    caminho: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo: {
        type: DataTypes.ENUM(...Object.values(TipoRecompensaEnum))
    },
    minimum_level: {
        type: DataTypes.INTEGER
    }
}, {
  sequelize: seq,
  modelName: 'Recompensa',
  schema: 'public',
  tableName: 'recompensas'
});

export default Recompensa;