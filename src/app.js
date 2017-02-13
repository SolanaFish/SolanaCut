import React from 'react';
import ReactDom from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {
    Table,
    TableBody,
    TableFooter,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from 'material-ui/Table';

injectTapEventPlugin();
let elements = [{height: 66, width: 101, texture: null, rims: 201}];
let boards = [];

const styles = {
    checkbox: {
        margin: 0
    }
};

let lang = {
    addElementMenu: {
        addElement: 'Dodaj element',
        height: 'wysokosc',
        width: 'szerokosc',
        amount: 'ilosc',
        texture: {
            texture: 'Tekstura',
            none: 'nieistotna',
            vertical: 'pionowa',
            horizontal: 'pozioma'
        }
    },
    addBoardMenu: {
        addBoard: 'Dodaj plyte',
        height: 'wysokosc',
        width: 'szerokosc',
        amount: 'ilosc',
        texture: {
            texture: 'Tekstura',
            none: 'nieistotna',
            vertical: 'pionowa',
            horizontal: 'pozioma'
        }
    },
    settings: {
        kerf: 'rzaz',
        rimMargin:'margines doklejki',
        boardMargin: 'wyrownanie plyty'
    },
    results: {
        results: 'wyniki rozkroju',
        rim: 'potrzebna doklejka',
        notOptimized: 'elementy niezoptymalizowane',
        boardNumber: 'plyta numer: '
    }
};

let cut = () => {
    let req = new XMLHttpRequest();
    req.open('GET', 'http://localhost:9699/cut', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(null);
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            ReactDom.render(
                <MuiThemeProvider>
                <div>
                    <AppBar title="SolanaCut - cut results"/>
                    <Result data={JSON.parse(req.responseText)}/>
                </div>
            </MuiThemeProvider>, document.getElementById('app'));
        }
    };
};

let addElement = (height, width, texture = null, amount = 1, rims = {
    top: false,
    right: false,
    bottom: false,
    left: false
}) => {
    let req = new XMLHttpRequest();
    req.open('POST', 'http://localhost:9699/addElement', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(`height=${height}&width=${width}&texture=${texture}&amount=${amount}&rims=${JSON.stringify(rims)}`);
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
        }
    };
};

let addBoard = (height, width, texture = null, amount = 1) => {
    let req = new XMLHttpRequest();
    req.open('POST', 'http://localhost:9699/addBoard', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(`height=${height}&width=${width}&texture=${texture}&amount=${amount}`);
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText);
        }
    };
};

let setKerf = (kerf) => {
    let req = new XMLHttpRequest();
    req.open('POST', 'http://localhost:9699/setKerf', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(`kerf=${kerf}`);
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText);
        }
    };
};

let setRimMargin = (margin) => {
    let req = new XMLHttpRequest();
    req.open('POST', 'http://localhost:9699/setRimMargin', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(`margin=${margin}`);
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText);
        }
    };
};

let setBoardMargin = (margin) => {
    let req = new XMLHttpRequest();
    req.open('POST', 'http://localhost:9699/setBoardMargin', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(`margin=${margin}`);
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText);
        }
    };
};

class AddElementMenu extends React.Component {
    constructor(props) {
        super(props);
        this.rims = {
            top: false,
            right: false,
            bottom: false,
            left: false
        };
    }
    render() {
        return (
            <div className="container">
                <div className="subContainer">
                    <div>
                        {lang.addElementMenu.addElement}
                    </div>
                    <TextField floatingLabelText={lang.addElementMenu.height} onChange={(change, value) => {this.heightChange(change, value);}}/>
                    <TextField floatingLabelText={lang.addElementMenu.width} onChange={(change, value) => {this.widthChange(change, value);}}/>
                    <TextField floatingLabelText={lang.addElementMenu.amount} defaultValue="1" onChange={(change, value) => {this.amountChange(change, value);}}/>
                    <RadioButtonGroup name="Texture" defaultSelected="none" onChange={(change,value) => {this.textureChange(change,value);}}>
                        <RadioButton value="none" label={lang.addElementMenu.texture.none}/>
                        <RadioButton value="vertical" label={lang.addElementMenu.texture.vertical}/>
                        <RadioButton value="horizontal" label={lang.addElementMenu.texture.horizontal}/>
                    </RadioButtonGroup>
                    <div className="elementDisplay">
                        <div className="elementTop">
                            <Checkbox labelPosition="" onCheck={(e, c) => {this.rimsChange('top', c);}}/>
                        </div>
                        <div className="elementMiddle">
                            <div className="elementSide">
                                <Checkbox labelPosition="" onCheck={(e, c) => {this.rimsChange('left', c);}}></Checkbox>
                            </div>
                            <div id="element"></div>
                            <div className="elementSide">
                                <Checkbox labelPosition="" onCheck={(e, c) => {this.rimsChange('right', c);}}></Checkbox>
                            </div>
                        </div>
                        <div className="elementTop">
                            <Checkbox labelPosition="" onCheck={(e, c) => {this.rimsChange('bottom', c);}}></Checkbox>
                        </div>
                    </div>
                    <RaisedButton label={lang.addElementMenu.addElement} primary={true} onClick={()=> {this.submitElement();}}/>
                </div>
                <div className="subContainer">
                    <ElementTable elements={this.props.elements}/>
                </div>
            </div>
        );
    }
    textureChange(e, v) {
        this.texture = v;
    }
    heightChange(e, v) {
        this.height = JSON.parse(v);
    }
    widthChange(e, v) {
        this.width = JSON.parse(v);
    }
    amountChange(e, v) {
        this.amount = JSON.parse(v);
    }
    rimsChange(index, checked) {
        this.rims[index] = checked;
    }
    submitElement() {
        if(this.height && this.width) {
            if(this.texture === 'vertical') {
                this.texture = true;
            } else if(this.texture === 'horizontal') {
                this.texture = false;
            } else {
                this.texture = null;
            }
            if(!this.amount) {
                this.amount = 1;
            }
            if(!this.rims) {
                this.rims = null;
            }
            addElement(this.height, this.width, this.texture, this.amount, this.rims);
            this.props.onAdd();
        }
    }
}

