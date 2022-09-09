/*
* SimpleKeys
* Database.js
* 29/jun/2022
*/

const Sequelize = require('sequelize');
const Settings = require('../model/Settings.js');
const Entradas = require('../model/Entradas.js');

const log = require('electron-log');

//outra função pra trocar a senha mestra?
function conectar(path, nomeArquivo, senhaMestra){
    try {
        const database = new Sequelize(nomeArquivo, null, senhaMestra, {
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

function criar(path, nomeArquivo, descArquivo, expiraArquivo, chaveReserva, senhaMestra){
    try {
        const database = new Sequelize(nomeArquivo, null, senhaMestra, {
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