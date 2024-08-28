const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electron', {
  sendNotifications: (title, body) => ipcRenderer.send('send-notifications', { title, body }),
})

window.addEventListener('load', () => {
  console.log('preload.js loaded');
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/assets/firebase-messaging-sw.mjs')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  }
})
