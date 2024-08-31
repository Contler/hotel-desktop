import { app, BrowserWindow, ipcMain } from "electron";
import { listenToFCMMessages, registerFCMToken } from "./fcm";
import path from 'path';

let mainWindow: BrowserWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env["NODE_ENV"] === 'development') {
    mainWindow.loadURL('http://localhost:4200');
  } else {
    mainWindow.loadFile('./build/browser/index.html');
  }
};

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null || mainWindow.isDestroyed()) {
    createWindow();
  }
});


let fcmData: any;

ipcMain.handle('register-fcm-token', async (event) => {
  try {
    const registrationData = await registerFCMToken();
    fcmData = {
      acg: registrationData.acg,
      authSecret: registrationData.authSecret,
      privateKey: registrationData.privateKey
    };
    return registrationData.token;
  } catch (error) {
    console.error('Failed to register FCM token:', error);
    throw error;
  }
});

ipcMain.on('start-fcm-listener', () => {
  console.log('start-fcm-listener');
  if (fcmData) {
    listenToFCMMessages(fcmData.acg, fcmData.authSecret, fcmData.privateKey);
  } else {
    console.error('FCM data not found. Please register first.');
  }
});
