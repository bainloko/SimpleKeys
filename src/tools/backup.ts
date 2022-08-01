/*
* SimpleKeys
* backup.ts
* 22/jun/2022
*/

import fse from 'fs-extra';
import Path from 'path';
import Sequelize from 'sequelize';
import sqlite from 'better-sqlite3-multiple-ciphers';
import cryptoJs from 'crypto-js';

import log from 'electron-log';

import config from '../config/settings.json';

function realizarBackup(nomeArquivo: string, senhaMestra: String, configBanco: string, imprimir: boolean){
    //screen5 tirar o nome, a descrição e o registro de data e hora do backup (handle automatically) e criar o novo .db criptografado + paramsconfigbanco
}

export default { realizarBackup };