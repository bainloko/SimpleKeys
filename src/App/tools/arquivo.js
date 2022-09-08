/*
* SimpleKeys
* arquivo.js
* 22/jun/2022
*/

const fse = require('fs-extra');
const Path = require('path');

const Sequelize = require('sequelize');
const Entradas = require('../../model/Entradas.js');
const database = require('../../database/Database.js');

const Store = require('electron-store');
const store = new Store();

const log = require('electron-log');

const { or } = Sequelize.Op;

//revisar este, o código das outras ferramentas, do main, do preload e fazer conforme o prof. Emílio disse. sanear os nomes das variáveis, criar o banco no próprio processo novoArquivo.html e etc., comparar com a master branch.
async function novoArquivo(path, nomeArquivo, descArquivo, expiraArquivo, chaveReserva, senhaMestra){
    let path = store.get("pathArquivo");

    try {
        if (consultarBanco(path) == true) {
            log.info("Este arquivo " + nomeArquivo + " ja existe! Feche esta janela e acesse-o por la.");
            alert("Este arquivo " + nomeArquivo + " já existe! Feche esta janela e acesse-o por lá.");

            return false;
        } else {
            await database.criar(path, nomeArquivo, descArquivo, expiraArquivo, chaveReserva, senhaMestra);
            lerEntradas(); //

            log.info("O Banco " + nomeArquivo + " foi criado e salvo com sucesso no local " + path + " !");
            alert("O Banco " + nomeArquivo + " foi criado e salvo com sucesso no local " + path + " !");

            return true;
        }
    } catch (error){
        log.error("Houve um problema na criacao do Banco, tente novamente! " + error);
        alert("Houve um problema na criação do Banco, tente novamente! " + error);

        return false;
    }
}

async function lerArquivo(nomeArquivo, senhaMestra){
    let path = Path.join(__dirname, nomeArquivo.toString());

    try {
        if (database.conectar(path, nomeArquivo, senhaMestra) == true) {
            lerEntradas();
            log.info("O Banco " + nomeArquivo + " foi acessado com sucesso!");

            return true;
        } else {
            database.close();

            log.error("Houve um problema na abertura do Banco, tente novamente! Sera que a senha esta errada?");
            alert("Houve um problema na abertura do Banco, tente novamente! Será que a senha está errada?");

            return false;
        }
    } catch (error){
        log.error("Ocorreu um erro aqui, " + error + "! Talvez um arquivo com o mesmo nome ja exista.");
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
        log.error("Ocorreu um erro no cadastro de novas entradas, " + error + "!");
        alert("Ocorreu um erro no cadastro de novas entradas, " + error + "!");

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
            log.error("Ocorreu um erro na atualizacao das entradas, " + error + "!");
            alert("Ocorreu um erro na atualização das entradas, " + error + "!");

            return false;
        });

        log.info(entradas);
        
        return true;
    } catch (error){
        log.error("Ocorreu um erro na atualizacao das entradas, " + error + "!");
        alert("Ocorreu um erro na atualização das entradas, " + error + "!");

        return false;
    }
}

async function apagarEntradas(selecaoAtual){
    try {
        Entradas.destroy({ where: { id: selecaoAtual }});

        return true;
    } catch (error){
        log.error("Ocorreu um erro aqui, " + error + "!\nTalvez esta entrada nao exista, ou ja tenha sido apagada.");
        alert("Ocorreu um erro aqui, " + error + "!\nTalvez esta entrada não exista, ou já tenha sido apagada."); 

        return false;
    }
}

async function consultarBanco(nomeArquivo){
    try {
        if (fse.existsSync(nomeArquivo)){
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

module.exports = { novoArquivo, cadastrarEntradas, lerEntradas, pesquisarEntradas, editarEntradas, apagarEntradas, lerArquivo, consultarBanco };