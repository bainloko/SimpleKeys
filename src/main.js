/*
* SimpleKeys
* main.js
* 8/jun/2022
*/

// Módulos para controlar o ciclo de vida da aplicação e criar a janela nativa do Browser
import { app, BrowserWindow, webContents, BrowserView, Menu, ipcMain, dialog, Notification, safeStorage, systemPreferences, clipboard } from 'electron';

import fse from 'fs-extra';
import Path from 'path';

// import editJson from 'electron-json-storage';
// import settings from 'electron-settings';
import log from 'electron-log';

// new Notification("Senha...", {
//     body: "Senha...",    
// });

const lock = app.requestSingleInstanceLock();
(!lock) ? app.quit() : console.log("Aplicativo inicializando!"); 

let telaInicial
let novoArquivo
let outroArquivo
let listaEntradas
let novaEntrada
let gerador
let backup
let configuracoes
let sobre

const opcoesMenu = [
    // Cada objeto é um dropdown
    {
        label: 'Arquivo',
        submenu: [
            {
                label: 'Novo Arquivo',
                click(){
                    criarNovoArquivo();
                }
            },
            {
                label: 'Abrir Arquivo Já Existente',
                click(){
                    criarOutroArquivo();
                }
            },
            {
                label: 'Fechar Arquivo',
                click(){
                    //Salvar, criptografar, limpar área de transferência e telaInicial.setBrowserView(telaInicial);
                }
            },
            {
                label: 'Salvar Como',
                submenu: [
                    //Abrir explorer
                ],
            },
            {
                label: 'Alterar Senha Mestra',
                click(){
                    //Salvar, navegar para alterarSenha e validar, criptografar banco, limpar área de transferência telaInicial.setBrowserView(telaInicial);
                },
            },
            {
                label: 'Backup',
                click(){
                    criarBackup();
                },
            },
            // { FUNCIONALIDADE FUTURA
            //     label: 'Importar',
            //     click(){

            //     },
            // },
            // {
            //     label: 'Exportar',
            //     click(){

            //     },
            // },
            {
                label: 'Trancar Arquivo',
                click(){
                    //Salvar, criptografar, limpar área de transferência e telaInicial.setBrowserView(telaInicial);
                },
            },
            {
                label: 'Sair',
                click(){
                    app.quit();
                },
            },
        ]
    },

    {
        label: 'Entradas',
        submenu: [
            {
                label: 'Copiar Usuário',
                click(){
                    //JS
                },
            },
            {
                label: 'Copiar Senha',
                click(){
                    //JS
                },
            },
            {
                label: 'Copiar Campos',
                submenu: [
                    {
                        label: 'Copiar Link',
                        click(){
                            //JS
                        },
                    },
                    {
                        label: 'Copiar Descrição',
                        click(){
                            //JS
                        },
                    },
                ]
            },
            {
                label: 'Adicionar Entrada',
                click(){
                    criarNovaEntrada();
                }
            },
            {
                label: 'Editar Entrada',
                click(){
                    //Abre nova janelinha editarEntrada.html
                },
            },
            {
                label: 'Deletar Entrada(s)',
                click(){
                    //Are you sure?
                },
            },
            {
                label: 'Selecionar Tudo',
                click(){
                    //JS
                },
            },
        ]
    },

    {
        label: 'Encontrar',
        submenu: [
            {
                label: 'Encontrar',
                click(){
                    //Barra de pesquisa
                },
            },
            {
                label: 'Expiradas',
                click(){
                    //Filtro expiradas
                },
            },
            {
                label: 'Recentemente Modificadas',
                click(){
                    //Filtro recentemente modificadas
                },
            },
            {
                label: 'Senhas Duplicadas ou Similares',
                click(){
                    //JS
                }
            },
        ]
    },

    {
        label: 'Ver',
        submenu: [
            {
                label: 'Alterar Idioma',
                click(){
                    //Abre nova janelinha idiomas.html
                },
            },
            {
                label: 'Configurar Colunas',
                click(){
                    //JS
                },
            },
            {
                label: 'Reordenar, Filtrar...',
                click(){
                    //JS
                },
            },
        ]
    },

    {
        label: 'Ferramentas',
        submenu: [
            {
                label: 'Gerar Senhas',
                click(){
                    criarGerador();
                },
            },
            {
                label: 'Configurações',
                click(){
                    criarConfiguracoes();
                },
            },
            {
                label: 'Ajuda',
                submenu: [
                    {
                        label: 'Verificar novas Atualizações',
                        click(){
                            //JS
                        },
                    },
                    {
                        label: 'Sobre o SimpleKeys, Links de Ajuda',
                        click(){
                            criarSobre();
                        },
                    },
                ]
            },
        ]
    },
]

