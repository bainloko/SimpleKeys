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

const listar = () => {
    try {
        let conn = store.get("conn");
        let path = store.get("pathArquivo");
        let nomeArq = store.get("nomeArquivo");
        let descArq = store.get("descArquivo");
        let expiraArq = store.get("expiraArquivo");
        let chaveReserva = store.get("chaveReserva");
        let senha = store.get("senhaArquivo");

        return (conectar(conn, path, nomeArq, descArq, expiraArq, chaveReserva, senha) != null) ? Arquivo.lerEntradas() : () => { log.error("Erro na listagem das entradas! Tente novamente!"); alert("Erro na listagem das entradas! Tente novamente!"); }
    } catch (error){
        log.error("Erro na listagem das entradas: " + error + "! Tente novamente!"); 
        alert("Erro na listagem das entradas: " + error + "! Tente novamente!");
    }
}

//ipc redirecionar adicionar

//ipc redirecionar editar

//ipc on entrada deletar

//criar outro strength.js mas com check senhas duplicadas e notifications

module.exports = { listar, Arquivo };