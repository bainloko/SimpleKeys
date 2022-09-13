/*
* SimpleKeys
* cadastrar.js
* 07/set/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');
const ContextMenu = require('secure-electron-context-menu').default; //work on that -> Notification, ContextMenu

const Arquivo = require('../App/tools/Arquivo.js');

const log = require('electron-log');