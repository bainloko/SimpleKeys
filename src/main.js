/*
* SimpleKeys
* main.js
* 8/jun/2022
*/

// Módulos para controlar o ciclo de vida da aplicação e criar a janela nativa do Browser
const { app, BrowserWindow, Menu, dialog, shell } = require('electron');
const { ipcMain: ipc } = require('electron-better-ipc');
const contextMenu = require('electron-context-menu');
const { showAboutWindow } = require('electron-util');

const Store = require('electron-store');
const store = new Store();

const log = require('electron-log');

const lock = app.requestSingleInstanceLock();
if (!lock) {
    dialog.showErrorBox("Erro!", "O App já está aberto!");
    setTimeout(app.quit(), 5000);
} else if (require('electron-squirrel-startup')) {
    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);
    const spawn = function(command, args) {
      let spawnedProcess, error;

      try {
        spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
      } catch (error) {}

      return spawnedProcess;
    };

    const spawnUpdate = function(args) {
      return spawn(updateDotExe, args);
    };

    function handleStartupEvent(){
        let squirrelCommand = process.argv[1];
        switch (squirrelCommand) {
            case '--squirrel-install':
            case '--squirrel-updated':
                spawnUpdate(['--createShortcut'], exeName);
                //regKey requireelevation

                setTimeout(app.quit(), 1000);
                return true;
            case '--squirrel-uninstall':
                spawnUpdate(['--removeShortcut'], exeName);
                //regKey requireelevation

                setTimeout(app.quit(), 1000);
                return true;
            case '--squirrel-obsolete':
                /* update? */

                setTimeout(app.quit(), 1000);
                return true;
            default:
                log.error("Comando inválido!");

                setTimeout(app.quit(), 1000);
                return false; 
        }
    }

    if (handleStartupEvent()) return;
} else {
    log.info("Aplicativo inicializando!");
}

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
            nodeIntegration: true,
            spellcheck: false
        }
    });
    
    Menu.setApplicationMenu(null);

    contextMenu({
        menu: (params, telaInicial) => [
            {
                role: "cut",
                label: "Recortar"
            },
            {
                role: "copy",
                label: "Copiar",
            },
            {
                role: "paste",
                label: "Colar",
            },
            {
                role: "selectAll",
                label: "Selecionar Tudo",
            },
            // {
            //     role: "toggleDevTools",
            // },
        ], showLearnSpelling: false, showLookUpSelection: false, showSearchWithGoogle: false, showCopyImage: false, showSaveImage: false
    });

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

function fecharEInicial(){
    try {
        Menu.setApplicationMenu(null);
        telaInicial.loadFile('src/views/index.html');
    } catch (error){
        log.error("Ocorreu um erro ao fechar o Banco de Dados! Encerre o SimpleKeys imediatamente! " + error);
        dialog.showErrorBox("Erro!", "Ocorreu um erro ao fechar o Banco de Dados! Encerre o SimpleKeys imediatamente! " + error);
    }
}

