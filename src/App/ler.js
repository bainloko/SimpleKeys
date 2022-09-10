/*
* SimpleKeys
* ler.js
* 07/set/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');

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

ipc.on('arquivo:ler:receiveChaveReserva', (e, path) => {
    let chavePath = path.toString().replace("[\\]", "&#92;");

    if (chavePath != ("" || null || undefined || [])) {
        store.set("pathChaveReserva", chavePath);
        localChave.innerText = chavePath;
        localChave.title = chavePath;
    } else {
        alert("Selecione um Arquivo e/ou uma Chave para abrir clicando na pasta abaixo da senha!");
    }
});

ipc.on('arquivo:ler:pathArquivo', (e, path) => {
    let lerPath = path.toString().replace("[\\]", "&#92;");

    if (lerPath != ("" || null || undefined || [])) {
        store.set("pathArquivo", lerPath);
        localChaveiro.innerText = lerPath;
        localChaveiro.title = lerPath;
    } else {
        alert("Selecione um Arquivo e/ou uma Chave para abrir clicando na pasta abaixo da senha!");
    }
});

function validar(path){
    let senha = inpPassword.value;

    (senha != ("" || null || undefined || [])) ? ipc.send('arquivo:ler', path, senha) : alert("Digite a senha para acessar o arquivo!");
}

okButton.addEventListener("click", () => {
    let lerPath = localChaveiro.innerText;

    (lerPath != ("" || null || undefined || [])) ? validar(lerPath) : alert("Selecione um arquivo para abrir clicando na pasta abaixo da senha!");
});