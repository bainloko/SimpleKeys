/*
* SimpleKeys
* main.js
* 8/jun/2022
*/

// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron');
const path = require('path');

const createWindow = () => {
    // Create the browser window
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // and load the app's index file.
    window.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    // Close the app.
    app.quit();
});