/*
* SimpleKeys
* editar.js
* 15/set/2022
*/

const Arquivo = require('../App/tools/Arquivo.js');

let lista, selecaoAtual = store.get('selecaoAtual');

async function popular(selecaoAtual){
    lista = await Arquivo.pesquisarByPk(selecaoAtual);
    document.getElementById('IDEnt').innerText = lista['dataValues'].id;
    document.getElementById('inputNomeEnt').value = lista['dataValues'].nome;
    document.getElementById('inputDescEnt').value = lista['dataValues'].descricao;
    document.getElementById('inpSite').value = lista['dataValues'].site;
    document.getElementById('inputLoginEnt').value = lista['dataValues'].login;
    document.getElementById('inpPassword').value = lista['dataValues'].senha;
    document.getElementById('expira').value = lista['dataValues'].expira;
}

module.exports = { popular };