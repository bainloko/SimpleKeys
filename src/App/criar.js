/*
* SimpleKeys
* criar.js
* 07/set/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');
const ContextMenu = require('secure-electron-context-menu').default;

const Database = require('../database/Database.js');

const Store = require('electron-store');
const store = new Store();

const log = require('electron-log');

ipc.on('arquivo:novo:receiveArquivo', (e, path) => {
    let criarPath = path.toString().replace("[\\]", "&#92;");

    if (criarPath != ("" || null || undefined || [])) {
        store.set("pathArquivo", criarPath);
    } else {
        alert("Selecione uma Chave para abrir clicando na pasta abaixo da senha!");
    }
});

async function novoCriar(nomeArq, descArq, expiraArq, chaveReserva, senhaArq){
    path = store.get("pathArquivo");

    try {
        await Database.criar(path, nomeArq, descArq, expiraArq, chaveReserva, senhaArq);
        ipc.send('arquivo:criar');
    } catch (error){
        log.error("Houve um problema na criacao do Banco, tente novamente! " + error);
        alert("Houve um problema na criação do Banco, tente novamente! " + error);
    }
}

module.exports = { novoCriar };