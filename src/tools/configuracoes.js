/*
* SimpleKeys
* configuracoes.js
* 29/jun/2022
*/

import fse from 'fs-extra';
import Path from 'path';

import editJson from 'electron-json-storage';
import settings from 'electron-settings';
import log from 'electron-log';

import config from '../config/settings.json';

async function lerConfiguracoes(configBanco){
    // path? copiar para a pasta do usuário? lookup json e edição?
}

async function alterarConfiguracoes(configBanco){
    // path? copiar para a pasta do usuário? lookup json e edição?
}

async function restaurarPadrao(){
    // path? copiar para a pasta do usuário? lookup json e edição?
}

export default { lerConfiguracoes, alterarConfiguracoes, restaurarPadrao };