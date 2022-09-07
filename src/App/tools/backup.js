/*
* SimpleKeys
* backup.js
* 22/jun/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc');

const fse = require('fs-extra');
const Path = require('path');

const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const Store = require('electron-store');
const store = new Store();

const log = require('electron-log');

function realizarBackup(nomeArquivo, senhaMestra, configBanco, imprimir){
    //screen5 tirar o nome, a descrição e o registro de data e hora do backup (handle automatically) e criar o novo .db criptografado
}

export default { realizarBackup };