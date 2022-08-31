/*
* SimpleKeys
* preload.js
* 20/jun/2022
*/

const { remote } = require('electron');
const { ipcRenderer: ipc } = require('electron-better-ipc');

const log = require('electron-log');

window.log = log.functions;

dialog = remote.dialog;
WIN = remote.getCurrentWindow();