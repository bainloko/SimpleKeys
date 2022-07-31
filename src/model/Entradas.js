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
        type: Sequelize.TEXT,
        allowNull: false
    },
    descricao: Sequelize.TEXT,
    usuario: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    senha: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    site: Sequelize.TEXT,
    expira: Sequelize.TEXT,
    grupoImg: Sequelize.BLOB,
    grupoLista: Sequelize.TEXT
});

export default Entrada;