/*
* SimpleKeys
* criar.js
* 07/set/2022
*/

const { dialog } = require('electron');
const { ipcRenderer: ipc } = require('electron-better-ipc');
const ContextMenu = require('secure-electron-context-menu').default; //work on that -> ContextMenu

const Store = require('electron-store');
const store = new Store();

ipc.on('arquivo:novo:pathArquivo', (e, path) => {
    let criarPath = path.toString().replace("[\\]", "&#92;");

    if (criarPath != ("" || null || undefined || [])) {
        store.set("pathArquivo", criarPath);
    } else {
        log.error("Selecione um local valido para salvar o Arquivo!");
        dialog.showErrorBox("Erro!", "Selecione um local válido para salvar o Arquivo!");
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