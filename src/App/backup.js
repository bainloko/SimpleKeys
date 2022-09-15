/*
* SimpleKeys
* backup.js
* 22/jun/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc'); //work on that -> backup

const Entradas = require('../model/Entradas.js');

const log = require('electron-log');

function realizarBackup(nomeArquivo, senhaMestra, configBanco, imprimir){
    //screen5 tirar o nome, a descrição e o registro de data e hora do backup (handle automatically) e criar o novo .db criptografado
}

module.exports = { realizarBackup, Entradas };