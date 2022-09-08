/*
* SimpleKeys
* ler.js
* 07/set/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');

const Database = require('../../database/Database.js');

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
    if (path != ("" || null || undefined || [])) {
        store.set("pathChaveReserva", path);
        localChave.innerHTML = path;
    } else {
        alert("Selecione uma Chave para abrir clicando na pasta abaixo da senha!");
    }
});

ipc.on('arquivo:ler:receiveArquivo', (e, path) => {
    if (path != ("" || null || undefined || [])) {
        store.set("pathArquivo", path);
        localChaveiro.innerHTML = path;
    } else {
        alert("Selecione um arquivo para abrir clicando na pasta abaixo da senha!");
    }
});

function lerArquivo(path, senha){
    try {
        if (Database.conectar(path, senha) == true) {
            ipc.send('arquivo:ler');
        } else {
            log.info("Erro! Possivelmente a senha esta incorreta. Tente novamente!");
            alert("Erro! Possivelmente a senha está incorreta. Tente novamente!");
        }
    } catch (error){
        log.info("Erro! Possivelmente a senha está incorreta. Tente novamente! " + error);
        alert("Erro! Possivelmente a senha está incorreta. Tente novamente! " + error);
    }
}

function validar(lerPath){
    let senha = inpPassword.value;

    (senha == ("" || null || undefined)) ? alert("Digite a senha para acessar o arquivo!") : lerArquivo(lerPath, senha); 
}

okButton.addEventListener("click", () => {
    let lerPath = store.get("pathArquivo");

    (lerPath != ("" || null || undefined || [])) ? validar(lerPath) : alert("Selecione um arquivo para abrir clicando na pasta abaixo da senha!");
});

module.exports = { chaveReserva, arquivo };