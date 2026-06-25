const { app, BrowserWindow } = require('electron');
const path = require('path');
const db = require('./db');

// Import IPC handlers
const registerDashboardIPC = require('./ipc/dashboard');
const registerTurmasIPC = require('./ipc/turmas');
const registerAlunosIPC = require('./ipc/alunos');
const registerEmprestimosIPC = require('./ipc/emprestimos');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 650,
    title: 'Biblioteca Escolar',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Hide the menu bar by default for a cleaner look
  mainWindow.setMenuBarVisibility(false);

  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // Open Chrome DevTools in development
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Register IPC handlers
registerDashboardIPC(db);
registerTurmasIPC(db);
registerAlunosIPC(db);
registerEmprestimosIPC(db);

app.whenReady().then(() => {
  // Initialize the database on startup when app is ready
  db.init();
  
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
