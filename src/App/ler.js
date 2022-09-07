/*
* SimpleKeys
* ler.js
* 07/09/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');

const Store = require('electron-store');
const store = new Store();

const passwordInput = document.getElementById("inpPassword");

const eye = document.getElementById("eye");
const eyeShown = document.getElementById("eyeShown");
var pwShown = false;

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

ipc.on('arquivo:ler:receiveChaveReserva', (e, path) => {
    let chavePath = path.toString().replace("[\\]", "&#92;");

    if (chavePath != ("" || null || undefined || [])){
        store.set('pathChaveReserva', chavePath);
        localChaveiro.innerText = chavePath;
    } else {
        alert("Selecione um arquivo para abrir clicando na pasta abaixo da senha!");
    }
});

ipc.on('arquivo:ler:receivePath', (e, path) => {
    let lerPath = path.toString().replace("[\\]", "&#92;");

    if (lerPath != ("" || null || undefined || [])){
        store.set('pathArquivo', lerPath);
        localChaveiro.innerText = lerPath;
    } else {
        alert("Selecione um arquivo para abrir clicando na pasta abaixo da senha!");
    }
});

function validar(){
    let lerPath = store.get('pathArquivo');
    let senha = inpPassword.value;

    (senha == ("" || null || undefined)) ? alert("Digite a senha para acessar o arquivo!") : ipc.send('arquivo:ler', lerPath, senha); 
}

okButton.addEventListener("click", () => {
    (lerPath != ("" || null || undefined || [])) ? validar() : alert("Selecione um arquivo para abrir clicando na pasta abaixo da senha!");
});

ipc.on('arquivo:ler', (e, lerPath, senha) => {
    try {
        if (arquivo.lerArquivo(lerPath, senha)) { //
            criarListaEntradas();
            lerArquivo.close();
            app.focus();
        } else {
            log.info("Erro! Possivelmente a senha está incorreta. Tente novamente!");
            alert("Erro! Possivelmente a senha está incorreta. Tente novamente!");
            lerArquivo.focus();
        }
    } catch (error) {
        log.info("Erro! Possivelmente a senha está incorreta. Tente novamente! " + error);
        alert("Erro! Possivelmente a senha está incorreta. Tente novamente! " + error);
        lerArquivo.focus();
    }
});