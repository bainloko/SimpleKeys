/*
* SimpleKeys
* cadastrar.js
* 15/set/2022
*/

const Arquivo = require('../App/tools/Arquivo.js');

async function cadastrar(){
    Arquivo.cadastrarEntrada(document.getElementById('inputNomeEnt').value.trim(), document.getElementById('inputDescEnt').value.trim(), document.getElementById('inpSite').value.trim(), document.getElementById('inputLoginEnt').value.trim(), document.getElementById('inpPassword').value, document.getElementById('expira').value);
}

module.exports = { cadastrar };