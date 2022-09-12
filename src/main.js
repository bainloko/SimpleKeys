/*
* SimpleKeys
* main.js
* 8/jun/2022
*/

// Módulos para controlar o ciclo de vida da aplicação e criar a janela nativa do Browser
const { app, BrowserWindow, Menu, Notification, dialog } = require('electron');
const { ipcMain: ipc } = require('electron-better-ipc');
const { showAboutWindow } = require('electron-util');

const Store = require('electron-store');
const store = new Store();

const log = require('electron-log');

const lock = app.requestSingleInstanceLock();
(!lock == true) ? () => { dialog.showErrorBox("Erro!", "O App já está aberto!"); app.quit(); } : log.info("Aplicativo inicializando!");

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
    
    Menu.setApplicationMenu(null);
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

function fecharBanco(){
    try {
        Menu.setApplicationMenu(Menu.buildFromTemplate([{label: "Menu"}]));
        telaInicial.loadFile('src/views/index.html');
    } catch (error){
        log.error("Ocorreu um erro ao fechar o Banco de Dados! Encerre o SimpleKeys imediatamente! " + error);
        dialog.showErrorBox("Erro!", "Ocorreu um erro ao fechar o Banco de Dados! Encerre o SimpleKeys imediatamente! " + error);
    }
}

ipc.on('opcao:inicial', (e) => {
    fecharBanco();
});

function criarListaEntradas(){
    try {
        // Cria o template do menu
        let opcoesMenu = [
            // Cada objeto é um dropdown
            {
                label: 'Arquivo',
                submenu: [
                    {
                        label: 'Novo Arquivo',
                        click(){ ipc.send('opcao:criar'); }
                    },
                    {
                        label: 'Abrir Arquivo Já Existente',
                        click(){ ipc.send('opcao:abrir'); }
                    },
                    {
                        label: 'Fechar Arquivo',
                        click(){ fecharBanco(); /* limpar área de transferência + Notificação */ }
                    },
                    {
                        label: 'Alterar Senha Mestra',
                        click(){ /* Salvar, navegar para alterarSenha e validar, criptografar banco, limpar área de transferência telaInicial.setBrowserView(telaInicial); */ },
                    },
                    {
                        label: 'Backup',
                        click(){ },
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
                        click(){ fecharBanco(); /* limpar área de transferência + Notificação */ },
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
                        click(){ },
                    },
                    {
                        label: 'Copiar Senha',
                        click(){ },
                    },
                    {
                        label: 'Copiar Campos',
                        submenu: [
                            {
                                label: 'Copiar Link',
                                click(){ },
                            },
                            {
                                label: 'Copiar Descrição',
                                click(){ },
                            },
                        ]
                    },
                    {
                        label: 'Cadastrar Entrada',
                        click(){ }
                    },
                    {
                        label: 'Editar Entrada',
                        click(){ },
                    },
                    {
                        label: 'Deletar Entrada(s)',
                        click(){ },
                    },
                    // { FUNCIONALIDADE FUTURA
                    //     label: 'Selecionar Tudo',
                    //     click(){  },
                    // },
                ]
            },

            // { FUNCIONALIDADE FUTURA
            //     label: 'Encontrar',
            //     submenu: [
            //         {
            //             label: 'Encontrar', //Barra de pesquisa
            //             click(){  },
            //         },
            //         {
            //             label: 'Expiradas', //Filtro expiradas
            //             click(){  },
            //         },
            //         {
            //             label: 'Recentemente Modificadas', //Filtro recentemente modificadas
            //             click(){  },
            //         },
            //         {
            //             label: 'Senhas Duplicadas ou Similares', //Filtro senhas duplicadas ou similares
            //             click(){  }
            //         },
            //     ]
            // },
            // {
            //     label: 'Ver',
            //     submenu: [
            //         { 
            //             label: 'Alterar Idioma', //Abre nova janelinha idiomas.html
            //             click(){  },
            //         },
            //         {
            //             label: 'Grupos',
            //             click(){  },
            //         },
            //         {
            //             label: 'Configurar Colunas',
            //             click(){  },
            //         },
            //         {
            //             label: 'Reordenar, Filtrar...',
            //             click(){  },
            //         },
            //     ]
            // },

            {
                label: 'Ferramentas',
                submenu: [
                    {
                        label: 'Gerar Senhas',
                        click(){ },
                    },
                    {
                        label: 'Configurações',
                        click(){ },
                    },
                ]
            },

            {
                label: 'Ajuda',
                submenu: [
                    {
                        label: 'Verificar novas Atualizações',
                        click(){ },
                    },
                    {
                        label: 'Sobre o SimpleKeys, Links de Ajuda',
                        click(){ criarSobre(); },
                    },
                ]
            },
        ]; const menu = Menu.buildFromTemplate(opcoesMenu);

        // Insere o menu
        Menu.setApplicationMenu(menu);

        // Abre a tela
        telaInicial.loadFile('src/views/listarEntradas.html');
    } catch (error){
        log.error("Houve um erro no carregamento da tela listaEntradas, " + error);
        dialog.showErrorBox("Erro!", "Houve um erro no carregamento da tela listaEntradas, " + error);
    }
}

function criarNovoArquivo(){
    try {
        telaInicial.loadFile('src/views/novoArquivo.html');
    } catch (error){
        log.error("Houve um erro no carregamento da tela novoArquivo, " + error);
        dialog.showErrorBox("Erro!", "Houve um erro no carregamento da tela novoArquivo, " + error);
    }
}

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
            ipc.sendToRenderers('arquivo:novo:pathArquivo', arquivo.filePath);
        } else {
            dialog.showErrorBox("Erro!", "Selecione um local válido para salvar o arquivo!");
        }
    }).catch((error) => {
        log.error("Houve um erro aqui! " + error);
        dialog.showErrorBox("Erro!", "Houve um erro aqui! " + error);
    });
});

