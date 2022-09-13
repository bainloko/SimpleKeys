/*
* SimpleKeys
* criar.js
* 07/set/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');
const ContextMenu = require('secure-electron-context-menu').default; //work on that -> Notification, ContextMenu

const Store = require('electron-store');
const store = new Store();

const log = require('electron-log');

ipc.on('arquivo:novo:pathArquivo', (e, path) => {
    let criarPath = path.toString().replace("[\\]", "&#92;");

    if (criarPath != ("" || null || undefined || [])) {
        store.set("pathArquivo", criarPath);
    } else {
        log.error("Selecione um local valido para salvar o Chaveiro!");
        ipc.send('mensagem:local:erro');
    }
});

const criarButton = document.getElementById("criarButton");

criarButton.addEventListener("click", () => {
    store.set("nomeArquivo", inputNomeArq.value);
    store.set("descArquivo", inputDescArq.value);
    store.set("expiraArquivo", expira.value);
    store.set("chaveReserva", chaveReserva.checked);
    store.set("senhaArquivo", inpPassword.value);
});