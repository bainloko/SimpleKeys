/*
* SimpleKeys
* ler.js
* 07/set/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');

const Database = require('../database/Database.js');

const Store = require('electron-store');
const store = new Store();

const log = require('electron-log');

const passwordInput = document.getElementById("inpPassword");

const eye = document.getElementById("eye");
const eyeShown = document.getElementById("eyeShown");
let pwShown = false;

eye.addEventListener("click", () => {
    if (pwShown === false){
        eye.style.display = "none";
        eyeShown.style.display = "block";
        passwordInput.setAttribute("type", "text");

        pwShown = true;
    } else {
        eye.style.display = "block";
        eyeShown.style.display = "none";
        passwordInput.setAttribute("type", "password");

        pwShown = false;
    }
});

eyeShown.addEventListener("click", () => {
    if (pwShown === false){
        eye.style.display = "none";
        eyeShown.style.display = "block";
        passwordInput.setAttribute("type", "text");

        pwShown = true;
    } else {
        eye.style.display = "block";
        eyeShown.style.display = "none";
        passwordInput.setAttribute("type", "password");

        pwShown = false;
    }
});

const okButton = document.getElementById("okButton");
const localChave = document.getElementById("localChave");
const localChaveiro = document.getElementById("localChaveiro");

ipc.on('arquivo:ler:receiveChaveReserva', (e, path) => {
    let chavePath = path.toString().replace("[\\]", "&#92;");

    if (chavePath != ("" || null || undefined || [])) {
        store.set("pathChaveReserva", chavePath);
        localChave.innerText = chavePath;
    } else {
        alert("Selecione um Arquivo e/ou uma Chave para abrir clicando na pasta abaixo da senha!");
    }
});

ipc.on('arquivo:ler:receiveArquivo', (e, path) => {
    let lerPath = path.toString().replace("[\\]", "&#92;");

    if (lerPath != ("" || null || undefined || [])) {
        store.set("pathArquivo", lerPath);
        localChaveiro.innerText = lerPath;
    } else {
        alert("Selecione um Arquivo e/ou uma Chave para abrir clicando na pasta abaixo da senha!");
    }
});

function lerArquivo(path, senha){
    try {
        Database.conectar(path, senha);
        ipc.send('arquivo:ler');
    } catch (error){
        log.info("Erro! Possivelmente a senha esta incorreta ou a conexão ao Banco de Dados falhou. Tente novamente! " + error);
        alert("Erro! Possivelmente a senha esta incorreta ou a conexão ao Banco de Dados falhou. Tente novamente! " + error);
    }
}

function validar(lerPath){
    let senha = inpPassword.value;

    (senha == ("" || null || undefined || [])) ? alert("Digite a senha para acessar o arquivo!") : lerArquivo(lerPath, senha);
}

okButton.addEventListener("click", () => {
    let lerPath = localChaveiro.innerText;

    (lerPath != ("" || null || undefined || [])) ? validar(lerPath) : alert("Selecione um arquivo para abrir clicando na pasta abaixo da senha!");
});