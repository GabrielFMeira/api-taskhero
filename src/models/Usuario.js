const { Sequelize, DataTypes, Model } = require('sequelize');
const seq = require('../db.js');

class Usuario extends Model {
    static associate(models) {
    this.hasMany(models.Tarefa, {
      foreignKey: "usuario_id",
      as: "tarefas"
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

module.exports = Usuario;
