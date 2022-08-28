/*
* SimpleKeys
* backup.js
* 22/jun/2022
*/

const fse = require('fs-extra');
const Path = require('path');

const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const log = require('electron-log');

const config = require('../config/settings.json');

function realizarBackup(nomeArquivo, senhaMestra, configBanco, imprimir){
    //screen5 tirar o nome, a descrição e o registro de data e hora do backup (handle automatically) e criar o novo .db criptografado
}

export default { realizarBackup };