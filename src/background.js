'use strict'

import { app, protocol, BrowserWindow, globalShortcut, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
// import path from 'path'
// import Database from 'better-sqlite3';

const isDevelopment = process.env.NODE_ENV !== 'production'
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

// const pathToDbFile = path.join(
//   isDevelopment ? __static : __dirname,
//   './database/database.db',
// );

// const db = new Database(pathToDbFile);

let win;
let splash;
async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    show: false,
    frame: false,
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.setMenu(null)
  win.setTitle('حسابات المعهد')
  win.setIcon(__static + '/icons/icon.ico')

  // const users = db.prepare('SELECT * FROM users').all();
  // console.log(users)
}

async function createSplash() {
  splash = new BrowserWindow({
    width: 500,
    height: 300,
    show: true,
    frame: false,
    alwaysOnTop: true,
    center: true,
  })

  splash.loadURL(__static + '/splashscreen.html')
  splash.setMenu(null)
  splash.setTitle('برنامج المعاهد')
  splash.setIcon(__static + '/icons/icon.ico')
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.on('ready', async (event) => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }

  createSplash()
  createWindow()

  if (event.sender.isReady) {
    setTimeout(() => {
      win.show()
      splash.close()
    }, 10000)
  }

  globalShortcut.register('CommandOrControl+Shift+I', () => win.webContents.openDevTools())

  ipcMain.on('quit', () => {
    app.quit()
  })
  ipcMain.on('maximize', () => {
    win.isMaximized() ? win.unmaximize() : win.maximize()
  })
  ipcMain.on('minimize', () => {
    win.minimize()
  })
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}


export default app