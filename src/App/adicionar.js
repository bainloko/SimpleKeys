/*
* SimpleKeys
* adicionar.js
* 07/set/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');
const ContextMenu = require('secure-electron-context-menu').default;

const { conectar } = require('../database/Database.js');
let database;

const Arquivo = require('../App/tools/Arquivo.js');

const Store = require('electron-store');
const store = new Store();

ipc.on('entrada:criar', (e, nomeEnt, descEnt, siteEnt, loginEnt, senhaEnt, expiraEnt) => {
    cadastrarEntradas(nomeEnt, descEnt, siteEnt, loginEnt, senhaEnt, expiraEnt);
});