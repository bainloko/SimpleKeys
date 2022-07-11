/*
* SimpleKeys
* main.js
* 8/jun/2022
*/

// Modules to control application life and create native browser window
import { app, BrowserWindow, Menu, shell, ipcMain } from 'electron';
import fse from 'fs-extra';
import Path from 'path';
import Sequelize from 'sequelize';
import sqlite from 'sqlite';
import sqliteNext from 'sqlite3-offline-next';
import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';

import settings from '../config/settings.json';
import Entradas from '../model/Entradas.js';
import database, { conectar } from '../database/Database.js';
// import env from "./env";

const lock = app.requestSingleInstanceLock();
(!lock) ? app.quit() : console.log("Aplicativo inicializando!"); 

const menuItems = [
    {

    }
]

const createWindow = () => {
    // Create the browser window
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        resizable: false,
        webPreferences: {
            devTools: !app.isPackaged,
            nodeIntegration: false,
            contextIsolation: true,
            preload: Path.join(__dirname, './preload.js')
        }
    });

    // and load the app's index file.
    mainWindow.loadFile(Path.join(__dirname, './ui/index.html'));
}

app.whenReady().then(() => {
    // logInfo("Aplicativo aberto!");
    createWindow();
});

// new Notification("Senha...", {
//     body: "Senha...",    
// });

app.on('window-all-closed', () => {
    // Close the app.
    app.quit();
});