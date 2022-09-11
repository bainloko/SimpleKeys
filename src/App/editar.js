/*
* SimpleKeys
* editar.js
* 07/set/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');
const ContextMenu = require('secure-electron-context-menu').default;

const { conectar } = require('../database/Database.js');
const database = require('../database/Database.js');
const Arquivo = require('../App/tools/Arquivo.js');

const Store = require('electron-store');
const store = new Store();

const log = require('electron-log');

ipc.on('entrada:editar', (e, nomeEnt, descEnt, siteEnt, loginEnt, senhaEnt, expiraEnt) => {
    store.set("conn", true);
    //alerts e checks de verificação antes de editar (are you sure?)
    Arquivo.editarEntradas(nomeEnt, descEnt, siteEnt, loginEnt, senhaEnt, expiraEnt);
});