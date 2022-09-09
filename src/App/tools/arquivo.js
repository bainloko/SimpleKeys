/*
* SimpleKeys
* arquivo.js
* 22/jun/2022
*/

const fse = require('fs-extra');
const Path = require('path');

const Sequelize = require('sequelize');
const { conectar } = require('../../database/Database.js');
const Entradas = require('../../model/Entradas.js');

const log = require('electron-log');

const { or } = Sequelize.Op;

let database;

async function lerArquivo(nomeArquivo, senhaMestra){
    let path = Path.join(__dirname, nomeArquivo.toString());

    try {
        database = conectar(path, nomeArquivo, senhaMestra);
        lerEntradas();

        log.info("O Banco " + nomeArquivo + " foi acessado com sucesso!");

        return database;
    } catch (error){
        log.error("Ocorreu um erro aqui, " + error + "! Talvez um arquivo com o mesmo nome ja exista.");
        alert("Ocorreu um erro aqui, " + error + "! Talvez um arquivo com o mesmo nome já exista.");

        return false;
    }
}

async function cadastrarEntradas(nomeEntradas, descEntradas, siteEntradas, loginEntradas, senhaEntradas, expira, grupoImg, grupoLista){
    try {
        const resultado = await database.sync({ force: true });
        log.info(resultado);
    
        const resultadoCreate = await Entradas.create({
            nome: nomeEntradas,
            descricao: descEntradas,
            site: siteEntradas,
            usuario: loginEntradas,
            senha: senhaEntradas,
            expira: expira,
            // grupoImg: grupoImg,
            // grupoLista: grupoLista 
        }); log.info(resultadoCreate);

        return resultadoCreate;
    } catch (error){
        log.error("Ocorreu um erro no cadastro de novas entradas, " + error + "!");
        alert("Ocorreu um erro no cadastro de novas entradas, " + error + "!");

        return null;
    }
}

async function lerEntradas(){
    try {
        const entradas = await Entradas.findAll();
        log.info(entradas);

        return entradas;
    } catch (error){
        log.info("Ocorreu um erro na leitura das entradas, " + error + "!");
        alert("Ocorreu um erro na leitura das entradas, " + error + "!");

        return null;
    }
}

async function pesquisarEntradas(pesquisa){
    try {
        const entradas = await Entradas.findAll({
            where: {
                nome: pesquisa,
                [or]: [
                    {descricao: pesquisa},
                    {site: pesquisa},
                    {usuario: pesquisa},
                    {expira: pesquisa},
                    {grupoLista: pesquisa}
                ]
            }
        }); log.info(entradas);

        return entradas;
    } catch (error){
        log.error("Ocorreu um erro na pesquisa das entradas, " + error + "!");
        alert("Ocorreu um erro na pesquisa das entradas, " + error + "!");

        return null;
    }
}

async function editarEntradas(selecaoAtual, nomeEntradas, descEntradas, siteEntradas, loginEntradas, senhaEntradas, expira, grupoImg, grupoLista){
    try {
        const entradas = await Entradas.findByPk(selecaoAtual).then(() => {
            entradas.nome = nomeEntradas;
            entradas.descricao = descEntradas;
            entradas.site = siteEntradas;
            entradas.usuario = loginEntradas;
            entradas.senha = senhaEntradas;
            entradas.expira = expira;
            // entradas.grupoImg = grupoImg;
            // entradas.grupoLista = grupoLista;
            
            entradas.save();
        }).catch((error) => {
            log.error("Ocorreu um erro na edicao das entradas, " + error + "!");
            alert("Ocorreu um erro na edição das entradas, " + error + "!");

            return null;
        });

        log.info(entradas);
        return entradas;
    } catch (error){
        log.error("Ocorreu um erro na edicao das entradas, " + error + "!");
        alert("Ocorreu um erro na edição das entradas, " + error + "!");

        return null;
    }
}

async function apagarEntradas(selecaoAtual){
    try {
        await Entradas.destroy({ where: { id: selecaoAtual }});
        log.error("Entrada(s) apagadas com sucesso! id: " + selecaoAtual);
        alert("Entrada(s) apagadas com sucesso! id: " + selecaoAtual);

        return true;
    } catch (error){
        log.error("Ocorreu um erro aqui, " + error + "!\nTalvez esta entrada nao exista, ou ja tenha sido apagada.");
        alert("Ocorreu um erro aqui, " + error + "!\nTalvez esta entrada não exista, ou já tenha sido apagada."); 

        return false;
    }
}

async function consultarBanco(path){
    try {
        if (fse.existsSync(path) == true){
            return true;
        } else {
            log.error("Este arquivo nao existe!");
            alert("Este arquivo não existe!");

            return false;
        }
    } catch (error){
        log.error("Ocorreu um erro aqui! Talvez este Banco de Dados ainda nao exista.");
        alert("Ocorreu um erro aqui! Talvez este Banco de Dados ainda não exista.");

        return false;
    }
}

module.exports = { lerArquivo, cadastrarEntradas, lerEntradas, pesquisarEntradas, editarEntradas, apagarEntradas, consultarBanco };