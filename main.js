const electron = require('electron');
const url = require('url');
const path = require('path');
const {app, BrowserWindow, Menu} = electron;

let mainWindow;

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        frame: false,
        width: 880,
        minWidth: 600,
        height: 660,
        minHeight: 500,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    });

    mainWindow.loadURL(url.format({
        pathname:path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));

    mainWindow.on('closed', function() {
        app.quit();
    });

    // mainWindow.webContents.openDevTools();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
});