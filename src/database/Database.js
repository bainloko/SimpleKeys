/*
* SimpleKeys
* Database.js
* 29/jun/2022
*/

const Sequelize = require('sequelize');

const Entradas = require('../model/Entradas.js');

const dbConfig = require('./database.json');

const log = require('electron-log');

//outra função pra trocar a senha mestra? outra função pra criar um arquivo com os dados pré-estabelecidos?
async function conectar(nomeArquivo, senhaMestra){
    let database = new Sequelize(process.env.SQLITE_FILENAME || nomeArquivo, null, senhaMestra, dbConfig);
    database.query("PRAGMA key = quote(" + senhaMestra + ")");
    
    try {
        Entradas.init(database);

        if (database.authenticate()){
            log.info("A conexão ao Banco de Dados foi estabelecida com sucesso!");

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

// async function criar(nomeArquivo, descArquivo, expira, chaveReserva, senhaMestra){
//     let database = new Sequelize(process.env.SQLITE_FILENAME || nomeArquivo, null, senhaMestra, dbConfig);
//     database.query("PRAGMA key = quote(" + senhaMestra + ")");
//     database.bulkInsert("entradas", {
//         nome: nome,

//     });
// } , criar

export default { conectar };