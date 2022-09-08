/*
* SimpleKeys
* Database.js
* 29/jun/2022
*/

const Sequelize = require('sequelize');
const Entradas = require('../model/Entradas.js');
const config = require('../config/database.json');

const Arquivo = require('../App/tools/Arquivo.js');

const log = require('electron-log');

let database;

//outra função pra trocar a senha mestra?
async function conectar(path, nomeArquivo, senhaMestra){
    try {
        config.production.storage = path;
        let database = new Sequelize(nomeArquivo, null, senhaMestra, config);
        database.query('PRAGMA key = "' + senhaMestra + '"');

        await database.authenticate();
        Entradas.init(database);
        
        Entradas.findAll();
        log.info("A conexao ao Banco de Dados foi estabelecida com sucesso!");

        return true;
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
        database.query('PRAGMA key = "' + senhaMestra + '"');

        await database.authenticate();
        Entradas.init(database);

        database.bulkInsert('settings', { 
            descricao: descArquivo, 
            expira: expiraArquivo, 
            chaveReserva: chaveReserva 
        }).then(() => {
            log.info("A conexao ao Banco de Dados foi estabelecida com sucesso!");
        });
    } catch (error){
        log.error("Erro ao criar um Banco de Dados: " + error + "!");
        database.close();

        return false;
    }
}

module.exports = { conectar, criar };