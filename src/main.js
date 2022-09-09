/*
* SimpleKeys
* main.js
* 8/jun/2022
*/

// Módulos para controlar o ciclo de vida da aplicação e criar a janela nativa do Browser
const { app, BrowserWindow, Menu, dialog } = require('electron');
const { ipcMain: ipc } = require('electron-better-ipc');
const { showAboutWindow } = require('electron-util');

const Store = require('electron-store');
const store = new Store();

const log = require('electron-log');

const lock = app.requestSingleInstanceLock();
(!lock == true) ? () => { dialog.showErrorBox("Erro", "O App já está aberto!"); app.quit(); } : log.info("Aplicativo inicializando!");

let telaInicial = null;
let lerArquivo = null;
let WIN = null;

function criarTelaInicial(){
    // Cria a tela inicial
    telaInicial = new BrowserWindow({
        width: 1280,
        height: 769,
        resizable: false,
        show: false,
        title: "SimpleKeys",
        backgroundColor: "#5096fa",
        icon: __dirname + './views/public/icon/icon.png',
        webPreferences: {
            devTools: !app.isPackaged,
            contextIsolation: false,
            nodeIntegration: true
        }
    });

    (app.isPackaged) ? Menu.setApplicationMenu(null) : log.info("Menu PROD aberto!");

    telaInicial.loadFile('src/views/index.html');

    telaInicial.on('ready-to-show', () => {
        telaInicial.show();
        app.focus();
        log.info("Tela aberta!");
    });

    telaInicial.on('closed', () => {
        app.quit();
    });
}

function criarNovoArquivo(){
    telaInicial.loadFile('src/views/novoArquivo.html');
}

function criarListaEntradas(){
    // Cria o template do menu
    opcoesMenu = [
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
                    click(){ criarEditarEntrada(); },
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
    ]; const menu = Menu.buildFromTemplate(opcoesMenu);
    
    // Insere o menu
    Menu.setApplicationMenu(menu);

    // Abre a tela
    telaInicial.loadFile('src/views/listarEntradas.html');
    ipc.sendToRenderers('arquivo:novo:receiveCriar');
    
    app.focus();
}

ipc.on('arquivo:novo:criar', (e, database) => {
    criarListaEntradas();
    database = database;
});

ipc.on('arquivo:novo:salvar', (e, path) => {
    let options = {
        title: "SimpleKeys - Criar Um Novo Arquivo",
        defaultPath: "%USERPROFILE%/" + path || "$HOME/" + path,
        buttonLabel: "Salvar",
        filters: [
            {name: 'Banco de Dados', extensions: ['db']},
            {name: 'All Files', extensions: ['*']}
        ]
    }

    dialog.showSaveDialog(WIN, options).then((arquivo) => {
        if (arquivo != ("" || null || undefined)) {
            log.info(arquivo.filePath);
            store.set("pathArquivo", arquivo.filePath);
            ipc.sendToRenderers('arquivo:novo:receiveArquivo', arquivo.filePath);
        } else {
            alert("Selecione um local válido para salvar o arquivo!");
        }
    }).catch((error) => {
        log.info("Houve um erro aqui! " + error);
    });
});

function criarLerArquivo(){
    lerArquivo = new BrowserWindow({
        width: 538,
        height: 409,
        resizable: false,
        show: false,
        parent: telaInicial,
        title: "SimpleKeys - Abrir Arquivo Já Existente",
        backgroundColor: "#5096fa",
        icon: __dirname + './views/public/icon/icon.png',
        webPreferences: {
            devTools: !app.isPackaged,
            contextIsolation: false,
            nodeIntegration: true
        }
    });
    
    lerArquivo.loadFile('src/views/lerArquivo.html');

    lerArquivo.on('ready-to-show', () => {
        lerArquivo.show();
        app.focus();
    });

    lerArquivo.on('closed', () => {
        app.focus();
    });
}

ipc.on('arquivo:ler', (e, database) => {
    lerArquivo.close();
    criarListaEntradas();
    database = database;
});

ipc.on('arquivo:ler:cancelar', (e) => {
    lerArquivo.close();
});

ipc.on('arquivo:ler:chaveReserva', (e) => {
    let options = {
        title: "SimpleKeys - Abrir Arquivo Já Existente",
        defaultPath: "%USERPROFILE%/" || "$HOME/",
        buttonLabel: "Abrir",
        filters: [
            {name: 'Chave Reserva', extensions: ['key']},
            {name: 'All Files', extensions: ['*']}
        ]
    }

    dialog.showOpenDialog(WIN, options).then((arquivo) => {
        if (arquivo != ("" || null || undefined || [])) {
            log.info(arquivo.filePaths);
            store.set("pathChaveReserva", arquivo.filePaths);
            ipc.sendToRenderers('arquivo:ler:receiveChaveReserva', arquivo.filePaths);
        } else {
            alert("Selecione um Arquivo e/ou uma Chave para abrir clicando na pasta abaixo da senha!");
        }
    }).catch((error) => {
        log.info("Houve um erro aqui! " + error);
    });
});

ipc.on('arquivo:ler:path', (e) => {
    let options = {
        title: "SimpleKeys - Abrir Arquivo Já Existente",
        defaultPath: "%USERPROFILE%/" || "$HOME/",
        buttonLabel: "Abrir",
        filters: [
            {name: 'Banco de Dados', extensions: ['db']},
            {name: 'All Files', extensions: ['*']}
        ]
    }

    dialog.showOpenDialog(WIN, options).then((arquivo) => {
        if (arquivo != ("" || null || undefined || [])) {
            log.info(arquivo.filePaths);
            store.set("pathArquivo", arquivo.filePaths);
            ipc.sendToRenderers('arquivo:ler:receiveArquivo', arquivo.filePaths);
        } else {
            alert("Selecione um Arquivo e/ou uma Chave para abrir clicando na pasta abaixo da senha!");
        }
    }).catch((error) => {
        log.info("Houve um erro aqui! " + error);
    });
});

function criarNovaEntrada(){
    telaInicial.loadFile('src/views/novaEntrada.html');
}

function criarEditarEntrada(){
    telaInicial.loadFile('src/views/editarEntrada.html');
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
        icon: __dirname + './views/public/icon/icon.ico',
        copyright: 'Copyright © 2022 - Kauã Maia (bainloko)',
        text: 'Beta Fechado\n\nLinks e instruções para aprender a usar o programa e se proteger melhor na internet: https://github.com/bainloko/SimpleKeys \n\nPara ver o histórico de um Banco de Dados, veja os registros na pasta Documentos no Windows e Home no Linux.\n\nEm caso de dúvida, envie um e-mail para kaua.maia177@gmail.com \n\nTCC/TI de Kauã Maia Cousillas para o Instituto Federal Sul-rio-grandense 𝘊𝘢𝘮𝘱𝘶𝘴 Bagé.',
        website: 'https://github.com/bainloko/SimpleKeys'
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

app.on('ready', (e) => {
    criarTelaInicial();
});

app.on('window-all-closed', (e) => {
    // Fecha o App
    app.quit();
});