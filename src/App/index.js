/*
* SimpleKeys
* index.js
* 07/set/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');

const log = require('electron-log');

ipc.on('ready', () => {
    log.info("Aplicativo aberto!");
});