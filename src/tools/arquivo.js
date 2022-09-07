/*
* SimpleKeys
* arquivo.js
* 22/jun/2022
*/

const fse = require('fs-extra');
const Path = require('path');

const Sequelize = require('sequelize');

const Entradas = require('../model/Entradas.js');
const database = require('../database/Database.js');
const dbConfig = require('../database/database.json');

const Store = require('electron-store');
const store = new Store();

const log = require('electron-log');

const { or } = Sequelize.Op;

//revisar este, o código das outras ferramentas, do main, do preload e fazer conforme o prof. Emílio disse. sanear os nomes das variáveis, criar o banco no próprio processo novoArquivo.html e etc., comparar com a master branch.
async function novoArquivo(nomeArquivo, descArquivo, expira, chaveReserva, senhaMestra){
    let path = store.get('novoPath');

    try {
        if (consultarBanco(path)) {
            log.info("Este arquivo " + nomeArquivo + " já existe! Feche esta janela e acesse-o por lá.");
            alert("Este arquivo " + nomeArquivo + " já existe! Feche esta janela e acesse-o por lá.");

            return false;
        } else {
            if (database.criar(nomeArquivo, descArquivo, expira, chaveReserva, senhaMestra)) {
                lerEntradas();

                log.info("O Banco " + nomeArquivo + " foi criado e salvo com sucesso no local " + path + " !");
                alert("O Banco " + nomeArquivo + " foi criado e salvo com sucesso no local " + path + " !");

                return true;
            } else {
                database.close();

                log.error("Houve um problema no salvamento do Banco, tente novamente!");
                alert("Houve um problema no salvamento do Banco, tente novamente!");

                return false;
            }
        }
    } catch (error){
        log.error("Ocorreu um erro aqui, " + error + "! Talvez um arquivo com o mesmo nome já exista.");
        alert("Ocorreu um erro aqui, " + error + "! Talvez um arquivo com o mesmo nome já exista.");

        return false;
    }
}

async function lerArquivo(nomeArquivo, senhaMestra){
    let path = Path.join(__dirname, nomeArquivo.toString());

    try {
        if (database.conectar(path, senhaMestra)) {
            const arqNome = "nome" + nomeArquivo;
            const arqDesc = "desc" + nomeArquivo;
            const arqExpira = "expira?" + nomeArquivo;
            const arqChaveReserva = "chaveReserva?" + nomeArquivo;

            store.get(arqNome);
            store.get(arqDesc);
            store.get(arqExpira);
            store.get(arqChaveReserva);
            
            lerEntradas();
            log.info("O Banco " + nomeArquivo + " foi acessado com sucesso!");

            return true;
        } else {
            database.close(dbConfig);

            log.error("Houve um problema na abertura do Banco, tente novamente! Será que a senha está errada?");
            alert("Houve um problema na abertura do Banco, tente novamente! Será que a senha está errada?");

            return false;
        }
    } catch (error){
        log.error("Ocorreu um erro aqui, " + error + "! Talvez um arquivo com o mesmo nome já exista.");
        alert("Ocorreu um erro aqui, " + error + "! Talvez um arquivo com o mesmo nome já exista.");

        return false;
    }
}

async function cadastrarEntradas(nomeEntradas, descEntradas, siteEntradas, loginEntradas, senhaEntradas, expira, grupoImg, grupoLista){
    try {
        const resultado = await database.sync();
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
        });

        log.info(resultadoCreate);

        return true;
    } catch (error){
        log.error("Ocorreu um erro no cadastramento de novas entradas, " + error + "!");
        alert("Ocorreu um erro no cadastramento de novas entradas, " + error + "!");

        return false;
    }
}

async function lerEntradas(){
    try {
        const entradas = await Entradas.findAll();
        log.info(entradas);

        return true;
    } catch (error){
        log.info("Ocorreu um erro na leitura das entradas, " + error + "!");
        alert("Ocorreu um erro na leitura das entradas, " + error + "!");

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
                    {site: pesquisa},
                    {usuario: pesquisa},
                    {expira: pesquisa},
                    {grupoLista: pesquisa}
                ]
            }
        });

        log.info(entradas);

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
            entradas.grupoImg = grupoImg;
            entradas.grupoLista = grupoLista;
            
            const resultadoUpdate = entradas.save();
            log.info(resultadoUpdate);
        }).catch((error) => {
            log.error("Ocorreu um erro na atualização das entradas, " + error + "!");
            alert("Ocorreu um erro na atualização das entradas, " + error + "!");

            return false;
        });

        log.info(entradas);
        
        return true;
    } catch (error){
        log.error("Ocorreu um erro na atualização das entradas, " + error + "!");
        alert("Ocorreu um erro na atualização das entradas, " + error + "!");

        return false;
    }
}

async function apagarEntradas(selecaoAtual){
    try {
        Entradas.destroy({ where: { id: selecaoAtual }});

        return true;
    } catch (error){
        log.error("Ocorreu um erro aqui, " + error + "!\nTalvez esta entrada não exista, ou já tenha sido apagada.");
        alert("Ocorreu um erro aqui, " + error + "!\nTalvez esta entrada não exista, ou já tenha sido apagada."); 

        return false;
    }
}

async function consultarBanco(nomeArquivo){
    try {
        if (fse.existsSync(nomeArquivo)){
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

export { novoArquivo, cadastrarEntradas, lerEntradas, pesquisarEntradas, editarEntradas, apagarEntradas, lerArquivo, consultarBanco };