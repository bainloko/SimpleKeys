/*
* SimpleKeys
* Database.js
* 29/jun/2022
*/

const Sequelize = require('sequelize');
const config = require('../config/database.json');
const { Entradas } = require('../model/Entradas.js');

const log = require('electron-log');

let database;

//outra função pra trocar a senha mestra?
async function conectar(path, nomeArquivo, senhaMestra){
    try {
        config.production.storage = path;
        let database = new Sequelize(nomeArquivo, null, senhaMestra, config);

        await database.authenticate('PRAGMA key = "' + senhaMestra + '"');
        Entradas.init(database);
        
        await Entradas.findAll();
        log.info("A conexao ao Banco de Dados foi estabelecida com sucesso!");

        return database;
    } catch (error){
        log.error("Erro ao conectar ao Banco de Dados: " + error + "!");
        database.close();
        
        return false;
    }
}

async function criar(path, nomeArquivo, descArquivo, expiraArquivo, chaveReserva, senhaMestra){
    try {
        config.production.storage = path;
        let database = new Sequelize(nomeArquivo, null, senhaMestra, config);

        await database.authenticate('PRAGMA key = "' + senhaMestra + '"');
        Entradas.init(database);

        await Entradas.bulkInsert('settings', { 
            descricao: descArquivo, 
            expira: expiraArquivo, 
            chaveReserva: chaveReserva 
        }).then(() => {
            log.info("A conexao ao Banco de Dados foi estabelecida com sucesso!");
            return database;
        });
    } catch (error){
        log.error("Erro ao criar um Banco de Dados: " + error + "!");
        database.close();

        return false;
    }
}

module.exports = { conectar, criar };