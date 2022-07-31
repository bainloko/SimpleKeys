/*
* SimpleKeys
* Database.js
* 29/jun/2022
*/

import Sequelize from 'sequelize';
import dbConfig from '../config/database.json';
import Entradas from '../model/Entradas.js';
import log from 'electron-log';

const database = new Sequelize(dbConfig);

export async function conectar(){
    try {
        if (Entradas.init(database)){
            log.info("A conexão ao Banco de Dados foi estabelecida com sucesso!");
            return 0;
        } else {
            log.error("Erro ao conectar ao Banco de Dados: " + error + "!");
            database.close(dbConfig);
            return 1;
        }
    } catch (error){
        log.error("Erro ao conectar ao Banco de Dados: " + error + "!");
        database.close(dbConfig);
        return 1;
    }
}

export default database;