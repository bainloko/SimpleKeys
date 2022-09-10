/*
* SimpleKeys
* listar.js
* 07/set/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');
const ContextMenu = require('secure-electron-context-menu').default;

const Arquivo = require('../App/tools/Arquivo.js');

ipc.on('arquivo:novo:receive', (e) => {
    try {
        Arquivo.lerEntradas();
    } catch (error){
        log.info("Erro na listagem das entradas. Tente novamente! " + error);
        alert("Erro na listagem das entradas. Tente novamente! " + error);
    }
});

ipc.on('arquivo:ler:receive', (e) => {
    try {
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