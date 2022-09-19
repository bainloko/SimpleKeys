/*
* SimpleKeys
* arquivo.js
* 22/jun/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');

const fse = require('fs-extra');

const { Op } = require('sequelize');
const Entradas = require('../../model/Entradas.js');

const log = require('electron-log');

async function cadastrarSeed(nomeEntradas, descEntradas, siteEntradas, loginEntradas, senhaEntradas, expira){
    try {
        const resultadoSeed = await Entradas.create({
            nome: nomeEntradas,
            descricao: descEntradas,
            site: siteEntradas,
            login: loginEntradas,
            senha: senhaEntradas,
            expira: expira
        });

        log.info("Entrada cadastrada com sucesso!");

        return resultadoSeed;
    } catch (error){
        log.error("Ocorreu um erro no cadastro da nova Entrada, " + error + "!");
        ipc.send('mensagem:entrada:erro');

        return null;
    }
}

async function cadastrarEntrada(nomeEntradas, descEntradas, siteEntradas, loginEntradas, senhaEntradas, expira){
    try {
        const entradaCadastro = await Entradas.create({
            nome: nomeEntradas,
            descricao: descEntradas,
            site: siteEntradas,
            login: loginEntradas,
            senha: senhaEntradas,
            expira: expira
        });

        log.info("Entrada cadastrada com sucesso!");
        ipc.send('mensagem:entrada:sucesso');

        return entradaCadastro;
    } catch (error){
        log.error("Ocorreu um erro no cadastro da nova Entrada, " + error + "!");
        ipc.send('mensagem:entrada:erro');

        return null;
    }
}

async function lerEntradas(){
    try {
        const entradas = await Entradas.findAll();

        return entradas;
    } catch (error){
        log.error("Ocorreu um erro na leitura das Entradas, " + error + "!");
        ipc.send('mensagem:leitura:erro');

        return null;
    }
}

async function pesquisarByPk(selecaoAtual){
    try {
        const entradasPesqPk = await Entradas.findByPk(selecaoAtual);

        return entradasPesqPk;
    } catch (error){
        log.error("Ocorreu um erro na pesquisa das Entradas, " + error + "!");
        ipc.send('mensagem:pesquisa:erro');

        return null;
    }
}

async function pesquisarEntradas(pesquisa){
    try {
        const entradasPesq = await Entradas.findAll({
            where: {
                [Op.or]: [
                    {id: pesquisa},
                    {nome: pesquisa},
                    {descricao: pesquisa},
                    {site: pesquisa},
                    {login: pesquisa},
                    {expira: pesquisa}
                ]
            }
        });

        return entradasPesq;
    } catch (error){
        log.error("Ocorreu um erro na pesquisa das Entradas, " + error + "!");
        ipc.send('mensagem:pesquisa:erro');

        return null;
    }
}

async function editarEntrada(selecaoAtual, nomeEntradas, descEntradas, siteEntradas, loginEntradas, senhaEntradas, expira){
    try {
        await Entradas.findByPk(selecaoAtual).then( async (entrada) => {
            entrada.nome = nomeEntradas;
            entrada.descricao = descEntradas;
            entrada.site = siteEntradas;
            entrada.login = loginEntradas;
            entrada.senha = senhaEntradas;
            entrada.expira = expira;
            
            await entrada.save();
            log.info("Entrada editada com sucesso!");
            ipc.send('mensagem:edicao:sucesso');
        }).catch((error) => {
            log.error("Ocorreu um erro na edicao da Entrada, " + error + "!");
            ipc.send('mensagem:edicao:erro');

            return null;
        });
    } catch (error){
        log.error("Ocorreu um erro na edicao da Entrada, " + error + "!");
        ipc.send('mensagem:edicao:erro');

        return null;
    }
}

async function apagarEntrada(selecaoAtual){
    try {
        await Entradas.destroy({ where: { id: selecaoAtual }});

        log.info("Entrada apagada com sucesso! id: " + selecaoAtual);
        ipc.send('mensagem:apagar:sucesso');

        return true;
    } catch (error){
        log.error("Ocorreu um erro aqui, " + error + "!\nTalvez esta Entrada nao exista, ou ja tenha sido apagada.");
        ipc.send('mensagem:apagar:erro');

        return false;
    }
}

async function salvarBanco(){
    try {
        await Entradas.sync();

        log.info("Chaveiro salvo com sucesso!");
        ipc.send('mensagem:salvar:sucesso');

        return true;
    } catch (error){
        log.error("Ocorreu um erro no salvamento do Chaveiro! " + error);
        ipc.send('mensagem:salvar:erro');

        return false;
    }
}

async function fecharConexao(){
    try {
        await Entradas.sequelize.close();

        log.info("Chaveiro fechado com sucesso!");
        ipc.send('mensagem:fecharConexao:sucesso');

        return true;
    } catch (error){
        log.error("Ocorreu um erro no fechamento do Chaveiro! " + error);
        ipc.send('mensagem:fecharConexao:erro');

        return false;
    }
}

async function consultarBanco(path){
    try {
        if (fse.existsSync(path) == true){
            return true;
        } else {
            log.error("Este Chaveiro nao existe!");
            ipc.send('mensagem:consulta:erro');

            return false;
        }
    } catch (error){
        log.error("Ocorreu um erro aqui! Talvez este Chaveiro ainda nao exista: " + error);
        ipc.send('mensagem:consulta:erro2');

        return false;
    }
}

module.exports = { cadastrarSeed, cadastrarEntrada, lerEntradas, Entradas, pesquisarByPk, pesquisarEntradas, editarEntrada, apagarEntrada, salvarBanco, fecharConexao, consultarBanco };