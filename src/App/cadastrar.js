/*
* SimpleKeys
* cadastrar.js
* 07/set/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');
const ContextMenu = require('secure-electron-context-menu').default;

const Arquivo = require('../App/tools/Arquivo.js');

const log = require('electron-log');

function cadastrar(nomeEnt, descEnt, siteEnt, loginEnt, senhaEnt, expiraEnt){
    Arquivo.cadastrarEntradas(nomeEnt, descEnt, siteEnt, loginEnt, senhaEnt, expiraEnt);
    ipc.send('arquivo:novo:criar');
    log.info("Entrada cadastrada com sucesso!"); //work on that -> Notification, ContextMenu
}

module.exports = { cadastrar };