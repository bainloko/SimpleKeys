/*
* SimpleKeys
* editar.js
* 07/set/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');
const ContextMenu = require('secure-electron-context-menu').default;

const { listar } = require('./listar.js');
const Arquivo = require('../App/tools/Arquivo.js');

const log = require('electron-log');

async function editar(nomeEnt, descEnt, siteEnt, loginEnt, senhaEnt, expiraEnt){
    listar(); await Arquivo.editarEntradas(nomeEnt, descEnt, siteEnt, loginEnt, senhaEnt, expiraEnt);
    log.info("Entrada editada com sucesso!");
    alert("Entrada editada com sucesso!");
}

module.exports = { editar };