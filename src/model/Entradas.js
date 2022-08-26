/*
* SimpleKeys
* Entradas.js
* 22/jun/2022
*/

const Sequelize = require('sequelize');
const database = require('../database/Database.js');

const Entrada = database.define('entrada', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.TEXT,
        defaultValue: "Google",
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        defaultValue: "Exemplo",
    },
    usuario: {
        type: Sequelize.TEXT,
        defaultValue: "fulanodetal@gmail.com",
        allowNull: false
    },
    senha: {
        type: Sequelize.TEXT,
        defaultValue: "fulanodetal",
        allowNull: false,
    },
    site: { 
        type: Sequelize.TEXT,
        defaultValue: "https://google.com",
    },
    expira: {
        type: Sequelize.TEXT,
        defaultValue: "S;2025/08/08",
    },
    grupoImg: Sequelize.BLOB,
    grupoLista: Sequelize.TEXT,
}, {
    timestamps: true
});

export default Entrada;