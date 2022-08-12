/*
* SimpleKeys
* preload.js
* 20/jun/2022
*/

const { contextBridge, ipcRenderer } = require('electron');

const log = require('electron-log');

window.log = log.functions;

contextBridge.exposeInMainWorld('', {
    // setTitle: (title) => ipcRenderer.send('set-title', title)  
});