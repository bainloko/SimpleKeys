/*
* SimpleKeys
* adicionar.js
* 07/set/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');
const ContextMenu = require('secure-electron-context-menu').default;

const { conectar } = require('../database/Database.js');
const Arquivo = require('../App/tools/Arquivo.js');

const Store = require('electron-store');
const store = new Store();

const log = require('electron-log');

ipc.on('entrada:criar', (e, nomeEnt, descEnt, siteEnt, loginEnt, senhaEnt, expiraEnt) => {
    Arquivo.cadastrarEntradas(nomeEnt, descEnt, siteEnt, loginEnt, senhaEnt, expiraEnt);
});