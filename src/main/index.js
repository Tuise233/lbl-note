import { app, BrowserWindow, ipcMain, Menu, screen, Tray } from 'electron'
import path from 'path';
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
    minWidth: 850,
    width: 850,
    minHeight: 600,
    height: 600,
    // x: screenW - 350,
    // y: 0,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false,
    transparent: true
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.loadURL(winURL)

  // 设置窗口是否可以由用户手动最大化。
  mainWindow.setMaximizable(false)
  
  
  
  // 设置用户是否可以调节窗口尺寸
  // mainWindow.setResizable(false)

  //系统托盘
  var trayMenu = [{
    label: "显示窗口",
    click: () => {
      mainWindow.show();
    }
  }, {
    label: "退出",
    click: () => {
      app.quit(); 
    }
  }];

  // let iconPath = path.join(__dirname, "../renderer/assets/icons/trayLogo.png");
  //let iconPath = path.join(__dirname, "/static/trayLogo.png");
  let iconPath = process.env.NODE_ENV !== 'development' ? path.join(__dirname, "/static/trayLogo.png") : path.join(__dirname, "../renderer/assets/icons/trayLogo.png");

  let appTray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate(trayMenu);
  appTray.setToolTip("拉布拉记");
  appTray.setContextMenu(contextMenu);

  appTray.on("click", () => {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
      //appTray.destroy();
  });
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
  mainWindow.hide();
});

ipcMain.on('window:minimize', () => {
  mainWindow.minimize();
});

ipcMain.on('window:initTop', (e, state) => {
  top = state;
  mainWindow.setAlwaysOnTop(top);
});

ipcMain.on('window:top', () => {
  top = !top;
  mainWindow.setAlwaysOnTop(top);
});

const ex = process.execPath;
ipcMain.on('window:toggleAutoBoot', (e, state) => {
  app.setLoginItemSettings({
    openAtLogin: state,
    path: ex,
    args: []
  })
});