ipc.on('opcao:inicial', (e) => {
    fecharEInicial();
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
                        click(){ criarNovoArquivo(); }
                    },
                    {
                        label: 'Abrir Arquivo Já Existente',
                        click(){ criarLerArquivo(); }
                    },
                    {
                        label: 'Alterar Senha Mestra',
                        click(){ dialog.showErrorBox("Erro!", "Funcionalidade Futura! Desculpe!"); /* limpar área de transferência + Wizard ipc.send('opcao:alterarSenha') criptografar banco ipc.send('opcao:inicial'); */ },
                    },
                    // { //FUNCIONALIDADE FUTURA
                    //     label: 'Importar',
                    //     click(){  },
                    // },
                    // {
                    //     label: 'Exportar',
                    //     click(){  },
                    // },
                    {
                        label: 'Salvar Arquivo',
                        click(){ dialog.showErrorBox("Erro!", "Salvar pelo Menu de Contexto é uma Funcionalidade Futura! Clique no Disquete para salvar o Chaveiro por enquanto!"); }
                    },
                    {
                        label: 'Trancar Arquivo',
                        click(){ dialog.showErrorBox("Erro!", "Trancar pelo Menu de Contexto é uma Funcionalidade Futura! Clique no Cadeado para trancar o Chaveiro por enquanto!"); }
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
                        label: 'Copiar Login',
                        click(){ dialog.showErrorBox("Erro!", "Trancar pelo Menu de Contexto é uma Funcionalidade Futura! Clique na Identidade para copiar o Login por enquanto!"); },
                    },
                    {
                        label: 'Copiar Senha',
                        click(){ dialog.showErrorBox("Erro!", "Trancar pelo Menu de Contexto é uma Funcionalidade Futura! Clique na Chave para copiar a Senha por enquanto!"); },
                    },
                    // { //FUNCIONALIDADE FUTURA
                    //     label: 'Copiar Campos',
                    //     submenu: [
                    //         {
                    //             label: 'Copiar Link',
                    //             click(){ },
                    //         },
                    //         {
                    //             label: 'Copiar Descrição',
                    //             click(){ },
                    //         },
                    //     ]
                    // },
                    {
                        label: 'Cadastrar Nova Entrada',
                        click(){ cadastrarNovaEntrada(); }
                    },
                    {
                        label: 'Editar Entrada',
                        click(){ selecaoAtual = store.get("selecaoAtual"); if(selecaoAtual != (0 || null || undefined || [])){criarEditarEntrada();}else{dialog.showErrorBox("Erro!", "Selecione uma Entrada para editar!");} },
                    },
                    {
                        label: 'Deletar Entrada(s)',
                        click(){ selecaoAtual = store.get("selecaoAtual"); if(selecaoAtual != (0 || null || undefined || [])){apagar(selecaoAtual);}else{dialog.showErrorBox("Erro!", "Selecione uma Entrada para apagar!");} },
                    },
                    // { //FUNCIONALIDADE FUTURA
                    //     label: 'Selecionar Tudo',
                    //     click(){  },
                    // },
                ]
            },

            // { //FUNCIONALIDADE FUTURA
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
            //             label: 'Alterar Idioma',
            //             click(){ ipc.send('opcao:alterarIdioma'); },
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
                        label: 'Gerador de Senhas',
                        click(){ criarGerador(); },
                    },
                    {
                        label: 'Backup',
                        click(){ criarBackup(); },
                    },
                ]
            },

            {
                label: 'Configurações',
                click(){ criarConfiguracoes(); },
            },

            {
                label: 'Ajuda',
                submenu: [
                    {
                        label: 'Verificar novas Atualizações, Links e instruções',
                        click(){ shell.openExternal("https://github.com/bainloko/SimpleKeys") },
                    },
                    {
                        label: 'Sobre o SimpleKeys',
                        click(){ criarSobre(); },
                    },
                ]
            },
        ]; const menu = Menu.buildFromTemplate(opcoesMenu);

        // Abre a tela
        telaInicial.loadFile('src/views/listarEntradas.html');

        setTimeout(() => {
            // Insere o menu
            Menu.setApplicationMenu(menu);
        }, 1000);
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

function cadastrarNovaEntrada(){
    try {
        telaInicial.loadFile('src/views/novaEntrada.html');
    } catch (error){
        log.error("Houve um erro no carregamento da tela novaEntrada, " + error);
        dialog.showErrorBox("Erro!", "Houve um erro no carregamento da tela novaEntrada, " + error);
    }
}

