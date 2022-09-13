/*
* SimpleKeys
* ler.js
* 07/set/2022
*/

const { dialog } = require('electron');
const { ipcRenderer: ipc } = require('electron-better-ipc');
const ContextMenu = require('secure-electron-context-menu').default; //work on that -> Notification, ContextMenu

const Store = require('electron-store');
const store = new Store();

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
const localChaveiroCheckbox = document.getElementById("localChaveiroCheckbox");

ipc.on('arquivo:ler:receiveChaveReserva', (e, path) => {
    let chavePath = path.toString().replace("[\\]", "&#92;");

    if (chavePath != ("" || null || undefined || [])) {
        store.set("pathChaveReserva", chavePath);
        localChave.innerText = chavePath;
        localChave.title = chavePath;
    } else {
        dialog.showErrorBox("Erro!", "Selecione um Arquivo e/ou uma Chave para abrir clicando na pasta abaixo da senha!");
    }
});

ipc.on('arquivo:ler:pathArquivo', (e, path) => {
    let lerPath = path.toString().replace("[\\]", "&#92;");

    if (lerPath != ("" || null || undefined || [])) {
        store.set("pathArquivo", lerPath);
        store.set("nomeArquivo", lerPath.slice(0, (lerPath.length - 3)).substring((lerPath.lastIndexOf("\\") + 1)));
        localChaveiro.innerText = lerPath;
        localChaveiro.title = lerPath;
        localChaveiroCheckbox.checked = true;
    } else {
        dialog.showErrorBox("Erro!", "Selecione um Arquivo e/ou uma Chave para abrir clicando na pasta abaixo da senha!");
    }
});

function setar(path, senha){
    if ((path && senha) != ("" || null || undefined || [])) {
        localChaveiroCheckbox.checked = true;
        store.set("senhaArquivo", senha);
    } else {
        dialog.showErrorBox("Erro!", "Selecione um Arquivo para abrir clicando na pasta abaixo da senha!");
    }
}

okButton.addEventListener("click", () => {
    let lerPath = store.get("pathArquivo");
    let senha = passwordInput.value;

    (lerPath != ("" || null || undefined || [])) ? setar(lerPath, senha) : dialog.showErrorBox("Erro!", "Selecione um Arquivo para abrir clicando na pasta abaixo da senha!");
});