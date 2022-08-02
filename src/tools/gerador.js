/*
* SimpleKeys
* gerador.js
* 8/jun/2022
*/

import fse from 'fs-extra';
import Path from 'path';

import log from 'electron-log';

const caracteres = {
    upperCase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowerCase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "'!@#$%^&*()_-+=`~/?{}[]:;><,."
}

const getChar = [
    function upperCase(){
        return caracteres.upperCase[Math.floor(Math.random() * caracteres.upperCase.length)];
    },
    
    function lowerCase(){
        return caracteres.lowerCase[Math.floor(Math.random() * caracteres.lowerCase.length)];
    },
    
    function numbers(){
        return caracteres.numbers[Math.floor(Math.random() * caracteres.numbers.length)];
    },

    function symbols(){
        return caracteres.symbols[Math.floor(Math.random() * caracteres.symbols.length)];
    }
];

// comprimento mínimo de 3 caracteres, quantidade mínima de 1. limitar entradas inválidas
async function gerarSenhas(comprimentoSenha, qtdSenhas, upperCase, lowerCase, numbers, symbols){
    try {
        if ((upperCase && lowerCase && numbers && symbols) === false){
            return alert("Por favor, selecione algum tipo de caractere para a geração da(s) senha(s)!");
        } else {
            let Senhas, senha;
            for (let i = 0; i < qtdSenhas; i++){
                while (comprimentoSenha > Senhas[i].length){
                    let charToAdd = getChar[Math.floor(Math.random() * getChar.length)];
                    let isChecked = charToAdd.name;
                    if (isChecked){
                        senha += charToAdd();
                    }
                }

                Senhas[i] += senha;
            }

            return Senhas;
        }
    } catch (error){
        log.error("Ocorreu um erro inesperado na geração das senhas!");
        alert("Ocorreu um erro inesperado na geração das senhas!");
    }
}

export default { gerarSenhas };