class AddBoardMenu extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="subContainer">
                    <div>
                        {lang.addBoardMenu.addBoard}
                    </div>
                    <TextField floatingLabelText={lang.addBoardMenu.height} onChange={(change, value) => {this.heightChange(change, value);}}/>
                    <TextField floatingLabelText={lang.addBoardMenu.width} onChange={(change, value) => {this.widthChange(change, value);}}/>
                    <TextField floatingLabelText={lang.addBoardMenu.amount} defaultValue="1" onChange={(change, value) => {this.amountChange(change, value);}}/>
                    <RadioButtonGroup name="Texture" defaultSelected="none" onChange={(change,value) => {this.textureChange(change,value);}}>
                        <RadioButton value="none" label={lang.addBoardMenu.texture.none}/>
                        <RadioButton value="vertical" label={lang.addBoardMenu.texture.vertical}/>
                        <RadioButton value="horizontal" label={lang.addBoardMenu.texture.horizontal}/>
                    </RadioButtonGroup>
                    <RaisedButton label={lang.addBoardMenu.addBoard} primary={true} onClick={()=> {this.submitBoard();}}/>
                </div>
                <div className="subContainer">
                    <BoardsTable boards={this.props.boards}/>
                </div>
            </div>
        );
    }
    textureChange(e, v) {
        this.texture = v;
    }
    heightChange(e, v) {
        this.height = JSON.parse(v);
        console.log(this.height);
    }
    widthChange(e, v) {
        this.width = JSON.parse(v);
        console.log(this.width);
    }
    amountChange(e, v) {
        this.amount = JSON.parse(v);
    }
    submitBoard() {
        if(this.height && this.width) {
            if(this.texture === 'vertical') {
                this.texture = true;
            } else if(this.texture === 'horizontal') {
                this.texture = false;
            } else {
                this.texture = null;
            }
            if(!this.amount) {
                this.amount = 1;
            }
            addBoard(this.height, this.width, this.texture, this.amount);
            this.props.onAdd();
        }
    }
}

class Settings extends React.Component {
    render() {
        return(
            <div>
                <div>
                    <TextField floatingLabelText={lang.settings.kerf} value={this.props.kerf} onChange={(change, value) => {this.setKerf(change, value);}}/>
                </div>
                <div>
                    <TextField floatingLabelText={lang.settings.rimMargin} value={this.props.rimMargin} onChange={(change, value) => {this.setRimMargin(change, value);}}/>
                </div>
                <div>
                    <TextField floatingLabelText={lang.settings.boardMargin} value={this.props.boardMargin} onChange={(change, value) => {this.setBoardMargin(change, value);}}/>
                </div>
            </div>
        );
    }
    setRimMargin(e, margin) {
        margin = JSON.parse(margin);
        if(typeof margin === 'number') {
            setRimMargin(margin);
        }
    }
    setBoardMargin(e, margin) {
        margin = JSON.parse(margin);
        if(typeof margin === 'number') {
            setBoardMargin(margin);
        }
    }
    setKerf(e, kerf) {
        kerf = JSON.parse(kerf);
        if(typeof kerf === 'number') {
            setKerf(kerf);
        }
    }
}

