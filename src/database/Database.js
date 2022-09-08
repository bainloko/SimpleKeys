/*
* SimpleKeys
* Database.js
* 29/jun/2022
*/

const Sequelize = require('sequelize');
const { Entradas } = require('../model/Entradas.js');

const log = require('electron-log');

let database;

//outra função pra trocar a senha mestra?
async function conectar(path, nomeArquivo, senhaMestra){
    try {
        let database = new Sequelize(nomeArquivo, null, senhaMestra, {
            dialect: 'sqlite',
            dialectModule: require('@journeyapps/sqlcipher'),
            logging: msg => log.info(msg),
            storage: path,
            define: { timestamps: true }
        });

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
        let database = new Sequelize(nomeArquivo, null, senhaMestra, {
            dialect: 'sqlite',
            dialectModule: require('@journeyapps/sqlcipher'),
            logging: msg => log.info(msg),
            storage: path,
            define: { timestamps: true }
        });

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