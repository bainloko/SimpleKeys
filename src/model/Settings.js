/*
* SimpleKeys
* Entradas.js
* 22/jun/2022
*/

const { Model, DataTypes } = require('sequelize');

class Settings extends Model {
    static init(sequelize, descricao, expira, chaveReserva){
        super.init({
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            descricao: {
                type: DataTypes.TEXT,
                defaultValue: descricao,
            },
            expira: {
                type: DataTypes.TEXT,
                defaultValue: expira,
            },
            chaveReserva: {
                type: DataTypes.BOOLEAN,
                defaultValue: chaveReserva
            }
        }, { sequelize, freezeTableName: true });
    }
}

module.exports = Settings;