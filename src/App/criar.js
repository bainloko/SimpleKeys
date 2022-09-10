/*
* SimpleKeys
* criar.js
* 07/set/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');
const ContextMenu = require('secure-electron-context-menu').default;

const { conectar } = require('../database/Database.js');
let database;

const Store = require('electron-store');
const store = new Store();

function novoCriar(nomeArq, descArq, expiraArq, chaveReserva, senha){
    store.set("nomeArquivo", nomeArq);
    store.set("descArquivo", descArq);
    store.set("expiraArquivo", expiraArq);
    store.set("chaveReserva", chaveReserva);
    store.set("senhaArquivo", senha);

    ipc.send('arquivo:novo:criar');
}

ipc.on('arquivo:novo:pathArquivo', (e, path) => {
    let criarPath = path.toString().replace("[\\]", "&#92;");

    if (criarPath != ("" || null || undefined || [])) {
        store.set("pathArquivo", criarPath);
    } else {
        alert("Selecione um local válido para salvar o Arquivo!");
    }
});

module.exports = { novoCriar };