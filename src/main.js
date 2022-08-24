/*
* SimpleKeys
* main.js
* 8/jun/2022
*/

// Módulos para controlar o ciclo de vida da aplicação e criar a janela nativa do Browser
const { app, BrowserWindow, BrowserView, Menu, ipcMain, dialog, Notification, safeStorage, systemPreferences, clipboard } = require('electron');

const log = require('electron-log');

let telaInicial = null
let novoArquivo = null
let outroArquivo = null
let listaEntradas = null
let novaEntrada = null
let gerador = null
let backup = null
let configuracoes = null
let sobre = null

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
                click(){ criarOutroArquivo(); }
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
                label: 'Deletar Entrada(s) //to add: Are you sure?',
                click(){  },
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
]

// new Notification("Senha...", {
//     body: "Senha...",    
// });

const lock = app.requestSingleInstanceLock();
(!lock) ? app.quit() : log.info("Aplicativo inicializando!"); //o App já está aberto!

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
            renderer: './renderer.js'
        }
    });

    // e carrega a tela padrão do App
    telaInicial.loadFile('./views/index.html');

    telaInicial.on('closed', () => {
        app.quit();
    });
}

ipcMain.on('opcao:criar', (event) => {
    try {
        criarNovoArquivo();
    } catch (error){
        log.info("Houve um erro no carregamento da tela novoArquivo, " + error);
    }
});

ipcMain.on('opcao:abrir', (event) => {
    try {
        criarOutroArquivo();
    } catch (error){
        log.info("Houve um erro no carregamento da tela outroArquivo, " + error);
    }
});

ipcMain.on('opcao:config', (event) => {
    try {
        criarConfiguracoes();
    } catch (error){
        log.info("Houve um erro no carregamento da tela configuracoes, " + error);
    }
});

ipcMain.on('opcao:ajuda', (event) => {
    try {
        criarSobre();
    } catch (error){
        log.info("Houve um erro no carregamento da tela sobre, " + error);
    }
});

function criarNovoArquivo(){
    novoArquivo = new BrowserView();

    telaInicial.setBrowserView(novoArquivo);
    novoArquivo.setBounds({ x: 0, y: 0 });
    novoArquivo.webContents.loadFile('./views/novoArquivo.html');
}

ipcMain.on('arquivo:criar', (event, item) => {
    telaInicial.webContents.send('arquivo:criar', item);
    novoArquivo = null;
    criarListaEntradas();
});

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

    outroArquivo.setBounds({ x: 320, y: 360 });
    outroArquivo.loadFile('./views/outroArquivo.html');
}

ipcMain.on('arquivo:outro', (event, item) => {
    outroArquivo.webContents.send('arquivo:outro', item);
    outroArquivo = null;
    //se senha OK, criarListaEntradas();
});

function criarListaEntradas(){
    listaEntradas = new BrowserView();

    telaInicial.setBrowserView(listaEntradas);
    listaEntradas.setBounds({ x: 0, y: 0 });
    listaEntradas.webContents.loadFile('./views/listaEntradas.html');

    // Cria o template do menu
    const menu = Menu.buildFromTemplate(opcoesMenu);

    // Insere o menu
    Menu.setApplicationMenu(menu);
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

    sobre.setBounds({ x: 320, y: 360 });
    sobre.loadFile('./views/sobre.html');

    sobre.on('closed', () => {
        sobre = null;
    });
}

app.on('ready', () => {
    log.info("Aplicativo aberto!");
    criarTelaInicial();
});

app.on('window-all-closed', () => {
    // Fecha o App
    app.quit();
});