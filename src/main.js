/*
* SimpleKeys
* main.js
* 8/jun/2022
*/

// Modules to control application life and create native browser window
import { app, BrowserWindow } from 'electron';
import fse from 'fs-extra';
import Path from 'path';

// import env from "./env";
import database from './database/Database';

const createWindow = () => {
    // Create the browser window
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
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