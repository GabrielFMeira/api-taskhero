import Sequelize from 'sequelize';

//TODO: colocar a senha em um .env
const seq = new Sequelize('taskhero', 'postgres', '12345', {
    host: 'localhost',
    dialect: 'postgres'
});

export default seq;