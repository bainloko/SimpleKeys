/*
* SimpleKeys
* backup.ts
* 22/jun/2022
*/

import fse from 'fs-extra';
import Path from 'path';
import Sequelize from 'sequelize';
import sqlite from 'sqlite';
import sqliteNext from 'sqlite3-offline-next';
import bcrypt from 'bcryptjs';

function realizarBackup(nomeArquivo: string, senhaMestra: String, configBanco: string, imprimir: boolean){
    //screen5 tirar o nome, a descrição e o registro de data e hora do backup (handle automatically) e criar o novo .db criptografado + paramsconfigbanco
}

export default { realizarBackup };