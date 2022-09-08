/*
* SimpleKeys
* criar.js
* 07/set/2022
*/

const { dialog } = require('electron');
const { ipcRenderer: ipc } = require('electron-better-ipc');
const ContextMenu = require('secure-electron-context-menu').default;

const Arquivo = require('./tools/Arquivo.js');

const Store = require('electron-store');
const store = new Store();

const log = require('electron-log');

function novoSalvar(){
    let options = {
        title: "SimpleKeys - Criar Um Novo Arquivo",
        defaultPath: "%USERPROFILE%/" || "$HOME/",
        buttonLabel: "Salvar",
        filters: [
            {name: 'Banco de Dados', extensions: ['db']},
            {name: 'All Files', extensions: ['*']}
        ]
    }

    dialog.showSaveDialog(WIN, options).then((arquivo) => {
        if (arquivo != ("" || null || undefined)) {
            log.info(arquivo.filePath);
            store.set("pathArquivo", arquivo.filePath);
        } else {
            alert("Selecione um local válido para salvar o arquivo!");
        }
    }).catch((error) => {
        log.info("Houve um erro aqui! " + error);
    });
}

function lerArquivo(path, senha){
    try {
        if (Arquivo.lerArquivo(path, senha) == true) {
            ipc.send('arquivo:ler:cancelar');
            //
        } else {
            log.info("Erro! Possivelmente a senha esta incorreta. Tente novamente!");
            alert("Erro! Possivelmente a senha está incorreta. Tente novamente!");
        }
    } catch (error){
        log.info("Erro! Possivelmente a senha está incorreta. Tente novamente! " + error);
        alert("Erro! Possivelmente a senha está incorreta. Tente novamente! " + error);
    }
}

function novoCriar(nomeArq, descArq, expiraArq, chaveReserva, senhaArq){
    path = store.get("pathArquivo");
    
    try {
        await Arquivo.novoArquivo(path, nomeArq, descArq, expiraArq, chaveReserva, senhaArq);
        ipc.send('arquivo:criar');
    } catch (error){
        log.error("Houve um problema na criacao do Banco, tente novamente! " + error);
        alert("Houve um problema na criação do Banco, tente novamente! " + error);
    }
}

module.exports = { novoSalvar, lerArquivo, novoCriar };