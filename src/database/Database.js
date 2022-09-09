/*
* SimpleKeys
* Database.js
* 29/jun/2022
*/

const Sequelize = require('sequelize');
const log = require('electron-log');

//outra função pra trocar a senha mestra?
const conectar = (path, nomeArquivo, descArquivo, expiraArquivo, chaveReserva, senhaMestra) => {
    try {
        const Settings = require('../model/Settings.js');
        const Entradas = require('../model/Entradas.js');
        const database = new Sequelize(nomeArquivo, null, senhaMestra, {
            dialect: 'sqlite',
            dialectModule: require('@journeyapps/sqlcipher'),
            logging: (msg) => { log; log.info(msg); },
            storage: path
        });
    
        Settings.init(database, descArquivo, expiraArquivo, chaveReserva);
        Entradas.init(database);
        
        if (database.authenticate('PRAGMA key = "' + senhaMestra + '"') == true) {
            log.info("A conexao ao Banco de Dados foi estabelecida com sucesso!");
        } else {
            database.close();
            log.error("Erro ao conectar ao Banco de Dados!");
        }
        
        return database;
    } catch (error){
        log.error("Erro ao criar um Banco de Dados: " + error + "!");
        
        return false;
    }
}

module.exports = { conectar };