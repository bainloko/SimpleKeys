/*
* SimpleKeys
* main.js
* 8/jun/2022
*/

// Módulos para controlar o ciclo de vida da aplicação e criar a janela nativa do Browser
const { app, BrowserWindow, BrowserView, Menu, dialog, Notification, systemPreferences, clipboard, webContents } = require('electron');
const { ipcMain: ipc } = require('electron-better-ipc');
const ContextMenu = require("secure-electron-context-menu").default;
const { showAboutWindow } = require('electron-util');

const log = require('electron-log');

const electronStore = require('electron-store');

let telaInicial = null;
let novoArquivo = null;
let lerArquivo = null;
let listaEntradas = null;
let novaEntrada = null;
let gerador = null;
let backup = null;
let configuracoes = null;

const isDev = process.env.NODE_ENV === "development";
const lock = app.requestSingleInstanceLock();
(!lock) ? app.quit() : log.info("Aplicativo inicializando!"); //o App já está aberto!

const criarTelaInicial = () => {
    // Cria a tela inicial
    telaInicial = new BrowserWindow({
        width: 1280,
        height: 749,
        resizable: false,
        title: "SimpleKeys",
        webPreferences: {
            devTools: !app.isPackaged,
            contextIsolation: false,
            nodeIntegration: true,
            preload: './preload.js'
        }
    });

    ContextMenu.mainBindings(ipc, telaInicial, Menu, isDev, {
        "alertTemplate": [{
            id: "alert",
            label: "AN ALERT!"
        }]
    });

    // window.api.contextMenu.onReceive("alert", function(args) {
    //     ?
    // });

    // e carrega a tela padrão do App
    telaInicial.loadFile('src/views/index.html');

    // new Notification("Senha...", {
    //     body: "Senha...",
    // });

    telaInicial.on('closed', () => {
        app.quit();
    });
}

ipc.on('opcao:criar', (e) => {
    try {
        criarNovoArquivo();
    } catch (error){
        log.info("Houve um erro no carregamento da tela novoArquivo, " + error);
    }
});

ipc.on('opcao:abrir', (e) => {
    try {
        criarLerArquivo();
    } catch (error){
        log.info("Houve um erro no carregamento da tela lerArquivo, " + error);
    }
});

ipc.on('opcao:config', (e) => {
    try {
        criarConfiguracoes();
    } catch (error){
        log.info("Houve um erro no carregamento da tela configuracoes, " + error);
    }
});

ipc.on('opcao:sobre', (e) => {
    try {
        criarSobre();
    } catch (error){
        log.info("Houve um erro no carregamento da tela sobre, " + error);
    }
});

function criarNovoArquivo(){
    novoArquivo = new BrowserView();
    novoArquivo.webContents.loadFile('src/views/novoArquivo.html');
    novoArquivo.setBounds({ x: 0, y: 0 });
    telaInicial.setBrowserView(novoArquivo);
}

ipc.on('arquivo:criar', (e, item) => {
    telaInicial.webContents.send('arquivo:criar', item);
    log.info(e);

    novoArquivo = null;
    criarListaEntradas();
});

ipc.on('arquivo:novo:path', (e, item) => {
    telaInicial.webContents.session.on('will-download', download => {
        download.once('done', e => {
            localStorage.setItem("path", item);
        })

        log.info(e);
    });

    log.info(e);
});

function criarLerArquivo(){
    lerArquivo = new BrowserWindow({
        width: 536,
        height: 389,
        resizable: false,
        parent: telaInicial,
        title: "SimpleKeys - Abrir Arquivo Já Existente",
        webPreferences: {
            devTools: !app.isPackaged,
            contextIsolation: false,
            nodeIntegration: true
        }
    });

    lerArquivo.loadFile('src/views/lerArquivo.html');
}

ipc.on('arquivo:ler', (e, item) => {
    lerArquivo.webContents.send('arquivo:ler', item);
    lerArquivo = null;
    //se senha OK, criarListaEntradas();
});

function criarListaEntradas(){
    listaEntradas = new BrowserView(); //
    listaEntradas.webContents.loadFile('src/views/listaEntradas.html');
    listaEntradas.setBounds({ x: 0, y: 0 });
    telaInicial.setBrowserView(listaEntradas);

    // Cria o template do menu
    const menu = Menu.buildFromTemplate(opcoesMenu);

    // Insere o menu
    Menu.setApplicationMenu(menu);
}

function criarNovaEntrada(){
    novaEntrada = new BrowserView();
    novaEntrada.webContents.loadFile('src/views/novaEntrada.html');
    novaEntrada.setBounds({ x: 0, y: 0 });
    telaInicial.setBrowserView(novaEntrada);
}

function criarGerador(){
    gerador = new BrowserView();
    gerador.webContents.loadFile('src/views/gerador.html');
    gerador.setBounds({ x: 0, y: 0 });
    telaInicial.setBrowserView(gerador);
}

function criarBackup(){
    backup = new BrowserView(); //
    backup.webContents.loadFile('src/views/backup.html');
    backup.setBounds({ x: 0, y: 0 });
    telaInicial.setBrowserView(backup);
}

