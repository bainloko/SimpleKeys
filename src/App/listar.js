/*
* SimpleKeys
* listar.js
* 07/set/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');
const ContextMenu = require('secure-electron-context-menu').default;

const { conectar } = require('../database/Database.js');
const Arquivo = require('../App/tools/Arquivo.js');

const Store = require('electron-store');
const store = new Store();

const log = require('electron-log');

let selecionada;

function listar(){
    try {
        let path = store.get("pathArquivo");
        let nomeArq = store.get("nomeArquivo");
        let descArq = store.get("descArquivo");
        let expiraArq = store.get("expiraArquivo");
        let chaveReserva = store.get("chaveReserva");
        let senha = store.get("senhaArquivo");

        (conectar(path, nomeArq, descArq, expiraArq, chaveReserva, senha) != null) ? log.info("A conexao ao Banco de Dados foi estabelecida com sucesso!") : () => { log.error("Erro ao conectar ao Banco de Dados! Sera que a senha esta incorreta?"); alert("Erro ao conectar ao Banco de Dados! Sera que a senha esta incorreta?"); }
    } catch (error){
        log.error("Erro na listagem das entradas: " + error + "! Tente novamente!"); 
        alert("Erro na listagem das entradas: " + error + "! Tente novamente!");
    }
}

function disableIfChecked(event, entrada){
    let target = event.target;
    Array.from(document.querySelectorAll('input.listarEntradas-checkbox')).filter(
        el => el !== target
    ).forEach(
        el => el.disabled = target.checked
    );

    return selecionada = entrada;
}

//ipc redirecionar adicionar

//ipc redirecionar editar

//ipc on entrada deletar

//criar outro strength.js mas com check senhas duplicadas e notifications

module.exports = { listar, disableIfChecked };