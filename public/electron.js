/* eslint-disable no-unused-vars */
// Modules to control application life and create native browser window
const {app, BrowserWindow, remote } = require('electron')
const ipc = require('electron').ipcMain
const path = require('path')
// eslint-disable-next-line no-unused-vars
const url = require('url')
const isDev = require('electron-is-dev')

let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: isDev? 1700 : 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      worldSafeExecuteJavaScript: true,
      enableRemoteModule: true,
      devTools: isDev? true : false
    }
  })

  // and load the index.html of the app.
  // win.loadFile('public/index.html')
  // win.loadURL('http://localhost:3000/')
  win.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`)

  // Open the DevTools.
  if(isDev) win.webContents.openDevTools()

  win.setContentProtection(true)

  win.on('closed', () => win = null);

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('ping', '🤘')
  } );

}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
