/*
* SimpleKeys
* configuracoes.ts
* 29/jun/2022
*/

import fse from 'fs-extra';
import Path from 'path';

import editJson from 'electron-json-storage';
import settings from 'electron-settings';
import log from 'electron-log';

async function lerConfiguracoes(configBanco: string, configSoftware: string){
    // path? copiar para a pasta do usuário? lookup json e edição?
}

async function alterarConfiguracoes(configBanco: string, configSoftware: string){
    // path? copiar para a pasta do usuário? lookup json e edição?
}

export default { lerConfiguracoes, alterarConfiguracoes };