/*
* SimpleKeys
* cadastrar.js
* 07/set/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');
const ContextMenu = require('secure-electron-context-menu').default;

const { listar } = require('./listar.js');
const Arquivo = require('./tools/Arquivo.js');

const log = require('electron-log');

async function cadastrar(nomeEnt, descEnt, siteEnt, loginEnt, senhaEnt, expiraEnt){
    listar(); await Arquivo.cadastrarEntradas(nomeEnt, descEnt, siteEnt, loginEnt, senhaEnt, expiraEnt);
    log.info("Entrada cadastrada com sucesso!");
    alert("Entrada cadastrada com sucesso!");
}

module.exports = { cadastrar };