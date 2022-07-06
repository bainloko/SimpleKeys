/*
* SimpleKeys
* main.js
* 8/jun/2022
*/

// Modules to control application life and create native browser window
import { app, BrowserWindow } from 'electron';
import fse from 'fs-extra';
import Path from 'path';
import Sequelize from 'sequelize';
import sqlite from 'sqlite';
import sqliteNext from 'sqlite3-offline-next';
import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';

import settings from '../config/settings.json';
import Entradas from '../models/Entradas.js';
import database, { conectar } from '../database/Database.js';
// import env from "./env";

const createWindow = () => {
    // Create the browser window
    const mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        resizable: false,
        webPreferences: {
            devTools: !app.isPackaged,
            nodeIntegration: true,
            contextIsolation: true,
            preload: Path.join(__dirname, './preload.js')
        }
    });

    // and load the app's index file.
    mainWindow.loadFile(Path.join(__dirname, './ui/index.html'));
}

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    // Close the app.
    app.quit();
});