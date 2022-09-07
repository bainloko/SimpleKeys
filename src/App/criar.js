/*
* SimpleKeys
* criar.js
* 07/set/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');
const ContextMenu = require("secure-electron-context-menu").default;

//revisar este, o código das outras ferramentas, do main, do preload e fazer conforme o prof. Emílio disse. sanear os nomes das variáveis, criar o banco no próprio processo novoArquivo.html e etc., comparar com a master branch.