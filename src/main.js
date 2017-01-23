const optimizationModule = require('./optimizationModule');

const {
    app,
    BrowserWindow
} = require('electron');
const path = require('path');
const url = require('url');

const express = require('express');
const bodyParser = require('body-parser');
const uep = bodyParser.urlencoded({
    extended: false
});

optimizationModule.addBoard(1000, 1000, false, 30);
optimizationModule.addElement(66, 101, null, 10, {
    top: true
});
optimizationModule.addElement(669, 100);
optimizationModule.addElement(669, 100, null, 2);
optimizationModule.addElement(669, 1010, false);
optimizationModule.addElement(66, 1010);

const pug = require('electron-pug')({
    pretty: true
}, {
    test: optimizationModule()
});

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

    expressApp.get('/cut', (req, res) => {
        res.send(JSON.stringify(optimizationModule()));
    });
    expressApp.get('/getElements', (req, res) => {
        res.send(JSON.stringify(optimizationModule.getElements()));
    });
    expressApp.get('/getBoards', (req, res) => {
        res.send(JSON.stringify(optimizationModule.getBoards()));
    });
    expressApp.get('/getKerf', (req, res) => {
        res.send(JSON.stringify(optimizationModule.getKerf()));
    });
    expressApp.get('/getRimMargin', (req, res) => {
        res.send(JSON.stringify(optimizationModule.getRimMargin()));
    });
    expressApp.get('/getBoardMargin', (req, res) => {
        res.send(JSON.stringify(optimizationModule.getBoardMargin()));
    });

    expressApp.post('/addElement', uep, (req, res) => {
        let height = req.body.height;
        let width = req.body.width;
        let texture = req.body.texture || null;
        let amount = req.body.amount || 1;
        let rims = JSON.parse(req.body.rims) || {
            top: false,
            right: false,
            bottom: false,
            left: false
        };
        optimizationModule.addElement(height, width, texture, amount, rims);
        res.sendStatus(200);
    });
    expressApp.post('/addBoard', uep, (req, res) => {
        let height = req.body.height;
        let width = req.body.width;
        let texture = req.body.texture;
        let amount = req.body.amount;
        optimizationModule.addBoard(height, width, texture, amount);
        res.sendStatus(200);
    });
    expressApp.post('/setKerf', uep, (req, res) => {
        let kerf = req.body.kerf;
        optimizationModule.setKerf(kerf);
        res.sendStatus(200);
    });
    expressApp.post('/setRimMargin', uep, (req, res) => {
        let margin = req.body.margin;
        optimizationModule.setRimMargin(margin);
        res.sendStatus(200);
    });
    expressApp.post('/setBoardMargin', uep, (req, res) => {
        let margin = req.body.margin;
        optimizationModule.setBoardMargin(margin);
        res.sendStatus(200);
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
