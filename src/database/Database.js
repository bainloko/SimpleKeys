/*
* SimpleKeys
* Database.js
* 29/jun/2022
*/

import Sequelize from 'sequelize';
import config from '../config/database.json';
import Entradas from '../models/Entradas.js';

const database = new Sequelize(config);

export async function conectar(){
    try {
        if (Entradas.init(database)){
            console.log("A conexão ao Banco de Dados foi estabelecida com sucesso!");
            return 0;
        } else {
            console.log("Erro ao conectar ao Banco de Dados: " + error + "!");
            database.close(config);
            return 1;
        }
    } catch (error){
        console.log("Erro ao conectar ao Banco de Dados: " + error + "!");
        database.close(config);
        return 1;
    }
}

export default database;