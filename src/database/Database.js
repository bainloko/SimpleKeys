/*
* SimpleKeys
* Database.js
* 29/jun/2022
*/

const Sequelize = require('sequelize');

const Entradas = require('../model/Entradas.js');
const dbConfig = require('./database.json');

const Store = require('electron-store');
const store = new Store();

const log = require('electron-log');

async function criar(nomeArquivo, descArquivo, expira, chaveReserva, senhaMestra){
    try {
        const arqNome = "nome" + nomeArquivo;
        const arqDesc = "desc" + nomeArquivo;
        const arqExpira = "expira?" + nomeArquivo;
        const arqChaveReserva = "chaveReserva?" + nomeArquivo;
        
        store.set(arqNome, nomeArquivo);
        store.set(arqDesc, descArquivo);
        store.set(arqExpira, expira);
        store.set(arqChaveReserva, chaveReserva);

        conectar(nomeArquivo, senhaMestra);
    } catch (error){
        log.error("Erro ao criar um Banco de Dados: " + error + "!");
        database.close();

        return false;
    }
}

//outra função pra trocar a senha mestra?
async function conectar(nomeArquivo, senhaMestra){
    try {
        let database = new Sequelize(dbConfig, process.env.SQLITE_FILENAME || nomeArquivo);
        database.query("PRAGMA key = quote(" + senhaMestra + ")");

        if (database.authenticate()){
            Entradas.init(database);
            log.info("A conexão ao Banco de Dados foi estabelecida com sucesso!");

            return true;
        } else {
            log.error("Erro ao conectar ao Banco de Dados: " + error + "!");
            database.close();
            
            return false;
        }
    } catch (error){
        log.error("Erro ao conectar ao Banco de Dados: " + error + "!");
        database.close();
        
        return false;
    }
}

export { criar, conectar };