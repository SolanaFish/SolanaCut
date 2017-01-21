const {
    app,
    BrowserWindow
} = require('electron');
const path = require('path');
const url = require('url');
const optimizationModule = require('./optimizationModule');
const express = require('express');
optimizationModule.addBoard(1000, 1000, null, 30);
optimizationModule.addElement(66, 101, null, 10, {
    top: true
});
optimizationModule.addElement(669, 100);
optimizationModule.addElement(669, 100, null, 2);
optimizationModule.addElement(669, 1010);
optimizationModule.addElement(66, 1010);

const pug = require('electron-pug')({
    pretty: true
}, {
    test: optimizationModule()
});

// console.log(optimizationModule.getBoards());
// console.log(optimizationModule.getElements());

let win;
let expressApp;

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

app.on('ready', () => {
    expressApp = express();
    expressApp.listen('9699');
    expressApp.use(express.static(__dirname));
    expressApp.get('/test', (req, res) => {
        res.send(JSON.stringify(optimizationModule()));
    });
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('active', () => {
    if (win === null) {
        createWindow();
    }
});
