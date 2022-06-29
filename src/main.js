/*
* SimpleKeys
* main.js
* 8/jun/2022
*/

// Modules to control application life and create native browser window
import { app, BrowserWindow } from 'electron';
import express from 'express';
import fse from 'fs-extra';
import Path from 'path';
import ejs from 'ejs';

const createWindow = () => {
    // Create the browser window
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,
        webPreferences: {
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