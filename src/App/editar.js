/*
* SimpleKeys
* editar.js
* 07/set/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');
const ContextMenu = require('secure-electron-context-menu').default;

const { conectar } = require('../database/Database.js');

const Arquivo = require('../App/tools/Arquivo.js');

let database;

ipc.on('entrada:editar', (e, nomeEnt, descEnt, siteEnt, loginEnt, senhaEnt, expiraEnt) => {
    //alerts e checks de verificação após editar (are you sure?)
    editarEntradas(nomeEnt, descEnt, siteEnt, loginEnt, senhaEnt, expiraEnt);
});