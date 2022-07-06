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
import cryptoJs from 'crypto-js';

import settings from '../config/settings.json';
import Entradas from '../models/Entradas.js';
import database from '../database/Database.js';

const { or } = Sequelize.Op;

async function novoArquivo(nomeArquivo: String, descArquivo: String, senhaMestra: String, configBanco: String){
    let path = Path.join(__dirname, nomeArquivo.toString()), writeSuccess = false;

    try {
        //falta a lógica de entrar no arquivo SQLite e criar o novo .db criptografado + paramsconfigbanco
        if (writeSuccess) {
            alert("O Banco " + nomeArquivo + " foi criado e salvo com sucesso no local " + path + " !");
            return true;
        } else {
            alert("Houve um problema no salvamento do Banco, tente novamente!");
            return false;
        }
    } catch (error){
        console.log(error);
        alert("Ocorreu um erro aqui, " + error + "! Talvez um arquivo com o mesmo nome já exista.");
        return false;
    }
}

async function lerArquivo(nomeArquivo: String, senhaMestra: String, configSoftware: String){
    //vai descriptografar, abrir o arquivo no próprio disco (cópia), alterar e salvar as alterações

    try {
        const resultado = await database.sync();
        console.log(resultado);
    } catch (error){
        console.log(error);
        alert("Ocorreu um erro aqui, " + error + "! Este arquivo não existe!");
        return false;
    }
}

async function cadastrarEntradas(nomeEntradas: String, descEntradas: String, loginEntradas: String, senhaEntradas: String, siteEntradas: String, expira: Boolean, expiraTempo: String, grupoImg: String, grupoLista: String){
    try {
        const resultado = await database.sync();
        console.log(resultado);
    
        const resultadoCreate = await Entradas.create({
            nome: nomeEntradas,
            descricao: descEntradas,
            usuario: loginEntradas,
            senha: senhaEntradas,
            site: siteEntradas,
            expira: expira,
            expiraTempo: expiraTempo,
            grupoImg: grupoImg,
            grupoLista: grupoLista 
        })

        console.log(resultadoCreate);
    } catch (error){
        console.log(error);
        alert("Ocorreu um erro aqui, " + error + "!");
        return false;
    }
}

async function lerEntradas(){
    try {
        const entradas = await Entradas.findAll();
        console.log(entradas);
    } catch (error){
        console.log(error);
        alert("Ocorreu um erro aqui, " + error + "!");
        return false;
    }
}

async function pesquisarEntradas(pesquisa: String){
    try {
        const entradas = await Entradas.findAll({
            where: {
                nome: pesquisa,
                [or]: [
                    {descricao: pesquisa},
                    {usuario: pesquisa},
                    {site: pesquisa},
                    {expira: pesquisa},
                    {grupoLista: pesquisa}
                ]
            }
        });

        console.log(entradas);
        return entradas;
    } catch (error){
        console.log(error);
        alert("Ocorreu um erro aqui, " + error + "!");
        return false;
    }
}

async function atualizarEntradas(selecaoAtual: Number, nomeEntradas: String, descEntradas: String, loginEntradas: String, senhaEntradas: String, siteEntradas: String, expira: Boolean, expiraTempo: String, grupoImg: String, grupoLista: String){
    try {
        const entradas = await Entradas.findByPk(selecaoAtual).then(() => {
            console.log(entradas);

            entradas.nome = nomeEntradas;
            entradas.descricao = descEntradas;
            entradas.usuario = loginEntradas;
            entradas.senha = senhaEntradas;
            entradas.site = siteEntradas;
            entradas.expira = expira;
            entradas.expiraTempo = expiraTempo;
            entradas.grupoImg = grupoImg;
            entradas.grupoLista = grupoLista;
            
            const resultadoUpdate = entradas.save();
            console.log(resultadoUpdate);
            return true;
        }).catch((error: string) => {
            console.log(error);
            alert("Ocorreu um erro aqui, " + error + "!");
            return false;
        });
    } catch (error){
        console.log(error);
        alert("Ocorreu um erro aqui, " + error + "!");
        return false;
    }
}

async function apagarEntradas(selecaoAtual: Number){
    Entradas.destroy({ where: { id: selecaoAtual }});
}

async function consultarBanco(nomeArquivo: string){
    let path = Path.join(__dirname, nomeArquivo);
    
    try {
        if (fse.existsSync(path)){
            return true;
        } else {
            alert("Este arquivo não existe!");
            return false;
        }
    } catch (error){
        alert("Ocorreu um erro aqui! Talvez este Banco de Dados ainda não exista.");
        return false;
    }
}

export default { novoArquivo, cadastrarEntradas, lerEntradas, pesquisarEntradas, atualizarEntradas, apagarEntradas, lerArquivo, consultarBanco };