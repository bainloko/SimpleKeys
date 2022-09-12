/*
* SimpleKeys
* listar.js
* 07/set/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');
const ContextMenu = require('secure-electron-context-menu').default;

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

        return (conectar(path, nomeArq, descArq, expiraArq, chaveReserva, senha) != null) ? log.info("A conexao ao Banco de Dados foi estabelecida com sucesso!") : () => { log.error("Erro ao conectar ao Banco de Dados! Sera que a senha esta incorreta?"); alert("Erro ao conectar ao Banco de Dados! Sera que a senha esta incorreta?"); }
    } catch (error){
        log.error("Erro na listagem das entradas: " + error + "! Tente novamente!"); 
        alert("Erro na listagem das entradas: " + error + "! Tente novamente!");
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
        alert("A cópia falhou: " + err + "! Tente novamente!");
    }
}

function verF(senha){
    let result = zxcvbn(senha);
    switch (result.score){
        case 0:
            alert("Esta senha é muito fraca! Considere trocá-la imediatamente!"); //work on that -> dialog, ContextMenu
            break;
        case 1:
            alert("Esta senha é fraca! Considere trocá-la imediatamente!");
            break;
        case 2:
            alert("Esta senha é razoável! Considere trocá-la em no máximo 6 meses.");
            break;
        case 3:
            alert("Esta senha é forte! Considere trocá-la daqui, no mínimo, dois anos.");
            break;
        case 4:
            alert("Esta senha é muito forte! Troque-a quando julgar necessário.");
            break;
        default:
            alert("Erro na análise da senha!");
            break;
    }
}

ipc.on('entrada:apagar', (e) => {
    selecaoAtual = store.get("selecaoAtual");
    Arquivo.apagarEntradas(selecaoAtual);
});

module.exports = { listar, disableIfChecked, copiar, verF };