function criarConfiguracoes(){
    configuracoes = new BrowserView(); //
    configuracoes.webContents.loadFile('src/views/configuracoes.html');
    configuracoes.setBounds({ x: 0, y: 0 });
    telaInicial.setBrowserView(configuracoes);
}

function criarSobre(){
    showAboutWindow({
        icon: 'src/views/public/favicon/favicon-48x48.png',
        copyright: 'Copyright © 2022 - Kauã Maia (bainloko)',
        text: 'Beta Fechado\n\nLinks e instruções para aprender a usar o programa e se proteger melhor na internet: https://github.com/bainloko/SimpleKeys \nPara ver o histórico de um Banco de Dados, veja os registros na pasta Documentos no Windows e Home no Linux.\nEm caso de dúvida, envie um e-mail para kaua.maia177@gmail.com \n\nTCC/TI de Kauã Maia Cousillas para o Instituto Federal Sul-rio-grandense 𝘊𝘢𝘮𝘱𝘶𝘴 Bagé.',
        website: 'https://github.com/bainloko/SimpleKeys'
    });
}

const opcoesMenu = [
    // Cada objeto é um dropdown
    {
        label: 'Arquivo',
        submenu: [
            {
                label: 'Novo Arquivo',
                click(){ criarNovoArquivo(); }
            },
            {
                label: 'Abrir Arquivo Já Existente',
                click(){ criarLerArquivo(); }
            },
            {
                label: 'Fechar Arquivo',
                click(){ /* Salvar, criptografar, limpar área de transferência e telaInicial.setBrowserView(telaInicial); */ }
            },
            {
                label: 'Salvar Como',
                submenu: [
                    //Abrir explorer
                ],
            },
            {
                label: 'Alterar Senha Mestra',
                click(){ /* Salvar, navegar para alterarSenha e validar, criptografar banco, limpar área de transferência telaInicial.setBrowserView(telaInicial); */ },
            },
            {
                label: 'Backup',
                click(){ criarBackup(); },
            },
            // { FUNCIONALIDADE FUTURA
            //     label: 'Importar',
            //     click(){  },
            // },
            // {
            //     label: 'Exportar',
            //     click(){  },
            // },
            {
                label: 'Trancar Arquivo',
                click(){ /* Salvar, criptografar, limpar área de transferência e telaInicial.setBrowserView(telaInicial); */ },
            },
            {
                label: 'Sair',
                click(){ app.quit(); },
            },
        ]
    },

    {
        label: 'Entradas',
        submenu: [
            {
                label: 'Copiar Usuário',
                click(){  },
            },
            {
                label: 'Copiar Senha',
                click(){  },
            },
            {
                label: 'Copiar Campos',
                submenu: [
                    {
                        label: 'Copiar Link',
                        click(){  },
                    },
                    {
                        label: 'Copiar Descrição',
                        click(){  },
                    },
                ]
            },
            {
                label: 'Adicionar Entrada',
                click(){ criarNovaEntrada(); }
            },
            {
                label: 'Editar Entrada',
                click(){ /* Abre nova janelinha editarEntrada.html */ },
            },
            {
                label: 'Deletar Entrada(s)',
                click(){ /* to add: Are you sure? */ },
            },
            {
                label: 'Selecionar Tudo',
                click(){  },
            },
        ]
    },

    {
        label: 'Encontrar',
        submenu: [
            {
                label: 'Encontrar', //Barra de pesquisa
                click(){  },
            },
            {
                label: 'Expiradas', //Filtro expiradas
                click(){  },
            },
            {
                label: 'Recentemente Modificadas', //Filtro recentemente modificadas
                click(){  },
            },
            {
                label: 'Senhas Duplicadas ou Similares',
                click(){  }
            },
        ]
    },

    {
        label: 'Ver',
        submenu: [
            // { FUNCIONALIDADE FUTURA
            //     label: 'Alterar Idioma', //Abre nova janelinha idiomas.html
            //     click(){  },
            // },
            // { FUNCIONALIDADE FUTURA
            //     label: 'Grupos',
            //     click(){  },
            // },
            {
                label: 'Configurar Colunas',
                click(){  },
            },
            {
                label: 'Reordenar, Filtrar...',
                click(){  },
            },
        ]
    },

    {
        label: 'Ferramentas',
        submenu: [
            {
                label: 'Gerar Senhas',
                click(){ criarGerador(); },
            },
            {
                label: 'Configurações',
                click(){ criarConfiguracoes(); },
            },
            {
                label: 'Ajuda',
                submenu: [
                    {
                        label: 'Verificar novas Atualizações',
                        click(){  },
                    },
                    {
                        label: 'Sobre o SimpleKeys, Links de Ajuda',
                        click(){ criarSobre(); },
                    },
                ]
            },
        ]
    },
];

app.on('ready', (e) => {
    log.info("Aplicativo aberto!");
    criarTelaInicial();
});

app.on('window-all-closed', (e) => {
    // Fecha o App
    app.quit();
});