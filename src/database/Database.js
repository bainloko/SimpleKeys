/*
* SimpleKeys
* Database.js
* 29/jun/2022
*/

const Sequelize = require('sequelize');

const editJson = require('electron-json-storage');
const log = require('electron-log');

const Entradas = require('../model/Entradas.js');

const dbConfig = require('../config/database.json');

async function database(nomeArquivo){
    try {
        let database = new Sequelize(nomeArquivo, null, senhaMestra, dbConfig);
        //JSON
    } catch (error){

    }
}

async function conectar(senhaMestra){
    let database = new Sequelize(process.env.SQLITE_FILENAME, null, senhaMestra, dbConfig);
    
    try {
        if (Entradas.init(database)){
            await database.authenticate("key='" + senhaMestra + "'").then(() => {
                log.info("A conexão ao Banco de Dados foi estabelecida com sucesso!");
            });

            return true;
        } else {
            log.error("Erro ao conectar ao Banco de Dados: " + error + "!");
            database.close(dbConfig);
            
            return false;
        }
    } catch (error){
        log.error("Erro ao conectar ao Banco de Dados: " + error + "!");
        database.close(dbConfig);
        
        return false;
    }
}

export default { database, conectar };