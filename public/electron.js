// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
// eslint-disable-next-line no-unused-vars
const url = require('url')
const isDev = require('electron-is-dev')

let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true
    }
  })

  // and load the index.html of the app.
  // mainWindow.loadFile('public/index.html')
  // mainWindow.loadURL('http://localhost:3000/')
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`)

  // Open the DevTools.
  if(isDev) mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});