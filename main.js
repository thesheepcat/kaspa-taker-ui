// main.js
const { app, BrowserWindow, session } = require('electron');
const path = require('path');
//const isDev = require('electron-is-dev');

// SOCKS5 proxy configuration from your requirements
const PROXY_RULES = {
    proxyRules: 'socks5://127.0.0.1:9050',
    proxyBypassRules: '<-loopback>'
};

let mainWindow;

async function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1600,
        height: 1000,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    
    // Configure proxy
    await session.defaultSession.setProxy(PROXY_RULES);
    
    // Add WebSocket protocol handling
    session.defaultSession.webRequest.onBeforeSendHeaders(
        { urls: ['wss://*/*', 'ws://*/*'] },
        (details, callback) => {
        const { requestHeaders } = details;
        requestHeaders['Sec-WebSocket-Protocol'] = 'borsh';
        callback({ requestHeaders });
        }
    );
    app.commandLine.appendSwitch('ignore-certificate-errors');

    mainWindow.loadFile('public/index.html');

    /* 
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }
    */
    mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});