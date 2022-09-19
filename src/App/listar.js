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

listar();

let res = "", entradas, busca, selecaoAtual = 0;

async function seed(){
    busca = await Arquivo.lerEntradas();
    if (busca.length == 0) {
        Arquivo.cadastrarSeed('Google', 'Exemplo', 'https://google.com', 'fulanodetal@gmail', '123456', 0, '', '');
        log.info("Foi preciso SEED! Apos seedado com sucesso, o programa ira carregar normalmente.");
        busca = "";
    } else {
        log.info("Nao foi preciso SEED! Carregando normalmente...");
        busca = "";
    }
}

async function popular(){
    entradas = await Arquivo.lerEntradas();
    entradas.forEach((entrada) => {
        res += `
            <tr id="textosTD${entrada.id}">
            <td style="min-width: var(--id); max-width: var(--id); word-wrap: break-word; text-align: center;">${entrada.id}</td>
            <td style="min-width: var(--nomeDescSiteLogin); max-width: var(--nomeDescSiteLogin); word-wrap: break-word; text-align: center;">${entrada.nome}</td>
            <td style="min-width: var(--nomeDescSiteLogin); max-width: var(--nomeDescSiteLogin); word-wrap: break-word; text-align: center;">${entrada.descricao}</td>
            <td style="min-width: var(--nomeDescSiteLogin); max-width: var(--nomeDescSiteLogin); padding-left: 5px; word-wrap: break-word; text-align: center;">${entrada.site}</td>
            <td id="idL${entrada.id}" style="min-width: var(--nomeDescSiteLogin); max-width: var(--nomeDescSiteLogin); word-wrap: break-word; text-align: center;">${entrada.login}</td>
            <td style="min-width: var(--senha); max-width: var(--senha); word-wrap: break-word; text-align: center; border-right: 0px;">
                <input type="password" id="idP${entrada.id}" value="${entrada.senha}" style="max-width: var(--senhaInp); word-wrap: break-word; text-align: left; background-color: '#e6e6e6'" disabled />
                <td style="border-left: 0px;">
                <img
                    src="./public/playground_assets/closedEyelid.png"
                    style="width: 26px; height: 26px; display: block; cursor: pointer; margin-right: 5px;"
                    id="eye${entrada.id}"
                    onclick="if(idP${entrada.id}.type == 'password'){eye${entrada.id}.style.display='none';eye${entrada.id}Shown.style.display='block';idP${entrada.id}.setAttribute('type','text');}else{eye${entrada.id}.style.display='block';eye${entrada.id}Shown.style.display='none';idP${entrada.id}.setAttribute('type','password');}"
                />
                <img
                    src="./public/playground_assets/openEyelid.png"
                    style="width: 26px; height: 26px; display: none; cursor: pointer; margin-right: 5px;"
                    id="eye${entrada.id}Shown"
                    onclick="if(idP${entrada.id}.type == 'password'){eye${entrada.id}.style.display='none';eye${entrada.id}Shown.style.display='block';idP${entrada.id}.setAttribute('type','text');}else{eye${entrada.id}.style.display='block';eye${entrada.id}Shown.style.display='none';idP${entrada.id}.setAttribute('type','password');}"
                />
                </td>
            </td>
            <td style="min-width: var(--expiraAcoes); max-width: var(--expiraAcoes); margin-left: -5px; word-wrap: break-word; text-align: center; border: none;">${entrada.expira} meses</td>
            <td style="min-width: var(--vb); max-width: var(--vb); margin-left: 5px; word-wrap: break-word; text-align: center; border: none;">&#124;</td>
            <td style="min-width: var(--expiraAcoes); max-width: var(--expiraAcoes); padding-right: 15px; word-wrap: break-word; text-align: center; border: none;">
                <input type="checkbox" id="idC${entrada.id}" class="listarEntradas-checkbox" title="Clique Aqui Para Selecionar Esta Entrada" onchange="if(idC${entrada.id}.checked == true){disableIfChecked(event, ${entrada.id});}else{disableIfChecked(event, 0);}" />
            </td>
            </tr>
        `;
    }); document.getElementById('container3').innerHTML = res;
}