ipc.on('arquivo:nova', (e) => {
    cadastrarNovaEntrada();
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

function apagar(selecaoAtual){
    dialog.showMessageBox(telaInicial, {message: 'Tem certeza que quer apagar Esta Entrada? ID: ' + selecaoAtual, type: 'question', buttons: ['Sim', 'Não'], defaultId: 1, cancelId: 1}).then((resposta) => {
        if (resposta.response == 0) {
            ipc.sendToRenderers('entrada:apagar');
        } else {
            log.error("Operacao cancelada.")
            dialog.showErrorBox("Erro!", "Operação cancelada.");
        }
    });
}

ipc.on('arquivo:entrada:apagar', (e) => {
    apagar();
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
            icon: __dirname + '../icon.ico',
            copyright: 'Copyright © 2022 Kauã Maia Cousillas',
            text: 'Um gerenciador de senhas leve, versátil e seguro.\n\n𝘽𝙚𝙩𝙖 𝘼𝙗𝙚𝙧𝙩𝙤\n\nTestador Autorizado Durante o Beta Fechado: Lucas-Dutra-Pereira\n\nTodos os códigos e lógica são proprietários, exceto em menções explícitas a outros.\n\nSimpleKeys foi inspirado em muitos outros softwares, mas que são muito complicados de usar ou que não têm ajuda em Português!\n\nPara ver o histórico de uso do SimpleKeys, veja os registros na pasta "%AppData%/simplekeys/logs" no Windows e "~/.config/simplekeys/logs/" no Linux.\n\nEm caso de 𝙗𝙪𝙜𝙨 ou dúvidas, envie um e-mail para\nk̲a̲u̲a̲.m̲a̲i̲a̲177@gm̲a̲i̲l̲.c̲o̲m̲, e no GitHub: @bainloko/SimpleKeys\n\nTrabalho de Conclusão de Curso de Kauã Maia Cousillas para o Instituto Federal Sul-rio-grandense 𝘾𝙖𝙢𝙥𝙪𝙨 Bagé. Copyright (c) 2022 Kauã Maia Cousillas.\n\nEste s̲o̲f̲t̲w̲a̲r̲e̲ é livre, e poderá ser redistribuído sob os termos especificados no arquivo LICENSE.txt; também leia NOTICE.md para mais detalhes.\n\n',
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

ipc.on('mensagem:entrada:sucesso', (e) => {
    dialog.showMessageBox(telaInicial, { message: "Entrada cadastrada com sucesso!" });
    criarListaEntradas();
});

ipc.on('mensagem:entrada:erro', (e) => {
    dialog.showErrorBox("Erro!", "Ocorreu um erro no cadastro da nova Entrada, ");
});

ipc.on('mensagem:leitura:erro', (e) => {
    dialog.showErrorBox("Erro!", "Ocorreu um erro na leitura das Entradas, ");
});

ipc.on('mensagem:pesquisa:erro', (e) => {
    dialog.showErrorBox("Erro!", "Ocorreu um erro na pesquisa das Entradas, ");
});

ipc.on('mensagem:edicao:sucesso', (e) => {
    dialog.showMessageBox(telaInicial, { message: "Entrada editada com sucesso!" });
    store.delete("selecaoAtual");
    criarListaEntradas();
});

ipc.on('mensagem:edicao:erro', (e) => {
    dialog.showErrorBox("Erro!", "Ocorreu um erro na edição da Entrada, ");
});

ipc.on('mensagem:apagar:sucesso', (e) => {
    dialog.showMessageBox(telaInicial, { message: "Entrada apagada com sucesso, " });
    ipc.sendToRenderers('repopular');
});

ipc.on('mensagem:apagar:erro', (e) => {
    dialog.showErrorBox("Erro!", "Ocorreu um erro aqui, \nTalvez esta Entrada não exista, ou já tenha sido apagada.");
});

ipc.on('mensagem:salvar:sucesso', (e) => {
    dialog.showMessageBox(telaInicial, { message: "Chaveiro salvo com sucesso!" });
});

ipc.on('mensagem:salvar:erro', (e) => {
    dialog.showErrorBox("Erro!", "Erro no salvamento do Chaveiro (Salvar|Senha incorreta?), ");
});

ipc.on('mensagem:fecharConexao:sucesso', (e) => {
    dialog.showMessageBox(telaInicial, { message: "Chaveiro fechado com sucesso!" });
});

ipc.on('mensagem:fecharConexao:erro', (e) => {
    dialog.showErrorBox("Erro!", "Ocorreu um erro no fechamento do Chaveiro, ");
});

ipc.on('mensagem:consulta:erro', (e) => {
    dialog.showErrorBox("Erro!", "Este Chaveiro não existe!");
});

ipc.on('mensagem:consulta:erro2', (e) => {
    dialog.showErrorBox("Erro!", "Ocorreu um erro aqui! Talvez este Chaveiro ainda não exista, ");
});

ipc.on('mensagem:gerador:erro', (e) => {
    dialog.showErrorBox("Erro!", "Por favor, digite SOMENTE números válidos e selecione algum tipo de caractere para a geração da(s) senha(s)!");
});

ipc.on('mensagem:gerador:erro2', (e) => {
    dialog.showErrorBox("Erro!", "Ocorreu um erro inesperado na geração das senhas, ");
});

ipc.on('mensagem:local:erro', (e) => {
    dialog.showErrorBox("Erro!", "Selecione um local válido para salvar o Chaveiro!");
});

ipc.on('mensagem:local:erro2', (e) => {
    dialog.showErrorBox("Erro!", "Selecione um Arquivo e/ou uma Chave para abrir clicando na pasta abaixo da senha!");
});

ipc.on('mensagem:senha:erro', (e) => {
    dialog.showErrorBox("Erro!", "Digite a senha!");
});

ipc.on('mensagem:local:erro3', (e) => {
    dialog.showErrorBox("Erro!", "Selecione um Arquivo para abrir clicando na pasta abaixo da senha!");
});

ipc.on('mensagem:listagem:erro', (e) => {
    dialog.showErrorBox("Erro!", "Erro ao abrir o Chaveiro! Será que a senha está incorreta?");
});

ipc.on('mensagem:listagem:erro2', (e) => {
    dialog.showErrorBox("Erro!", "Erro na listagem das Entradas! Tente novamente, ");
});

ipc.on('mensagem:copia:erro', (e) => {
    dialog.showErrorBox("Erro!", "A cópia falhou! Tente novamente, ");
});

function erroAnalise(){
    dialog.showErrorBox("Erro!", "Erro na análise da senha!");
}

ipc.on('mensagem:analise:ppp', (e, m) => {
    if (m == ("" || [] || undefined)) { dialog.showMessageBox(telaInicial, { message: "Esta senha é muito fraca! Considere trocá-la imediatamente! Sem mensagens novas. (sk)" }); } else if (m == null) { erroAnalise(); } else {
    dialog.showMessageBox(telaInicial, { message: "Esta senha é muito fraca! Considere trocá-la imediatamente!\nSugestões: " + m }); }
});

ipc.on('mensagem:analise:pp', (e, m) => {
    if (m == ("" || [] || undefined)) { dialog.showMessageBox(telaInicial, { message: "Esta senha é fraca! Considere trocá-la imediatamente! Sem mensagens novas. (sk)" }); } else if (m == null) { erroAnalise(); } else {
    dialog.showMessageBox(telaInicial, { message: "Esta senha é fraca! Considere trocá-la imediatamente!\nSugestões: " + m }); }
});

ipc.on('mensagem:analise:r', (e, m) => {
    if (m == ("" || [] || undefined)) { dialog.showMessageBox(telaInicial, { message: "Esta senha é razoável! Considere trocá-la em no máximo 6 meses. Sem mensagens novas. (sk)" }); } else if (m == null) { erroAnalise(); } else {
    dialog.showMessageBox(telaInicial, { message: "Esta senha é razoável! Considere trocá-la em no máximo 6 meses.\nSugestões:" + m }); }
});

ipc.on('mensagem:analise:f', (e, m) => {
    if (m == ("" || [] || undefined)) { dialog.showMessageBox(telaInicial, { message: "Esta senha é forte! Troque-a quando julgar necessário. Sem mensagens novas. (sk)" }); } else if (m == null) { erroAnalise(); } else {
    dialog.showMessageBox(telaInicial, { message: "Esta senha é forte! Troque-a quando julgar necessário.\nSugestões: " + m }); }
});

ipc.on('mensagem:analise:ff', (e, m) => {
    if (m == ("" || [] || undefined)) { dialog.showMessageBox(telaInicial, { message: "Esta senha é muito forte! Troque-a quando julgar necessário. Sem mensagens novas. (sk)" }); } else if (m == null) { erroAnalise(); } else {
    dialog.showMessageBox(telaInicial, { message: "Esta senha é muito forte! Troque-a quando julgar necessário.\nSugestões: " + m }); }
});

ipc.on('mensagem:analise:erro', (e) => {
    erroAnalise();
});

ipc.on('mensagem:conexao:erro', (e) => {
    dialog.showErrorBox("Erro!", "Erro ao abrir o Chaveiro! Sera que a senha esta incorreta?");
});

ipc.on('mensagem:banco:erro', (e) => {
    dialog.showErrorBox("Erro!", "Erro ao criar um Chaveiro, ");
});

ipc.on('mensagem:paridade:erro', (e) => {
    dialog.showErrorBox("Erro!", "Verifique se os campos obrigatórios estão preenchidos e se ambas as senhas são iguais!");
});

ipc.on('mensagem:populacao:erro', (e) => {
    dialog.showErrorBox("Erro!", "Erro ao Listar os Dados!");
});

ipc.on('mensagem:senha:erro', (e) => {
    dialog.showErrorBox("Erro!", "Digite a senha para acessar o Arquivo!");
});

ipc.on('mensagem:selecao:eerr', (e) => {
    dialog.showErrorBox("Erro!", "Selecione uma Entrada para editar!");
});

ipc.on('mensagem:selecao:ferr', (e) => {
    dialog.showErrorBox("Erro!", "Selecione uma Senha para analisar!");
});

ipc.on('mensagem:copia:lc', (e) => {
    dialog.showMessageBox(telaInicial, { message: "Login copiado para a área de transferência! Tenha cuidado ao colar dados sensíveis!" });
});

ipc.on('mensagem:selecao:lerr', (e) => {
    dialog.showErrorBox("Erro!", "Selecione um Login para copiar!");
});

ipc.on('mensagem:copia:sc', (e) => {
    dialog.showMessageBox(telaInicial, { message: "Senha copiada! Tenha cuidado ao colar dados sensíveis!" });
});

ipc.on('mensagem:selecao:serr', (e) => {
    dialog.showErrorBox("Erro!", "Selecione uma Senha para copiar!");
});

ipc.on('mensagem:selecao:aerr', (e) => {
    dialog.showErrorBox("Erro!", "Selecione uma Entrada para apagar!");
});

ipc.on('mensagem:selecao:pesqerr', (e) => {
    dialog.showErrorBox("Erro!", "Digite algum termo para realizar a pesquisa!");
});

ipc.on('error', (e) => {
    dialog.showErrorBox("Erro!", "Erro Não Identificado " + e);
    throw e;
});

app.on('ready', (e) => {
    criarTelaInicial();
});

app.on('window-all-closed', (e) => {
    navigator.clipboard.write(' ');
    log.info(navigator.clipboard.read());
    store.clear();

    // Fecha o App
    app.quit();
});