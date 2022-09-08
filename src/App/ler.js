/*
* SimpleKeys
* ler.js
* 07/set/2022
*/

const { dialog } = require('electron');
const { ipcRenderer: ipc } = require('electron-better-ipc');

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
const localChaveiro = document.getElementById("localChaveiro");

function receiveChaveReserva(path){
    let chavePath = path.toString().replace("[\\]", "&#92;");

    if (chavePath != ("" || null || undefined || [])) {
        store.set("pathChaveReserva", chavePath);
        localChaveiro.innerText += chavePath;
    } else {
        alert("Selecione uma Chave para abrir clicando na pasta abaixo da senha!");
    }
}

function receivePath(path){
    let lerPath = path.toString().replace("[\\]", "&#92;");

    if (lerPath != ("" || null || undefined || [])) {
        store.set("pathArquivo", lerPath);
        localChaveiro.innerText += lerPath;
    } else {
        alert("Selecione um arquivo para abrir clicando na pasta abaixo da senha!");
    }
}

function chaveReserva(){
    let options = {
        title: "SimpleKeys - Abrir Arquivo Já Existente",
        defaultPath: "%USERPROFILE%/" || "$HOME/",
        buttonLabel: "Abrir",
        filters: [
            {name: 'Chave Reserva', extensions: ['key']},
            {name: 'All Files', extensions: ['*']}
        ],
        properties: ['openFile']
    }

    dialog.showOpenDialog(WIN, options).then((arquivo) => {
        log.info(arquivo.filePaths);
        store.set("pathChaveReserva", arquivo.filePaths);
        receiveChaveReserva(arquivo.filePaths);
    }).catch((error) => {
        log.info("Houve um erro aqui! " + error);
    });
}

function arquivo(){
    let options = {
        title: "SimpleKeys - Abrir Arquivo Já Existente",
        defaultPath: "%USERPROFILE%/" || "$HOME/",
        buttonLabel: "Abrir",
        filters: [
            {name: 'Banco de Dados', extensions: ['db']},
            {name: 'All Files', extensions: ['*']}
        ],
        properties: ['openFile']
    }

    dialog.showOpenDialog(WIN, options).then((arquivo) => {
        log.info(arquivo.filePaths);
        store.set("pathArquivo", arquivo.filePaths);
        receivePath(arquivo.filePaths);
    }).catch((error) => {
        log.info("Houve um erro aqui! " + error);
    });
}

function validar(lerPath){
    let senha = inpPassword.value;

    (senha == ("" || null || undefined)) ? alert("Digite a senha para acessar o arquivo!") : ipc.send('arquivo:ler', lerPath, senha); 
}

okButton.addEventListener("click", () => {
    let lerPath = store.get("pathArquivo");

    (lerPath != ("" || null || undefined || [])) ? validar(lerPath) : alert("Selecione um arquivo para abrir clicando na pasta abaixo da senha!");
});

module.exports = { chaveReserva, arquivo };