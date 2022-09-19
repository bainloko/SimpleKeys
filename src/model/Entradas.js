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
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            nome: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            descricao: {
                type: DataTypes.TEXT,
            },
            site: { 
                type: DataTypes.TEXT,
            },
            login: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            senha: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            expira: {
                type: DataTypes.INTEGER,
            },
            // grupoImg: DataTypes.BLOB,
            // grupoLista: DataTypes.TEXT
        }, { sequelize, freezeTableName: true });
    }
}

module.exports = Entradas;