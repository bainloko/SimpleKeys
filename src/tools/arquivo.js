/*
* SimpleKeys
* arquivo.js
* 22/jun/2022
*/

import fse from 'fs-extra';
import Path from 'path';
import Sequelize from 'sequelize';
import sqlite from 'better-sqlite3-multiple-ciphers';
import cryptoJs from 'crypto-js';

import editJson from 'electron-json-storage';
import settings from 'electron-settings';
import log from 'electron-log';

import Entradas from '../model/Entradas.js';
import database from '../database/Database.js';

import config from '../config/settings.json';

const { or } = Sequelize.Op;

async function novoArquivo(nomeArquivo, descArquivo, senhaMestra, configBanco){
    let path = Path.join(__dirname, nomeArquivo.toString()), writeSuccess = false;

    try {
        //falta a lógica de entrar no arquivo SQLite e criar o novo .db criptografado + paramsconfigbanco
        if (writeSuccess) {
            log.info("O Banco " + nomeArquivo + " foi criado e salvo com sucesso no local " + path + " !");
            alert("O Banco " + nomeArquivo + " foi criado e salvo com sucesso no local " + path + " !");
            return true;
        } else {
            log.error("Houve um problema no salvamento do Banco, tente novamente!");
            alert("Houve um problema no salvamento do Banco, tente novamente!");
            return false;
        }
    } catch (error){
        log.error("Ocorreu um erro aqui, " + error + "! Talvez um arquivo com o mesmo nome já exista.");
        alert("Ocorreu um erro aqui, " + error + "! Talvez um arquivo com o mesmo nome já exista.");
        return false;
    }
}

async function lerArquivo(nomeArquivo, senhaMestra, configBanco){
    //vai descriptografar, abrir o arquivo no próprio disco (cópia), alterar e salvar as alterações

    try {
        const resultado = await database.sync();
        log.info(resultado);
    } catch (error){
        log.error("Ocorreu um erro aqui, " + error + "! Este arquivo não existe!");
        alert("Ocorreu um erro aqui, " + error + "! Este arquivo não existe!");
        return false;
    }
}

async function cadastrarEntradas(nomeEntradas, descEntradas, loginEntradas, senhaEntradas, siteEntradas, expira, grupoImg, grupoLista){
    try {
        const resultado = await database.sync();
        log.info(resultado);
    
        const resultadoCreate = await Entradas.create({
            nome: nomeEntradas,
            descricao: descEntradas,
            usuario: loginEntradas,
            senha: senhaEntradas,
            site: siteEntradas,
            expira: expira,
            grupoImg: grupoImg,
            grupoLista: grupoLista 
        })

        log.info(resultadoCreate);
    } catch (error){
        log.error("Ocorreu um erro aqui, " + error + "!");
        alert("Ocorreu um erro aqui, " + error + "!");
        return false;
    }
}

async function lerEntradas(){
    try {
        const entradas = await Entradas.findAll();
        log.info(entradas);
    } catch (error){
        log.info("Ocorreu um erro aqui, " + error + "!");
        alert("Ocorreu um erro aqui, " + error + "!");
        return false;
    }
}

async function pesquisarEntradas(pesquisa){
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

        log.info(entradas);
        return entradas;
    } catch (error){
        log.error("Ocorreu um erro aqui, " + error + "!");
        alert("Ocorreu um erro aqui, " + error + "!");
        return false;
    }
}

async function atualizarEntradas(selecaoAtual, nomeEntradas, descEntradas, loginEntradas, senhaEntradas, siteEntradas, expira, grupoImg, grupoLista){
    try {
        const entradas = await Entradas.findByPk(selecaoAtual).then(() => {
            log.info(entradas);

            entradas.nome = nomeEntradas;
            entradas.descricao = descEntradas;
            entradas.usuario = loginEntradas;
            entradas.senha = senhaEntradas;
            entradas.site = siteEntradas;
            entradas.expira = expira;
            entradas.grupoImg = grupoImg;
            entradas.grupoLista = grupoLista;
            
            const resultadoUpdate = entradas.save();
            log.info(resultadoUpdate);
            return true;
        }).catch((error) => {
            log.error("Ocorreu um erro aqui, " + error + "!");
            alert("Ocorreu um erro aqui, " + error + "!");
            return false;
        });
    } catch (error){
        log.error("Ocorreu um erro aqui, " + error + "!");
        alert("Ocorreu um erro aqui, " + error + "!");
        return false;
    }
}

async function apagarEntradas(selecaoAtual){
    try {
        Entradas.destroy({ where: { id: selecaoAtual }});
    } catch (error){
        log.error("Ocorreu um erro aqui, " + error + "!\nTalvez esta entrada não exista, ou já tenha sido apagada.");
        alert("Ocorreu um erro aqui, " + error + "!\nTalvez esta entrada não exista, ou já tenha sido apagada."); 
    }
}

async function consultarBanco(nomeArquivo){
    let path = Path.join(__dirname, nomeArquivo);
    
    try {
        if (fse.existsSync(path)){
            return true;
        } else {
            log.error("Este arquivo não existe!");
            alert("Este arquivo não existe!");
            return false;
        }
    } catch (error){
        log.error("Ocorreu um erro aqui! Talvez este Banco de Dados ainda não exista.");
        alert("Ocorreu um erro aqui! Talvez este Banco de Dados ainda não exista.");
        return false;
    }
}

export default { novoArquivo, cadastrarEntradas, lerEntradas, pesquisarEntradas, atualizarEntradas, apagarEntradas, lerArquivo, consultarBanco };