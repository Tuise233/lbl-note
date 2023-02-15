import { app, BrowserWindow, ipcMain } from 'electron'
import '../renderer/store'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow;
let top = false;
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    minWidth: 350,
    width: 350,
    minHeight: 200,
    maxHeight: 450,
    height: 260,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false,
    // resizable: false,
    transparent: true
  })

  mainWindow.loadURL(winURL)

  // 设置窗口是否可以由用户手动最大化。
  mainWindow.setMaximizable(false)
  // 设置用户是否可以调节窗口尺寸
  // mainWindow.setResizable(false)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('window:close', () => {
  app.quit();
});

ipcMain.on('window:minimize', () => {
  mainWindow.minimize();
});

ipcMain.on('window:top', () => {
  top = !top;
  mainWindow.setAlwaysOnTop(top);
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
