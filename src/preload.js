/*
* SimpleKeys
* preload.js
* 20/jun/2022
*/

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('primeiraAPI', {
    // setTitle: (title) => ipcRenderer.send('set-title', title)
});