const criarTelaInicial = () => {
    // Cria a tela inicial
    telaInicial = new BrowserWindow({
        width: 1280,
        height: 720,
        resizable: false,
        title: "SimpleKeys",
        webPreferences: {
            devTools: !app.isPackaged,
            nodeIntegration: false,
            contextIsolation: true,
            preload: './preload.js',
            render: './render.js'
        }
    });

    // e carrega a tela padrão do App
    telaInicial.loadFile('./views/index.html');

    // Cria o template do menu
    const menu = Menu.buildFromTemplate(opcoesMenu);

    // Insere o menu
    Menu.setApplicationMenu(menu);
}

function criarNovoArquivo(){
    novoArquivo = new BrowserView();

    telaInicial.setBrowserView(novoArquivo);
    novoArquivo.setBounds({ x: 0, y: 0 });
    novoArquivo.webContents.loadFile('./views/novoArquivo.html');
    
    //se senha OK, criarListaEntradas();
}

function criarOutroArquivo(){
    outroArquivo = new BrowserWindow({
        width: 600,
        height: 180,
        resizable: false,
        parent: telaInicial,
        title: "SimpleKeys - Abrir Arquivo Já Existente",
        webPreferences: {
            devTools: !app.isPackaged,
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    outroArquivo.loadFile('./views/outroArquivo.html');
    outroArquivo.setBounds({ x: 320, y: 360 });

    outroArquivo.on('close', () => {
        outroArquivo = null;
        //se senha OK, criarListaEntradas();
    });
}

function criarListaEntradas(){
    listaEntradas = new BrowserView();

    telaInicial.setBrowserView(listaEntradas);
    listaEntradas.setBounds({ x: 0, y: 0 });
    listaEntradas.webContents.loadFile('./views/listaEntradas.html');
}

function criarNovaEntrada(){
    novaEntrada = new BrowserView();

    telaInicial.setBrowserView(novaEntrada);
    novaEntrada.setBounds({ x: 0, y: 0 });
    novaEntrada.webContents.loadFile('./views/novaEntrada.html');
}

function criarGerador(){
    gerador = new BrowserView();

    telaInicial.setBrowserView(gerador);
    gerador.setBounds({ x: 0, y: 0 });
    gerador.webContents.loadFile('./views/gerador.html');
}

function criarBackup(){
    backup = new BrowserView();

    telaInicial.setBrowserView(backup);
    backup.setBounds({ x: 0, y: 0 });
    backup.webContents.loadFile('./views/backup.html');
}

function criarConfiguracoes(){
    configuracoes = new BrowserView();

    telaInicial.setBrowserView(configuracoes);
    configuracoes.setBounds({ x: 0, y: 0 });
    configuracoes.webContents.loadFile('./views/configuracoes.html');
}

function criarSobre(){
    sobre = new BrowserWindow({
        width: 600,
        height: 180,
        resizable: false,
        parent: telaInicial,
        title: "SimpleKeys - Ajuda, Sobre",
        webPreferences: {
            devTools: !app.isPackaged,
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    sobre.loadFile('./views/sobre.html');
    sobre.setBounds({ x: 320, y: 360 });

    sobre.on('close', () => {
        sobre = null;
    });
}

// Captura o Add realizado com sucesso e fecha a tela
// ipcMain.on('', function(e, item){
//     telaInicial.webContents.send('', item);
//     novoArquivo.close();
// });

app.whenReady().then(() => {
    log.info("Aplicativo aberto!");
    criarTelaInicial();
});

app.on('window-all-closed', () => {
    // Fecha o App
    app.quit();
});