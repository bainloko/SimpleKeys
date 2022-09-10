/*
* SimpleKeys
* Database.js
* 29/jun/2022
*/

const Sequelize = require('sequelize');
const log = require('electron-log');

//outra função pra trocar a senha mestra?
const conectar = (path, nomeArquivo, descArquivo, expiraArquivo, chaveReserva, senha) => {
    try {
        const Settings = require('../model/Settings.js');
        const Entradas = require('../model/Entradas.js');
        const database = new Sequelize(nomeArquivo, null, senha, {
            dialect: 'sqlite',
            dialectModule: require('@journeyapps/sqlcipher'),
            logging: (msg) => { log; log.info(msg); },
            storage: path
        });

        Settings.init(database, descArquivo, expiraArquivo, chaveReserva);
        Entradas.init(database);
        database.sync();
        database.authenticate('PRAGMA key = "' + senha + '"').then(() => {
            log.info("A conexao ao Banco de Dados foi estabelecida com sucesso!");
        
            return database;
        }).catch((error) => {
            database.close();
            log.error("Erro ao conectar ao Banco de Dados: " + error + "!");
        
            return null;
        });
    } catch (error){
        log.error("Erro ao criar um Banco de Dados: " + error + "!");

        return null;
    }
}

module.exports = { conectar };