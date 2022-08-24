/*
* SimpleKeys
* Entradas.js
* 22/jun/2022
*/

const database = require('../database/Database.js');

const Entrada = database.define('entrada', {
    id: {
        type: INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: TEXT,
        defaultValue: "Google",
        allowNull: false
    },
    descricao: {
        type: TEXT,
        defaultValue: "Exemplo",
    },
    usuario: {
        type: TEXT,
        defaultValue: "fulanodetal@gmail.com",
        allowNull: false
    },
    senha: {
        type: TEXT,
        defaultValue: "fulanodetal",
        allowNull: false,
    },
    site: { 
        type: TEXT,
        defaultValue: "https://google.com",
    },
    expira: {
        type: TEXT,
        defaultValue: "S;2025/08/08",
    },
    grupoImg: BLOB,
    grupoLista: TEXT,
}, {
    timestamps: true
});

export default Entrada;