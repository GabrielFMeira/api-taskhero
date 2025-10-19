import { DataTypes, Model } from 'sequelize';
import seq from '../db.js';

class Usuario extends Model {
  static associate(models) {
    this.hasMany(models.Meta, {
      foreignKey: "usuario_id",
      as: "metas",
      onDelete: 'CASCADE'
    });
    this.belongsToMany(models.Recompensa, {
      through: 'usuario_recompensa',
      foreignKey: 'usuario_id',
      otherKey: 'recompensa_id',
      as: 'recompensas'
    });
  }
}

Usuario.init({
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  senha: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  xp_points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lula_coins: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize: seq,
  modelName: 'Usuario',
  schema: 'public',
  tableName: 'usuarios'
});

export default Usuario;
