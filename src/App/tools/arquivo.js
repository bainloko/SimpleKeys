/*
* SimpleKeys
* arquivo.js
* 22/jun/2022
*/

const { dialog } = require('electron');

const fse = require('fs-extra');

const { Op } = require('sequelize');
const Entradas = require('../../model/Entradas.js');

const log = require('electron-log');

async function cadastrarEntradas(nomeEntradas, descEntradas, siteEntradas, loginEntradas, senhaEntradas, expira, grupoImg, grupoLista){
    try {
        const resultadoCreate = await Entradas.create({
            nome: nomeEntradas,
            descricao: descEntradas,
            site: siteEntradas,
            login: loginEntradas,
            senha: senhaEntradas,
            expira: expira,
            // grupoImg: grupoImg,
            // grupoLista: grupoLista 
        });

        log.info("Entrada cadastrada com sucesso!");
        dialog.showMessageBox("Entrada cadastrada com sucesso!");

        return resultadoCreate;
    } catch (error){
        log.error("Ocorreu um erro no cadastro da nova Entrada, " + error + "!");
        dialog.showErrorBox("Erro!", "Ocorreu um erro no cadastro da nova Entrada, " + error + "!");

        return null;
    }
}

async function lerEntradas(){
    try {
        const entradas = await Entradas.findAll();

        return entradas;
    } catch (error){
        log.error("Ocorreu um erro na leitura das Entradas, " + error + "!");
        dialog.showErrorBox("Erro!", "Ocorreu um erro na leitura das Entradas, " + error + "!");

        return null;
    }
}

async function pesquisarByPk(selecaoAtual){
    try {
        const entradas = await Entradas.findByPk(selecaoAtual);

        return entradas;
    } catch (error){
        log.error("Ocorreu um erro na pesquisa das Entradas, " + error + "!");
        dialog.showErrorBox("Erro!", "Ocorreu um erro na pesquisa das Entradas, " + error + "!");

        return null;
    }
}

async function pesquisarEntradas(pesquisa){
    try {
        const entradas = await Entradas.findAll({
            where: {
                nome: pesquisa,
                [Op.or]: [
                    {descricao: pesquisa},
                    {site: pesquisa},
                    {login: pesquisa},
                    {expira: pesquisa},
                    {grupoLista: pesquisa}
                ]
            }
        });

        return entradas;
    } catch (error){
        log.error("Ocorreu um erro na pesquisa das Entradas, " + error + "!");
        dialog.showErrorBox("Erro!", "Ocorreu um erro na pesquisa das Entradas, " + error + "!");

        return null;
    }
}

async function editarEntradas(selecaoAtual, nomeEntradas, descEntradas, siteEntradas, loginEntradas, senhaEntradas, expira, grupoImg, grupoLista){
    try {
        const entradas = await Entradas.findByPk(selecaoAtual).then(() => {
            entradas.nome = nomeEntradas;
            entradas.descricao = descEntradas;
            entradas.site = siteEntradas;
            entradas.login = loginEntradas;
            entradas.senha = senhaEntradas;
            entradas.expira = expira;
            // entradas.grupoImg = grupoImg;
            // entradas.grupoLista = grupoLista;
            
            entradas.save();
            log.info("Entrada editada com sucesso!");

            return entradas;
        }).catch((error) => {
            log.error("Ocorreu um erro na edicao da Entrada, " + error + "!");
            dialog.showErrorBox("Erro!", "Ocorreu um erro na edição da Entrada, " + error + "!");

            return null;
        });
    } catch (error){
        log.error("Ocorreu um erro na edicao da Entrada, " + error + "!");
        dialog.showErrorBox("Erro!", "Ocorreu um erro na edição da Entrada, " + error + "!");

        return null;
    }
}

async function apagarEntradas(selecaoAtual){
    try {
        await Entradas.destroy({ where: { id: selecaoAtual }});

        log.info("Entrada(s) apagadas com sucesso! id: " + selecaoAtual);
        dialog.showMessageBox("Entrada(s) apagadas com sucesso! id: " + selecaoAtual);

        return true;
    } catch (error){
        log.error("Ocorreu um erro aqui, " + error + "!\nTalvez esta Entrada nao exista, ou ja tenha sido apagada.");
        dialog.showErrorBox("Erro!", "Ocorreu um erro aqui, " + error + "!\nTalvez esta Entrada não exista, ou já tenha sido apagada.");

        return false;
    }
}

async function salvarBanco(){
    try {
        await Entradas.sequelize.sync();

        log.info("Chaveiro salvo com sucesso!");
        dialog.showMessageBox("Chaveiro salvo com sucesso!");

        return true;
    } catch (error){
        log.error("Ocorreu um erro no salvamento do Chaveiro! " + error);
        dialog.showErrorBox("Erro!", "Ocorreu um erro no salvamento do Chaveiro! " + error);

        return false;
    }
}

async function fecharConexao(){
    try {
        await Entradas.sequelize.close();

        log.info("Chaveiro fechado com sucesso!");
        dialog.showMessageBox("Chaveiro fechado com sucesso!");

        return true;
    } catch (error){
        log.error("Ocorreu um erro no fechamento do Chaveiro! " + error);
        dialog.showErrorBox("Erro!", "Ocorreu um erro no fechamento do Chaveiro! " + error);

        return false;
    }
}

async function consultarBanco(path){
    try {
        if (fse.existsSync(path) == true){
            return true;
        } else {
            log.error("Este Chaveiro nao existe!");
            dialog.showErrorBox("Erro!", "Este Chaveiro não existe!");

            return false;
        }
    } catch (error){
        log.error("Ocorreu um erro aqui! Talvez este Chaveiro ainda nao exista: " + error);
        dialog.showErrorBox("Erro!", "Ocorreu um erro aqui! Talvez este Chaveiro ainda não exista: " + error);

        return false;
    }
}

module.exports = { cadastrarEntradas, lerEntradas, Entradas, pesquisarByPk, pesquisarEntradas, editarEntradas, apagarEntradas, salvarBanco, fecharConexao, consultarBanco };