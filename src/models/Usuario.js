import { DataTypes, Model } from 'sequelize';
import seq from '../db.js';

class Usuario extends Model {
    static associate(models) {
    this.hasMany(models.Meta, {
      foreignKey: "usuario_id",
      as: "metas",
      onDelete: 'CASCADE'
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
  }
}, {
  sequelize: seq,
  modelName: 'Usuario',
  schema: 'public',
  tableName: 'usuarios'
});

export default Usuario;
