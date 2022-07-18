/*
* SimpleKeys
* preload.js
* 20/jun/2022
*/

import { contextBridge, ipcRenderer } from 'electron';
import log from 'electron-log';

window.log = log.functions;

contextBridge.exposeInMainWorld('primeiraAPI', {
    // setTitle: (title) => ipcRenderer.send('set-title', title)  
});