import { contextBridge, ipcRenderer } from 'electron';

console.log('Preload');

contextBridge.exposeInMainWorld('electron', {
  registerFCMToken: () => ipcRenderer.invoke('register-fcm-token'),
  startFCMListener: () => ipcRenderer.send('start-fcm-listener'),
});
