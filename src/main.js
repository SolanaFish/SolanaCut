const optimizationModule = require('./optimizationModule');

const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const babel = require('babel-core');
const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const uep = bodyParser.urlencoded({extended: false});
const pdfkit = require('pdfkit');

fs.writeFileSync(path.join(__dirname, '../lib/app.js'), babel.transformFileSync(path.join(__dirname, '/app.js')).code);

optimizationModule.addBoard(1000, 1000, false, 30);
optimizationModule.addElement(66, 101, null, 10, {top: true});
optimizationModule.addElement(669, 100);
optimizationModule.addElement(669, 100, null, 2);
optimizationModule.addElement(669, 1010, false);
optimizationModule.addElement(66, 1010);

let win;
let expressApp;

let createWindow = () => {
    win = new BrowserWindow({width: 800, height: 600});
    win.loadURL(url.format({
        pathname: path.join(__dirname, '/app.html'),
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
        let result = optimizationModule();

        let doc = new pdfkit();
        doc.pipe(fs.createWriteStream('output.pdf'));

        result.boardsOptimized.forEach((board, index) => {
            if (board.strips.length > 0) {
                let scale = board.width / 580;
                if(index === 0) {
                    doc.fontSize(20)
                    .text(`Board number ${index + 1}`, 10, 10)
                    .fontSize(12)
                    .rect(10,50, (board.width)/scale, (board.height)/scale)
                    .text(board.width, 300,  35)
                    .text(board.height, 0,  350);
                } else {
                    doc.addPage()
                    .fontSize(20)
                    .text(`Board number ${index + 1}`, 10, 10)
                    .fontSize(12)
                    .rect(10,50, (board.width)/scale, (board.height)/scale)
                    .text(board.width, 300,  35)
                    .text(board.height, 0,  350);
                }
                board.strips.forEach((strip) => {
                    strip.elements.forEach((element) => {
                        doc.rect((strip.x+element.x)/scale + 10, (strip.y + element.y)/scale + 50, (element.width)/scale, (element.height)/scale);
                        doc.stroke();
                        doc.text(element.height, (strip.x + element.x)/scale + 15, (strip.y + element.y + element.height/2)/scale + 50);
                        doc.text(element.width, (strip.x + element.x + element.width/2)/scale, (strip.y + element.y)/scale + 55);
                    });
                });
            }
        });
        doc.end();

        res.send(JSON.stringify(result));
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
        let height = parseInt(req.body.height);
        let width = parseInt(req.body.width);
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
