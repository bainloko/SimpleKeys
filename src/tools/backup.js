/*
* SimpleKeys
* backup.js
* 22/jun/2022
*/

const fse = require('fs-extra');
const Path = require('path');
const sqlite = require('better-sqlite3-multiple-ciphers');
const bcrypt = require('bcrypt');

const log = require('electron-log');

const config = require('../config/settings.json');

function realizarBackup(nomeArquivo, senhaMestra, configBanco, imprimir){
    //screen5 tirar o nome, a descrição e o registro de data e hora do backup (handle automatically) e criar o novo .db criptografado + paramsconfigbanco
}

export default { realizarBackup };