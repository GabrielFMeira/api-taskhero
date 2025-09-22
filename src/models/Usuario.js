const { Sequelize, DataTypes, Model } = require('sequelize');
const seq = require('../db.js');

class Usuario extends Model {}

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
  data_criacao: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
}, {
  sequelize: seq,
  modelName: 'usuario',
  schema: 'public',
  tableName: 'usuarios'
});

module.exports = Usuario;
