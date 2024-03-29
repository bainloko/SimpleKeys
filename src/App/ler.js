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
    if (pwShown == false){
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
    if (pwShown == false){
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
        ipc.send('mensagem:local:erro2');
    }
});

ipc.on('arquivo:ler:pathArquivo', (e, path) => {
    let lerPath = path.toString().replace("[\\]", "&#92;");

    if (lerPath != ("" || null || undefined || [])) {
        store.set("pathArquivo", lerPath);
        store.set("nomeArquivo", lerPath.slice(0, (lerPath.length - 3)).substring((lerPath.lastIndexOf("\\") + 1)));
        store.set("refArquivo", lerPath);
        localChaveiro.innerText = lerPath;
        localChaveiro.title = lerPath;
        localChaveiroCheckbox.checked = true;
    } else {
        ipc.send('mensagem:local:erro2');
    }
});

function setar(path, senha){
    if ((path && senha) != ("" || null || undefined || [])) {
        localChaveiroCheckbox.checked = true;
        localStorage.setItem('senha', senha);
    } else {
        ipc.send('mensagem:local:erro3');
    }
}

okButton.addEventListener("click", () => {
    let lerPath = store.get("pathArquivo");
    let senha = passwordInput.value;

    (lerPath != ("" || null || undefined || [])) ? setar(lerPath, senha) : ipc.send('mensagem:local:erro3');
});