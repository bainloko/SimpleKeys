/*
* SimpleKeys
* Entradas.js
* 22/jun/2022
*/

const { DataTypes } = require('sequelize');

const settings = database.define('settings', {
    descricao: DataTypes.TEXT,
    expira: DataTypes.TEXT,
    chaveReserva: DataTypes.BOOLEAN
}, {
    timestamps: true,
    freezeTableName: true
});

const Entradas = database.define('Entradas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nome: {
        type: DataTypes.TEXT,
        defaultValue: "Google",
        allowNull: false
    },
    descricao: {
        type: DataTypes.TEXT,
        defaultValue: "Exemplo",
    },
    site: { 
        type: DataTypes.TEXT,
        defaultValue: "https://google.com",
    },
    usuario: {
        type: DataTypes.TEXT,
        defaultValue: "fulanodetal@gmail.com",
        allowNull: false
    },
    senha: {
        type: DataTypes.TEXT,
        defaultValue: "fulanodetal",
        allowNull: false,
    },
    expira: {
        type: DataTypes.TEXT,
        defaultValue: "S;2025/08/08",
    },
    grupoImg: DataTypes.BLOB,
    grupoLista: DataTypes.TEXT,
}, {
    timestamps: true,
    freezeTableName: true
});

export { settings, Entradas };