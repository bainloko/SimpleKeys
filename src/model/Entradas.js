/*
* SimpleKeys
* Entradas.js
* 22/jun/2022
*/

const { Model, DataTypes } = require('sequelize');

class Settings extends Model {
    static init(database){
        super.init({
            descricao: DataTypes.TEXT,
            expira: DataTypes.TEXT,
            chaveReserva: DataTypes.BOOLEAN,
        }, { database, freezeTableName: true });
    }
}

class Entradas extends Model {
    static init(database){
        super.init({
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
        }, { database, freezeTableName: true });
    }
}

module.exports = { Settings, Entradas };