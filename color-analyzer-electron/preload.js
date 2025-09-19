const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  loadImage: (callback) => ipcRenderer.on('load-image', callback),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  saveFile: (defaultPath, filters) => ipcRenderer.invoke('dialog:saveFile', defaultPath, filters),

  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});

window.addEventListener('DOMContentLoaded', () => {
  console.log('Color Analyzer Electron app loaded');
});