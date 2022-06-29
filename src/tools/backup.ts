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
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

function realizarBackup(nomeArquivo: string, senhaMestra: String, configBanco: string, imprimir: boolean){
    //
}

export default { realizarBackup };