class ElementTable extends React.Component {
    render() {
        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHeaderColumn>
                            {lang.addElementMenu.height}
                        </TableHeaderColumn>
                        <TableHeaderColumn>
                            {lang.addElementMenu.width}
                        </TableHeaderColumn>
                        <TableHeaderColumn>
                            {lang.addElementMenu.texture.texture}
                        </TableHeaderColumn>
                        <TableHeaderColumn>
                            {lang.addElementMenu.amount}
                        </TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {this.props.elements.map((element) => {
                        return (
                            <TableRow>
                                <TableRowColumn>
                                    {element.height}
                                </TableRowColumn>
                                <TableRowColumn>
                                    {element.width}
                                </TableRowColumn>
                                <TableRowColumn>
                                    {element.texture}
                                </TableRowColumn>
                                <TableRowColumn>
                                    {element.amount}
                                </TableRowColumn>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        );
    }
}

class BoardsTable extends React.Component {
    render() {
        return (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHeaderColumn>
                            {lang.addBoardMenu.height}
                        </TableHeaderColumn>
                        <TableHeaderColumn>
                            {lang.addBoardMenu.width}
                        </TableHeaderColumn>
                        <TableHeaderColumn>
                            {lang.addBoardMenu.texture.texture}
                        </TableHeaderColumn>
                        <TableHeaderColumn>
                            {lang.addBoardMenu.amount}
                        </TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {this.props.boards.map((element) => {
                        return (
                            <TableRow>
                                <TableRowColumn>
                                    {element.height}
                                </TableRowColumn>
                                <TableRowColumn>
                                    {element.width}
                                </TableRowColumn>
                                <TableRowColumn>
                                    {element.texture}
                                </TableRowColumn>
                                <TableRowColumn>
                                    {element.amount}
                                </TableRowColumn>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        );
    }
}

class Result extends React.Component {
    componentDidMount() {
        this.props.data.boardsOptimized.forEach((board, index) => {
            if(board.strips.length > 0) {
                let canvas = document.getElementById(`board${index}`);
                let ctx = canvas.getContext('2d');
                ctx.font = '12px serif';
                board.strips.forEach((strip) => {
                    strip.elements.forEach((element) => {
                        ctx.strokeRect((strip.x + element.x)/board.scale, (strip.y + element.y)/board.scale, element.width / board.scale, element.height/ board.scale);
                        ctx.fillText(element.height,( strip.x + element.x + 5)/ board.scale, (strip.y + element.y + element.height/2)/board.scale);
                        ctx.fillText(element.width, (strip.x + element.x + element.width/2) / board.scale, (strip.y + element.y + 16)/ board.scale);
                    });
                });
            }
        });
    }

    render() {
        return (
            <div>
                <div>
                    {lang.results.rim}: {this.props.data.rim}
                </div>
                <div>
                    {lang.results.notOptimized}: {this.props.data.elementsNotOptimized.length}
                </div>
                <div>
                    {this.props.data.boardsOptimized.map((board, index) => {
                        if(board.strips.length > 0) {
                            board.scale = board.width / 800;
                            return(
                                <div>
                                    {lang.results.boardNumber + (index + 1)}
                                    <br/>
                                    <canvas id={"board" + index} width={board.width / board.scale} height={board.height / board.scale}></canvas>
                                </div>
                            );
                        } else {
                            return;
                        }
                    })}
                </div>
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {kerf: 10, elements:[], boards:[], rimMargin:0, boardMargin:0};
        this.getKerf();
        this.getBoardMargin();
        this.getRimMargin();
        this.getElements();
        this.getBoards();
    }

    getElements() {
        let req = new XMLHttpRequest();
        req.open('GET', 'http://localhost:9699/getElements', true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.send(null);
        let that = this;
        req.onreadystatechange = function() {
            if (req.readyState == 4 && req.status == 200) {
                that.setState({elements:JSON.parse(req.responseText)});
            }
        };
    }

    getBoards() {
        let req = new XMLHttpRequest();
        req.open('GET', 'http://localhost:9699/getBoards', true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.send(null);
        let that = this;
        req.onreadystatechange = function() {
            if (req.readyState == 4 && req.status == 200) {
                that.setState({boards:JSON.parse(req.responseText)});
                console.log('ddddd');
            }
        };
    }

    getKerf() {
        let req = new XMLHttpRequest();
        req.open('GET', 'http://localhost:9699/getKerf', true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.send(null);
        let that = this;
        req.onreadystatechange = function() {
            if (req.readyState == 4 && req.status == 200) {
                that.setState({kerf:JSON.parse(req.responseText)});
            }
        };
    }

    getRimMargin() {
        let req = new XMLHttpRequest();
        req.open('GET', 'http://localhost:9699/getRimMargin', true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.send(null);
        let that = this;
        req.onreadystatechange = function() {
            if (req.readyState == 4 && req.status == 200) {
                that.setState({rimMargin:JSON.parse(req.responseText)});
            }
        };
    }

    getBoardMargin() {
        let req = new XMLHttpRequest();
        req.open('GET', 'http://localhost:9699/getBoardMargin', true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.send(null);
        let that = this;
        req.onreadystatechange = function() {
            if (req.readyState == 4 && req.status == 200) {
                that.setState({boardMargin:JSON.parse(req.responseText)});
            }
        };
    }

    render() {
        return(
            <MuiThemeProvider>
            <div>
                <AppBar title="SolanaCut"/>
                <AddElementMenu onAdd={()=>{this.getElements();}} elements={this.state.elements}/>
                <AddBoardMenu  onAdd={()=>{this.getBoards();}} boards={this.state.boards}/>
                <Settings kerf={this.state.kerf} rimMargin={this.state.rimMargin} boardMargin={this.state.boardMargin}/>
                <RaisedButton label="cut" primary={true} onClick={()=> {cut();}}/>
            </div>
        </MuiThemeProvider>
        );
    }
}

function update() {
    ReactDom.render(
        <App/>, document.getElementById('app'));
}

ReactDom.render(
    <App/>, document.getElementById('app'));
