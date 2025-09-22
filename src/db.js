const Sequelize = require('sequelize');

//TODO: colocar a senha em um .env
const seq = new Sequelize('taskhero', 'postgres', '12345', {
    host: 'localhost',
    dialect: 'postgres'
});

module.exports = seq;