async function repopular(pesquisa){
    res = "";
    if (pesquisa != ('' || null || undefined || [])) {
        //Repopula sem recarregar a página, mas nesse caso, só aparecerão os valores que se encaixam com a Pesquisa
        busca = await Arquivo.pesquisarEntradas(pesquisa);
        busca.forEach((entrada) => {
        res += `
            <tr id="textosTD${entrada.id}">
                <td style="min-width: var(--id); max-width: var(--id); word-wrap: break-word; text-align: center;">${entrada.id}</td>
                <td style="min-width: var(--nomeDescSiteLogin); max-width: var(--nomeDescSiteLogin); word-wrap: break-word; text-align: center;">${entrada.nome}</td>
                <td style="min-width: var(--nomeDescSiteLogin); max-width: var(--nomeDescSiteLogin); word-wrap: break-word; text-align: center;">${entrada.descricao}</td>
                <td style="min-width: var(--nomeDescSiteLogin); max-width: var(--nomeDescSiteLogin); padding-left: 5px; word-wrap: break-word; text-align: center;">${entrada.site}</td>
                <td id="idL${entrada.id}" style="min-width: var(--nomeDescSiteLogin); max-width: var(--nomeDescSiteLogin); word-wrap: break-word; text-align: center;">${entrada.login}</td>
                <td style="min-width: var(--senha); max-width: var(--senha); word-wrap: break-word; text-align: center; border-right: 0px;">
                <input type="password" id="idP${entrada.id}" value="${entrada.senha}" style="max-width: var(--senhaInp); word-wrap: break-word; text-align: left; background-color: '#e6e6e6'" disabled />
                <td style="border-left: 0px;">
                    <img
                    src="./public/playground_assets/closedEyelid.png"
                    style="width: 26px; height: 26px; display: block; cursor: pointer; margin-right: 5px;"
                    id="eye${entrada.id}"
                    onclick="if(idP${entrada.id}.type == 'password'){eye${entrada.id}.style.display='none';eye${entrada.id}Shown.style.display='block';idP${entrada.id}.setAttribute('type','text');}else{eye${entrada.id}.style.display='block';eye${entrada.id}Shown.style.display='none';idP${entrada.id}.setAttribute('type','password');}"
                    />
                    <img
                    src="./public/playground_assets/openEyelid.png"
                    style="width: 26px; height: 26px; display: none; cursor: pointer; margin-right: 5px;"
                    id="eye${entrada.id}Shown"
                    onclick="if(idP${entrada.id}.type == 'password'){eye${entrada.id}.style.display='none';eye${entrada.id}Shown.style.display='block';idP${entrada.id}.setAttribute('type','text');}else{eye${entrada.id}.style.display='block';eye${entrada.id}Shown.style.display='none';idP${entrada.id}.setAttribute('type','password');}"
                    />
                </td>
                </td>
                <td style="min-width: var(--expiraAcoes); max-width: var(--expiraAcoes); margin-left: -5px; word-wrap: break-word; text-align: center; border: none;">${entrada.expira} meses</td>
                <td style="min-width: var(--vb); max-width: var(--vb); margin-left: 5px; word-wrap: break-word; text-align: center; border: none;">&#124;</td>
                <td style="min-width: var(--expiraAcoes); max-width: var(--expiraAcoes); padding-right: 15px; word-wrap: break-word; text-align: center; border: none;">
                <input type="checkbox" id="idC${entrada.id}" class="listarEntradas-checkbox" title="Clique Aqui Para Selecionar Esta Entrada" onchange="if(idC${entrada.id}.checked == true){disableIfChecked(event, ${entrada.id});}else{disableIfChecked(event, 0);}" />
                </td>
            </tr>
            `;
        }); document.getElementById('container3').innerHTML = res;
    } else {
        //Repopula sem recarregar a página, ex: Após apagar uma Entrada ou após apagar a query Pesquisa
        popular();
        busca = "";
    }
}

function disableIfChecked(event, entrada){
    let target = event.target;
    Array.from(document.querySelectorAll('input.listarEntradas-checkbox')).filter(
        element => element !== target
    ).forEach(
        element => { element.disabled = target.checked }
    );

    selecaoAtual = entrada;
    store.set("selecaoAtual", selecaoAtual);
    return selecaoAtual;
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
            ipc.send('mensagem:analise:ppp', (result.feedback.warning + "\n" + result.feedback.suggestions));
            break;
        case 1:
            ipc.send('mensagem:analise:pp', (result.feedback.warning + "\n" + result.feedback.suggestions));
            break;
        case 2:
            ipc.send('mensagem:analise:r', (result.feedback.warning + "\n" + result.feedback.suggestions));
            break;
        case 3:
            ipc.send('mensagem:analise:f', (result.feedback.warning + "\n" + result.feedback.suggestions));
            break;
        case 4:
            ipc.send('mensagem:analise:ff', (result.feedback.warning + "\n" + result.feedback.suggestions));
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
    repopular('');
});

module.exports = { listar, seed, popular, repopular, disableIfChecked, copiar, verF };