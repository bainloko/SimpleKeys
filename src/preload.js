/*
* SimpleKeys
* preload.js
* 20/jun/2022
*/

const { contextBridge } = require('electron');
const { ipcRenderer: ipc } = require('electron-better-ipc');

const log = require('electron-log');

const ContextMenu = require("secure-electron-context-menu").default;

window.log = log.functions;

contextBridge.exposeInMainWorld("api", {
    contextMenu: ContextMenu.preloadBindings(ipc)
});