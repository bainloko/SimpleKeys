/*
* SimpleKeys
* main.js
* 8/jun/2022
*/

// Módulos para controlar o ciclo de vida da aplicação e criar a janela nativa do Browser
const { app, BrowserWindow, webContents, Menu, dialog, Notification, systemPreferences, clipboard } = require('electron');
const { ipcMain: ipc } = require('electron-better-ipc');
const ContextMenu = require("secure-electron-context-menu").default;
const { showAboutWindow } = require('electron-util');

const path = require('path');
const log = require('electron-log');

const Store = require('electron-store');
const store = new Store();

let telaInicial = null;
let lerArquivo = null;
let WIN = null;

const isDev = process.env.NODE_ENV === "development";
const lock = app.requestSingleInstanceLock();
(!lock) ? () => { dialog.showErrorBox("Erro", "O App já está aberto!"); app.quit(); } : log.info("Aplicativo inicializando!");

function criarTelaInicial(){
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
            preload: path.join(__dirname, 'preload.js')
        }
    });

    //contextMenu isDev

    // e carrega a tela padrão do App
    telaInicial.loadFile('src/views/index.html');
    Menu.setApplicationMenu(null);

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
    telaInicial.loadFile('src/views/novoArquivo.html');
}

ipc.on('arquivo:criar', (e, item) => {
    store.set("novoArquivo", item);
    log.info(e);

    criarListaEntradas();
});

ipc.on('arquivo:novo:salvar', (e) => {
    let options = {
        title: "SimpleKeys - Criar Um Novo Arquivo",
        defaultPath: "%USER_PROFILE%/Documents/" || "$HOME/",
        buttonLabel: "Salvar",
        filters: [
            {name: 'Banco de Dados', extensions: ['db']},
            {name: 'All Files', extensions: ['*']}
        ]
    }

    let arquivo = dialog.showSaveDialog(WIN, options).then(() => {
        store.set("novoPath", arquivo);
        log.info(arquivo);
    }).catch((error) => {
        log.info("Houve um erro aqui! " + error);
    });
})

function criarLerArquivo(){
    lerArquivo = new BrowserWindow({
        width: 518,
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

ipc.on('arquivo:ler', (e, lerPath, senha) => {
    let arq = require('src/tools/arquivo.js');

    try {
        if (arq.lerArquivo(lerPath, senha)) {
            lerArquivo.close();
            criarListaEntradas();
            telaInicial.focus();
        } else {
            alert("Erro! Possivelmente a senha está incorreta. Tente novamente!");
            log.info("Erro! Possivelmente a senha está incorreta. Tente novamente!");
            lerArquivo.focus();
        }
    } catch (error) {
        alert("Erro! Possivelmente a senha está incorreta. Tente novamente! " + error);
        log.info("Erro! Possivelmente a senha está incorreta. Tente novamente! " + error);
        lerArquivo.focus();
    }
});

ipc.on('arquivo:ler:cancelar', (e) => {
    lerArquivo.close();
    telaInicial.focus();
});

ipc.on('arquivo:ler:path', (e) => {
    let options = {
        title: "SimpleKeys - Abrir Arquivo Já Existente",
        defaultPath: "%USER_PROFILE%/Documents/" || "$HOME/",
        buttonLabel: "Abrir",
        filters: [
            {name: 'Banco de Dados', extensions: ['db']},
            {name: 'All Files', extensions: ['*']}
        ],
        properties: ['openFile']
    }

    let arquivo = dialog.showOpenDialog(WIN, options).then(() => {
        store.set("lerPath", arquivo);
        log.info(arquivo);
    }).catch((error) => {
        log.info("Houve um erro aqui! " + error);
    });
});

function criarListaEntradas(lerPath, senha){
    telaInicial.loadFile('src/views/listaEntradas.html');

    // Cria o template do menu
    const menu = Menu.buildFromTemplate(opcoesMenu);

    // Insere o menu
    Menu.setApplicationMenu(menu);
}

function criarNovaEntrada(){
    telaInicial.loadFile('src/views/novaEntrada.html');
}

function criarEditarEntrada(){
    telaInicial.loadFile('src/views/editarEntrada.html');

    //nos IPCs, atentar para alerts e checks de verificação após editar (are you sure?)
}

function criarGerador(){
    telaInicial.loadFile('src/views/gerador.html');
}

function criarBackup(){
    telaInicial.loadFile('src/views/backup.html');
}

function criarConfiguracoes(){
    telaInicial.loadFile('src/views/configuracoes.html');
}

function criarSobre(){
    showAboutWindow({
        icon: 'src/views/public/favicon/favicon-48x48.png',
        copyright: 'Copyright © 2022 - Kauã Maia (bainloko)',
        text: 'Beta Fechado\n\nLinks e instruções para aprender a usar o programa e se proteger melhor na internet: https://github.com/bainloko/SimpleKeys \n\nPara ver o histórico de um Banco de Dados, veja os registros na pasta Documentos no Windows e Home no Linux.\n\nEm caso de dúvida, envie um e-mail para kaua.maia177@gmail.com \n\nTCC/TI de Kauã Maia Cousillas para o Instituto Federal Sul-rio-grandense 𝘊𝘢𝘮𝘱𝘶𝘴 Bagé.',
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
    criarTelaInicial();
    log.info("Aplicativo aberto!");
});

app.on('window-all-closed', (e) => {
    // Fecha o App
    app.quit();
});