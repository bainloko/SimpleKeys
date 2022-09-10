/*
* SimpleKeys
* listar.js
* 07/set/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');
const ContextMenu = require('secure-electron-context-menu').default;

const { conectar } = require('../database/Database.js');

const Arquivo = require('../App/tools/Arquivo.js');

let database;

ipc.on('arquivo:receive', (e, path, nomeArq, descArq, expiraArq, chaveReserva, senhaArq) => {
    try {
        database = conectar(path, nomeArq, descArq, expiraArq, chaveReserva, senhaArq);
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