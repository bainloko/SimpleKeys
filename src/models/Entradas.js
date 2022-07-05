/*
* SimpleKeys
* Entradas.js
* 22/jun/2022
*/

import Sequelize from 'sequelize';
import database from '../database/Database.js';

const Entrada = database.define('entrada', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: Sequelize.STRING,
    usuario: {
        type: Sequelize.STRING,
        allowNull: false
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    site: Sequelize.STRING,
    expira: Sequelize.ARRAY,
    grupo: Sequelize.ARRAY
});

export default Entrada;