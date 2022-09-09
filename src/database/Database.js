/*
* SimpleKeys
* Database.js
* 29/jun/2022
*/

const Sequelize = require('sequelize');
const Entradas = require('../model/Entradas.js');
const Settings = require('../model/Settings.js');

const log = require('electron-log');

//outra função pra trocar a senha mestra?
async function conectar(path, nomeArquivo, senhaMestra){
    try {
        let database = new Sequelize(nomeArquivo, null, senhaMestra, {
            dialect: 'sqlite',
            dialectModule: require('@journeyapps/sqlcipher'),
            logging: (msg) => { const log = require('electron-log'); log.info(msg); },
            storage: path
        });
    
        database.authenticate('PRAGMA key = "' + senhaMestra + '"');
        Settings.init(database);
        Entradas.init(database);
        log.info("A conexao ao Banco de Dados foi estabelecida com sucesso!");

        return database;
    } catch (error){
        log.error("Erro ao conectar ao Banco de Dados: " + error + "!");
        
        return false;
    }
}

async function criar(path, nomeArquivo, descArquivo, expiraArquivo, chaveReserva, senhaMestra){
    try {
        let database = new Sequelize(nomeArquivo, null, senhaMestra, {
            dialect: 'sqlite',
            dialectModule: require('@journeyapps/sqlcipher'),
            logging: (msg) => { const log = require('electron-log'); log.info(msg); },
            storage: path
        });

        database.authenticate('PRAGMA key = "' + senhaMestra + '"');
        Settings.init(database, descArquivo, expiraArquivo, chaveReserva);
        Entradas.init(database);
        log.info("A conexao ao Banco de Dados foi estabelecida com sucesso!");
        
        return database;
    } catch (error){
        log.error("Erro ao criar um Banco de Dados: " + error + "!");

        return false;
    }
}

module.exports = { conectar, criar };