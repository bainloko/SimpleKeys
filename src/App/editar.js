/*
* SimpleKeys
* editar.js
* 07/set/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');
const ContextMenu = require('secure-electron-context-menu').default;

const Arquivo = require('../App/tools/Arquivo.js');

const Store = require('electron-store');
const store = new Store();
let selecaoAtual = store.get("selecaoAtual");

const log = require('electron-log');

function editar(nomeEnt, descEnt, siteEnt, loginEnt, senhaEnt, expiraEnt){
    Arquivo.editarEntradas(selecaoAtual, nomeEnt, descEnt, siteEnt, loginEnt, senhaEnt, expiraEnt);
    log.info("Entrada editada com sucesso!"); //work on that -> Notification, ContextMenu
}

module.exports = { editar };