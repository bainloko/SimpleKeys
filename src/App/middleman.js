/*
* SimpleKeys
* middleman.js
* 07/set/2022, 13/set/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');

const Store = require('electron-store');
const store = new Store();

const log = require('electron-log');

const { listar } = require('../App/listar.js');

listar();