/*
* SimpleKeys
* Entradas.js
* 22/jun/2022
*/

const Sequelize = require('sequelize');
const database = require('../database/Database.js');

const settings = database.define('settings', {
    descricao: Sequelize.TEXT,
    expira: Sequelize.TEXT,
    chaveReserva: Sequelize.BOOLEAN
}, {
    timestamps: true
});

const Entradas = database.define('Entradas', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
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
    site: { 
        type: Sequelize.TEXT,
        defaultValue: "https://google.com",
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
    expira: {
        type: Sequelize.TEXT,
        defaultValue: "S;2025/08/08",
    },
    grupoImg: Sequelize.BLOB,
    grupoLista: Sequelize.TEXT,
}, {
    timestamps: true
});

export { settings, Entradas };