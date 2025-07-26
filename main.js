// npm start

const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
            nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
// mainWindow.webContents.openDevTools();
}

// Iniciar el servidor Express al arrancar Electron
let serverProcess;
app.whenReady().then(() => {
  // Solo iniciar el servidor si no está ya iniciado
  if (!serverProcess) {
    const userDataPath = app.getPath('userData');
    serverProcess = fork(path.join(__dirname, 'server.js'), [userDataPath]);
  }
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});