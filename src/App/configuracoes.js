/*
* SimpleKeys
* configuracoes.js
* 29/jun/2022
*/

const { ipcRenderer: ipc } = require('electron-better-ipc'); //work on that -> configuracoes

const Settings = require('../model/Settings.js');

const log = require('electron-log');

async function lerConfiguracoes(configBanco){
    // path? copiar para a pasta do usuário? lookup json e edição?
}

async function alterarConfiguracoes(configBanco){
    // path? copiar para a pasta do usuário? lookup json e edição?
}

async function restaurarPadrao(){
    // path? copiar para a pasta do usuário? lookup json e edição?
}

module.exports = { lerConfiguracoes, alterarConfiguracoes, restaurarPadrao, Settings };