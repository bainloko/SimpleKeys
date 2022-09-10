/*
* SimpleKeys
* listar.js
* 07/set/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');
const ContextMenu = require('secure-electron-context-menu').default;

const { conectar } = require('../database/Database.js');
let database;

const Arquivo = require('../App/tools/Arquivo.js');

const Store = require('electron-store');
const store = new Store();

ipc.on('arquivo:receive', (e) => {
    try {
        let path = store.get("pathArquivo");
        let nomeArq = store.get("nomeArquivo");
        let descArq = store.get("descArquivo");
        let expiraArq = store.get("expiraArquivo");
        let chaveReserva = store.get("chaveReserva");
        let senha = store.get("senhaArquivo");
        
        database = conectar(path, nomeArq, descArq, expiraArq, chaveReserva, senha);
        Arquivo.lerEntradas();
    } catch (error){
        log.info("Erro na listagem das entradas. Tente novamente! " + error);
        alert("Erro na listagem das entradas. Tente novamente! " + error);
    }
});

//ipc redirecionar adicionar

//ipc redirecionar editar

//ipc on entrada deletar

//criar outro strength.js mas com check senhas duplicadas e notifications