ipc.on('arquivo:novo:criar', (e) => {
    criarListaEntradas();
});

function criarLerArquivo(){
    try {
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
    } catch (error){
        log.error("Houve um erro no carregamento da tela lerArquivo, " + error);
        dialog.showErrorBox("Erro!", "Houve um erro no carregamento da tela lerArquivo, " + error);
    }
}

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
            dialog.showErrorBox("Erro!", "Selecione um Arquivo e/ou uma Chave para abrir clicando na pasta abaixo da senha!");
        }
    }).catch((error) => {
        log.error("Houve um erro aqui! " + error);
        dialog.showErrorBox("Erro!", "Houve um erro aqui! " + error);
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
            ipc.sendToRenderers('arquivo:ler:pathArquivo', arquivo.filePaths);
        } else {
            dialog.showErrorBox("Erro!", "Selecione um Arquivo e/ou uma Chave para abrir clicando na pasta abaixo da senha!");
        }
    }).catch((error) => {
        log.error("Houve um erro aqui! " + error);
        dialog.showErrorBox("Erro!", "Houve um erro aqui! " + error);
    });
});

ipc.on('arquivo:ler:cancelar', (e) => {
    lerArquivo.close();
});

ipc.on('arquivo:ler', (e) => {
    lerArquivo.close();
    criarListaEntradas();
});

function criarNovaEntrada(){
    try {
        telaInicial.loadFile('src/views/novaEntrada.html');
    } catch (error){
        log.error("Houve um erro no carregamento da tela novaEntrada, " + error);
        dialog.showErrorBox("Erro!", "Houve um erro no carregamento da tela novaEntrada, " + error);
    }
}

ipc.on('arquivo:nova', (e) => {
    criarNovaEntrada();
})

function criarEditarEntrada(){
    try {
        telaInicial.loadFile('src/views/editarEntrada.html');
    } catch (error){
        log.error("Houve um erro no carregamento da tela editarEntrada, " + error);
        dialog.showErrorBox("Erro!", "Houve um erro no carregamento da tela editarEntrada, " + error);
    }
}

ipc.on('arquivo:editar', (e) => {
    criarEditarEntrada();
});

ipc.on('arquivo:entrada:apagar', (e) => {
    const resposta = dialog.showMessageBox(telaInicial, {message: 'Tem certeza que quer apagar Esta Entrada?', type: 'question', buttons: ['Sim', 'Não'], defaultId: 1, cancelId: 1});
    if (resposta == 0) {
        ipc.sendToRenderers('entrada:apagar'); //work on that
    } else {
        log.error("Operacao cancelada.")
        dialog.showErrorBox("Erro!", "Operação cancelada.");
    }
});

function criarGerador(){
    try {
        telaInicial.loadFile('src/views/gerador.html');
    } catch (error){
        log.error("Houve um erro no carregamento da tela gerador, " + error);
        dialog.showErrorBox("Erro!", "Houve um erro no carregamento da tela gerador, " + error);
    }
}

ipc.on('arquivo:gerador', (e) => {
    criarGerador();
});

function criarBackup(){
    try {
        telaInicial.loadFile('src/views/backup.html');
    } catch (error){
        log.error("Houve um erro no carregamento da tela backup, " + error);
        dialog.showErrorBox("Erro!", "Houve um erro no carregamento da tela backup, " + error);
    }
}

ipc.on('arquivo:backup', (e) => {
    criarBackup();
});

function criarConfiguracoes(){
    try {
        telaInicial.loadFile('src/views/configuracoes.html');
    } catch (error){
        log.error("Houve um erro no carregamento da tela configuracoes, " + error);
        dialog.showErrorBox("Erro!", "Houve um erro no carregamento da tela configurações, " + error);
    }
}

function criarSobre(){
    try {
        showAboutWindow({
            icon: __dirname + './views/public/icon/icon.ico',
            copyright: 'Copyright © 2022 - Kauã Maia (bainloko)',
            text: 'Beta Fechado\n\nLinks e instruções para aprender a usar o programa e se proteger melhor na internet: https://github.com/bainloko/SimpleKeys \n\nPara ver o histórico de um Banco de Dados, veja os registros na pasta Documentos no Windows e Home no Linux.\n\nEm caso de dúvida, envie um e-mail para kaua.maia177@gmail.com \n\nTCC/TI de Kauã Maia Cousillas para o Instituto Federal Sul-rio-grandense 𝘊𝘢𝘮𝘱𝘶𝘴 Bagé.',
            website: 'https://github.com/bainloko/SimpleKeys'
        });
    } catch (error){
        log.error("Houve um erro no carregamento da tela sobre, " + error);
        dialog.showErrorBox("Erro!", "Houve um erro no carregamento da tela sobre, " + error);
    }
}

ipc.on('opcao:criar', (e) => {
    criarNovoArquivo();
});

ipc.on('opcao:abrir', (e) => {
    criarLerArquivo();
});

ipc.on('opcao:config', (e) => {
    criarConfiguracoes();
});

ipc.on('opcao:sobre', (e) => {
    criarSobre();
});

app.on('ready', (e) => {
    criarTelaInicial();
});

app.on('window-all-closed', (e) => {
    navigator.clipboard.write(' ');
    log.info(navigator.clipboard.read());
    store.set("pathArquivo", "");
    store.set("nomeArquivo", "");
    store.set("descArquivo", "");
    store.set("expiraArquivo", 0);
    store.set("chaveReserva", false);
    store.set("senhaArquivo", "");
    store.set("selecaoAtual", 0);

    // Fecha o App
    app.quit();
});