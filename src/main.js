const {
    app,
    BrowserWindow
} = require('electron');
const path = require('path');
const url = require('url');
const pug = require('electron-pug')({pretty: true});

let win;

var createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600
    });
    win.loadURL(url.format({
        pathname: path.join(__dirname, '/views/app.pug'),
        protocol: 'file:',
        slashes: true
    }));
    win.on('closed', () => {
        win = null;
    });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('active', () => {
    if(win === null) {
        createWindow();
    }
});
