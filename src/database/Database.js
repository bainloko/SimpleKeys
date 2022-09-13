/*
* SimpleKeys
* Database.js
* 29/jun/2022
*/

const { dialog } = require('electron');

const Sequelize = require('sequelize');

const log = require('electron-log');

function conectar(path, nomeArquivo, descArquivo, expiraArquivo, chaveReserva, senha){
    try {
        const Settings = require('../model/Settings.js');
        const Entradas = require('../model/Entradas.js');

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
                log.info("Inicializacao do Banco de Dados feita com sucesso!");

                module.exports = database;
                return database;
            }).catch((error) => {
                database.close();

                log.error("Erro ao salvar ao Banco de Dados! Sera que a senha esta incorreta? " + error);
                dialog.showErrorBox("Erro!", "Erro ao salvar Entradas no Chaveiro! Sera que a senha esta incorreta? " + error);

                return null;
            });
        }).catch((error) => {
            database.close();

            log.error("Erro ao conectar ao Banco de Dados! Sera que a senha esta incorreta? " + error);
            dialog.showErrorBox("Erro!", "Erro ao abrir o Chaveiro! Sera que a senha esta incorreta? " + error);

            return null;
        });
    } catch (error){
        log.error("Erro ao criar um Banco de Dados: " + error + "!");
        dialog.showErrorBox("Erro!", "Erro ao criar um Chaveiro: " + error + "!");

        return null;
    }
}

module.exports = { conectar };