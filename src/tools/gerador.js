/*
* SimpleKeys
* gerador.js
* 8/jun/2022
*/

// const log = require('electron-log');

const lowerCaseChr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const upperCaseChr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const numbersChr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const symbolsChr = ["'", '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '-', '+', '=', '`', '~', '/', '?', '{', '}', '[', ']', ':', ';', '<', '>', ',', '.'];

function generate(){
    let l, u, n, s;
    
    if (lowerCase.checked === true){
        l = true;
    } else if (upperCase.checked === true){
        u = true;
    } else if (numbers.checked === true){
        n = true;
    } else if (symbols.checked === true){
        s = true;
    } else {
        alert("Por favor, digite SOMENTE números válidos e selecione algum tipo de caractere para a geração da(s) senha(s)!");
    } //filtrar depois
}

// quantidade mínima de 1 senha, comprimento mínimo de 4 caracteres
function gerarSenhas(){
    let qtdSenhas = document.getElementById("qtdSenhas");
    let comprimentoSenha = document.getElementById("comprimentoSenha");
    let lowerCase = document.getElementById("lowerCase");
    let upperCase = document.getElementById("upperCase");
    let numbers = document.getElementById("numbers");
    let symbols = document.getElementById("symbols");

    try {
        if ((!(lowerCase.checked && upperCase.checked && numbers.checked && symbols.checked === false) && (((lowerCase.checked || upperCase.checked || numbers.checked || symbols.checked) === true) && (qtdSenhas.value >= 1 && qtdSenhas.value <= 30 && comprimentoSenha.value >= 4 && comprimentoSenha.value <= 256))) === true){
            var Senhas = ["", "\n"], senha = "";

            for (let i = 0; i < qtdSenhas.value; i++){
                while (comprimentoSenha.value > senha.length){
                    senha += generate();
                }

                Senhas[i] += senha;
            }

            document.getElementById("listaSenhas").innerText = Senhas.join("\n");
            return Senhas.join("\n");
        } else {
            alert("Por favor, digite SOMENTE números válidos e selecione algum tipo de caractere para a geração da(s) senha(s)!");
        }
    } catch (error){
        // log.error("Ocorreu um erro inesperado na geração das senhas! " + error);
        alert("Ocorreu um erro inesperado na geração das senhas! " + error);
    }
}
