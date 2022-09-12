/*
* SimpleKeys
* index.js
* 07/set/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');

const Store = require('electron-store');
const store = new Store();

store.set("pathArquivo", "");
store.set("nomeArquivo", "");
store.set("descArquivo", "");
store.set("expiraArquivo", 0);
store.set("chaveReserva", false);
store.set("senhaArquivo", "");