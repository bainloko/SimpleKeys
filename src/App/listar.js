/*
* SimpleKeys
* listar.js
* 07/set/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');

const { conectar } = require('../database/Database.js');
const Arquivo = require('../App/tools/Arquivo.js');
const zxcvbn = require('../App/tools/zxcvbn.js');

const Store = require('electron-store');
const store = new Store();

const log = require('electron-log');

let selecionada = 0;

function listar(){
    try {
        let path = store.get("pathArquivo");
        let nomeArq = store.get("nomeArquivo");
        let descArq = store.get("descArquivo");
        let expiraArq = store.get("expiraArquivo");
        let chaveReserva = store.get("chaveReserva");
        let senha = store.get("senhaArquivo");

        return (conectar(path, nomeArq, descArq, expiraArq, chaveReserva, senha) != null) ? log.info("A conexao ao Banco de Dados foi estabelecida com sucesso!") : () => { log.error("Erro ao conectar ao Banco de Dados! Sera que a senha esta incorreta?"); ipc.send('mensagem:listagem:erro'); }
    } catch (error){
        log.error("Erro na listagem das Entradas: " + error + "! Tente novamente!"); 
        ipc.send('mensagem:listagem:erro2');
    }
}

function disableIfChecked(event, entrada){
    let target = event.target;
    Array.from(document.querySelectorAll('input.listarEntradas-checkbox')).filter(
        element => element !== target
    ).forEach(
        element => { element.disabled = target.checked }
    );

    selecionada = entrada;
    store.set("selecaoAtual", selecionada);
    return selecionada;
}

async function copiar(texto){
    try {
        await navigator.clipboard.writeText(texto);
    } catch (err){
        log.error("A copia falhou: " + err + "! Tente novamente!");
        ipc.send('mensagem:copia:erro');
    }
}

function verF(senha){
    let result = zxcvbn(senha);
    switch (result.score){
        case 0:
            ipc.send('mensagem:analise:ppp');
            break;
        case 1:
            ipc.send('mensagem:analise:pp');
            break;
        case 2:
            ipc.send('mensagem:analise:r');
            break;
        case 3:
            ipc.send('mensagem:analise:f');
            break;
        case 4:
            ipc.send('mensagem:analise:ff');
            break;
        default:
            ipc.send('mensagem:analise:erro');
            break;
    }
}

ipc.on('entrada:apagar', async (e) => {
    selecaoAtual = store.get("selecaoAtual");
    await Arquivo.apagarEntrada(selecaoAtual);
});

ipc.on('repopular', (e) => {
    store.set("selecaoAtual") = 0;
    rePopular('');
});

module.exports = { listar, disableIfChecked, copiar, verF };