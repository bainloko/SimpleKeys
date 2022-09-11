/*
* SimpleKeys
* Database.js
* 29/jun/2022
*/

const Sequelize = require('sequelize');
const Arquivo = require('../App/tools/Arquivo.js');

const log = require('electron-log');

//outra função pra trocar a senha mestra?
const conectar = (conn, path, nomeArquivo, descArquivo, expiraArquivo, chaveReserva, senha) => {
    try {
        const Settings = require('../model/Settings.js');
        const Entradas = require('../model/Entradas.js');

        if (conn == true) {
            const database = new Sequelize(nomeArquivo, null, senha, {
                dialect: 'sqlite',
                dialectModule: require('@journeyapps/sqlcipher'),
                logging: (msg) => { log; log.info(msg); },
                storage: path
            });
    
            database.authenticate().then(() => {
                Settings.init(database, descArquivo, expiraArquivo, chaveReserva);
                Entradas.init(database);
                database.sync().then(() => {
                    Arquivo.lerEntradas();
                    log.info("A conexao ao Banco de Dados foi estabelecida com sucesso!");
                    
                    module.exports = database;
                    return database;
                }).catch((error) => {
                    database.close();
    
                    log.error("Erro ao conectar ao Banco de Dados! Sera que a senha esta incorreta? " + error);
                    alert("Erro ao conectar ao Banco de Dados! Sera que a senha esta incorreta? " + error);
    
                    return null;
                });
            }).catch((error) => {
                database.close();
    
                log.error("Erro ao conectar ao Banco de Dados! Sera que a senha esta incorreta? " + error);
                alert("Erro ao conectar ao Banco de Dados! Sera que a senha esta incorreta? " + error);
    
                return null;
            });
        } else {
            const database = new Sequelize(nomeArquivo, null, null, {
                dialect: 'sqlite',
                dialectModule: require('@journeyapps/sqlcipher'),
                logging: (msg) => { log; log.info(msg); },
                storage: path
            });

            database.authenticate().catch((error) => {
                database.close();
    
                log.error("Banco de Dados trancado com sucesso! " + error);
                alert("Banco de Dados trancado com sucesso! " + error);
    
                module.exports = database;
                return null;
            });
        }
    } catch (error){
        log.error("Erro ao criar um Banco de Dados: " + error + "!");
        alert("Erro ao criar um Banco de Dados: " + error + "!");

        return null;
    }
}

module.exports = { conectar };