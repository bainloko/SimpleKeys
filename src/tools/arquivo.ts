/*
* SimpleKeys
* arquivo.ts
* 22/jun/2022
*/

import fse from 'fs-extra';
import Path from 'path';
import Sequelize from 'sequelize';
import sqlite from 'sqlite';
import sqliteNext from 'sqlite3-offline-next';
import bcrypt from 'bcryptjs';

// import settings from './settings.json'; criar um arquivo na pasta documentos? environment variables!

async function novoArquivo(nomeArquivo: string, descArquivo: String, senhaMestra: String, configSoftware: string){
    let path = Path.join(__dirname, nomeArquivo), writeSuccess = false;

    try {
        //falta a lógica de entrar no arquivo SQLite e processar a criação do novo .db criptografado
        if (writeSuccess) {
            alert("O Banco " + nomeArquivo + " foi criado e salvo com sucesso no local " + path + " !");
            return true;
        } else {
            alert("Houve um problema no salvamento do Banco, tente novamente!");
            return false;
        }
    } catch (error){
        return alert("Ocorreu um erro aqui! Talvez um arquivo com o mesmo nome já exista.");
    }
}

async function lerArquivo(nomeArquivo: string, senhaMestra: String, configSoftware: string){
    //ele vai descriptografar e ler a cada vez? ou vai copiar o arquivo já descriptografado? ou vai desbloqueá-lo com a senha e deixar o terminal disponível para o PROGRAMA mexer? liberando assim a conexão e à leitura/gravação no banco
}

async function cadastrarEntradas(nomeEntradas: String, descEntradas: String, loginEntradas: String, senhaEntradas: String, gruposEntradas: string){
    //
}

async function lerEntradas(){
    //
}

async function pesquisarEntradas(pesquisa: String){
    //
}

async function atualizarEntradas(selecaoAtual: Number, nomeEntradas: String, descEntradas: String, loginEntradas: String, senhaEntradas: String, gruposEntradas: string){
    //
}

async function apagarEntradas(selecaoAtual: Number){
    //
}

async function consultarBanco(nomeArquivo: string){
    let path = Path.join(__dirname, nomeArquivo);
    
    try {
        if (fse.existsSync(path)){
            return true;
        } else {
            return false;
        }
    } catch (error){
        return alert("Ocorreu um erro aqui! Talvez este Banco de Dados ainda não exista.");
    }
}

export default { novoArquivo, cadastrarEntradas, lerEntradas, pesquisarEntradas, atualizarEntradas, apagarEntradas, lerArquivo, consultarBanco };