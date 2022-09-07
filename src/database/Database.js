/*
* SimpleKeys
* Database.js
* 29/jun/2022
*/

const Sequelize = require('sequelize');
const Entradas = require('../model/Entradas.js');
const config = require('../config/database.json');

const log = require('electron-log');

//outra função pra trocar a senha mestra?
async function conectar(path, nomeArquivo, senhaMestra){
    try {
        config.production.storage = path;
        let database = new Sequelize(nomeArquivo, null, senhaMestra, config);
        database.query('PRAGMA key = "' + senhaMestra + '"');

        await database.authenticate();
        Entradas.init(database);
        log.info("A conexão ao Banco de Dados foi estabelecida com sucesso!");

        return true;
    } catch (error){
        log.error("Erro ao conectar ao Banco de Dados: " + error + "!");
        database.close();
        
        return false;
    }
}

async function criar(path, nomeArquivo, descArquivo, expira, chaveReserva, senhaMestra){
    try {
        
    } catch (error){
        log.error("Erro ao criar um Banco de Dados: " + error + "!");
        database.close();

        return false;
    }
}

export { conectar, criar };