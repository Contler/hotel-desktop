interface ElectronAPI {
  registerFCMToken: () => Promise<string>;
  startFCMListener: () => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {};
