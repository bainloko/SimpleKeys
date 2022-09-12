/*
* SimpleKeys
* Entradas.js
* 22/jun/2022
*/

const { Model, DataTypes } = require('sequelize');

class Entradas extends Model {
    static init(sequelize){
        super.init({
            id: {
                type: DataTypes.NUMBER,
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
            login: {
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
                type: DataTypes.NUMBER,
                defaultValue: 0,
            },
            grupoImg: DataTypes.BLOB,
            grupoLista: DataTypes.TEXT
        }, { sequelize, freezeTableName: true });
    }
}

module.exports = Entradas;