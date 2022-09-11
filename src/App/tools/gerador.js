/*
* SimpleKeys
* gerador.js
* 8/jun/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');
const ContextMenu = require('secure-electron-context-menu').default;

const log = require('electron-log');

const lowerCaseChr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const upperCaseChr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const numbersChr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const symbolsChr = ["'", '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '-', '+', '=', '`', '~', '/', '?', '{', '}', '[', ']', ':', ';', '<', '>', ',', '.'];

function generate(size){
    let l = "", u = "", n = "", s = "", r = "";

    for (let i = 0; i < size; i++){
        while (size > r.length){
            (lowerCase.checked === true) ? l = lowerCaseChr[Math.floor(Math.random() * lowerCaseChr.length)] : log.info("Letra minuscula usada!");
            (upperCase.checked === true) ? u = upperCaseChr[Math.floor(Math.random() * upperCaseChr.length)] : log.info("Letra maiuscula usada!");
            (numbers.checked === true) ? n = numbersChr[Math.floor(Math.random() * numbersChr.length)] : log.info("Numero usado!");
            (symbols.checked === true) ? s = symbolsChr[Math.floor(Math.random() * symbolsChr.length)] : log.info("Simbolo usado!");

            (size > r.length) ? r += l : r.slice(0, size - 1);
            (size > r.length) ? r += u : r.slice(0, size - 1);
            (size > r.length) ? r += n : r.slice(0, size - 1);
            (size > r.length) ? r += s : r.slice(0, size - 1);
        }
    }

    r = [...r].sort(() => Math.random() - .5).join('');
    return r;
}

function gerarSenhas(){
    let qtdSenhas = document.getElementById("qtdSenhas");
    let comprimentoSenha = document.getElementById("comprimentoSenha");
    let lowerCase = document.getElementById("lowerCase");
    let upperCase = document.getElementById("upperCase");
    let numbers = document.getElementById("numbers");
    let symbols = document.getElementById("symbols");

    try {
        if ((((!(lowerCase.checked && upperCase.checked && numbers.checked && symbols.checked && false === false) && ((lowerCase.checked || upperCase.checked || numbers.checked || symbols.checked) === true)) || (lowerCase.checked && upperCase.checked && numbers.checked && symbols.checked) === true) && ((qtdSenhas.value >= 1 && qtdSenhas.value <= 30 && comprimentoSenha.value >= 4 && comprimentoSenha.value <= 256))) === true) {
            let Senhas = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""], senha = "";

            for (let i = 0; i < qtdSenhas.value; i++){
                while (comprimentoSenha.value > senha.length){
                    senha += generate(comprimentoSenha.value);
                }

                Senhas[i] += senha;
                senha = "";
            }

            document.getElementById("listaSenhas").innerHTML = Senhas.join("\n");
            return Senhas.join('\n');
        } else {
            alert("Por favor, digite SOMENTE números válidos e selecione algum tipo de caractere para a geração da(s) senha(s)!");
        }
    } catch (error){
        log.error("Ocorreu um erro inesperado na geracao das senhas! " + error);
        alert("Ocorreu um erro inesperado na geração das senhas! " + error);
    }
}

module.exports = { gerarSenhas };