/*
* SimpleKeys
* criar.js
* 07/set/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');
const ContextMenu = require('secure-electron-context-menu').default;

const { conectar } = require('../database/Database.js');

const Store = require('electron-store');
const store = new Store();

const log = require('electron-log');

ipc.on('arquivo:novo:pathArquivo', (e, path) => {
    let criarPath = path.toString().replace("[\\]", "&#92;");

    if (criarPath != ("" || null || undefined || [])) {
        store.set("pathArquivo", criarPath);
    } else {
        alert("Selecione um local válido para salvar o Arquivo!");
    }
});

function novoCriar(nomeArq, descArq, expiraArq, chaveReserva, senhaArq){
    let path = store.get("pathArquivo");
    
    try {
        const database = conectar(path, nomeArq, descArq, expiraArq, chaveReserva, senhaArq);
        ipc.send('arquivo:novo:criar');

        return database;
    } catch (error){
        log.error("Houve um problema na criacao do Banco, tente novamente! " + error);
        alert("Houve um problema na criação do Banco, tente novamente! " + error);

        return null;
    }
}

module.exports = { novoCriar };