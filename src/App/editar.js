/*
* SimpleKeys
* editar.js
* 07/set/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');
const ContextMenu = require('secure-electron-context-menu').default; //work on that -> Notification, ContextMenu

const Arquivo = require('../App/tools/Arquivo.js');

const Store = require('electron-store');
const store = new Store();
selecaoAtual = store.get("selecaoAtual");

const log = require('electron-log');