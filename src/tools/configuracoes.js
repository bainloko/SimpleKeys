/*
* SimpleKeys
* configuracoes.js
* 29/jun/2022
*/

const fse = require('fs-extra');
const Path = require('path');

const log = require('electron-log');

const electronStore = require('electron-store');

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