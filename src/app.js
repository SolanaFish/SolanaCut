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
let elements = [];
let boards = [];

const styles = {
    checkbox: {
        margin: 0
    }
};

let cut = () => {
    let req = new XMLHttpRequest();
    req.open('GET', 'http://localhost:9699/cut', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(null);
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText);
            draw(JSON.parse(req.responseText));
        }
    };
};

let getElements = () => {
    let req = new XMLHttpRequest();
    req.open('GET', 'http://localhost:9699/getElements', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(null);
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            elements = JSON.parse(req.responseText).slice();
            console.log(req.responseText);
        }
    };
};
getElements();

let getBoards = () => {
    let req = new XMLHttpRequest();
    req.open('GET', 'http://localhost:9699/getBoards', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(null);
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText);
        }
    };
};

let getKerf = () => {
    let req = new XMLHttpRequest();
    req.open('GET', 'http://localhost:9699/getKerf', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(null);
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText);
        }
    };
};

let getRimMargin = () => {
    let req = new XMLHttpRequest();
    req.open('GET', 'http://localhost:9699/getRimMargin', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(null);
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText);
        }
    };
};

let getBoardMargin = () => {
    let req = new XMLHttpRequest();
    req.open('GET', 'http://localhost:9699/getBoardMargin', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(null);
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText);
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
            console.log(req.responseText);
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
            <div>
                <div>
                    Add element
                </div>
                <TextField floatingLabelText="Height" onChange={(change, value) => {this.heightChange(change, value);}}/>
                <TextField floatingLabelText="Width" onChange={(change, value) => {this.widthChange(change, value);}}/>
                <TextField floatingLabelText="Amount" defaultValue="1" onChange={(change, value) => {this.amountChange(change, value);}}/>
                <RadioButtonGroup name="Texture" defaultSelected="none" onChange={(change,value) => {this.textureChange(change,value);}}>
                    <RadioButton value="none" label="none"/>
                    <RadioButton value="vertical" label="vertical"/>
                    <RadioButton value="horizontal" label="horizontal"/>
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
                <RaisedButton label="Add element" primary={true} onClick={()=> {this.submitElement();}}/>
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
        }
    }
}

class AddBoardMenu extends React.Component {
    render() {
        return (
            <div>
                <div>
                    Add board
                </div>
                <TextField floatingLabelText="Height" onChange={(change, value) => {this.heightChange(change, value);}}/>
                <TextField floatingLabelText="Width" onChange={(change, value) => {this.widthChange(change, value);}}/>
                <TextField floatingLabelText="Amount" defaultValue="1" onChange={(change, value) => {this.amountChange(change, value);}}/>
                <RadioButtonGroup name="Texture" defaultSelected="none" onChange={(change,value) => {this.textureChange(change,value);}}>
                    <RadioButton value="none" label="none"/>
                    <RadioButton value="vertical" label="vertical"/>
                    <RadioButton value="horizontal" label="horizontal"/>
                </RadioButtonGroup>
                <RaisedButton label="Add board" primary={true} onClick={()=> {this.submitBoard();}}/>
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
        }
    }
}

class Settings extends React.Component {
    render() {
        return(
            <div>
                <div>
                    <TextField floatingLabelText="Kerf" defaultValue="3" onChange={(change, value) => {this.setKerf(change, value);}}/>
                </div>
                <div>
                    <TextField floatingLabelText="Rim margin" defaultValue="100" onChange={(change, value) => {this.setRimMargin(change, value);}}/>
                </div>
                <div>
                    <TextField floatingLabelText="Board margin" defaultValue="30" onChange={(change, value) => {this.setBoardMargin(change, value);}}/>
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
    constructor(props) {
        super(props);
        this.state = {
            fixedHeader: true,
            fixedFooter: true,
            stripedRows: false,
            showRowHover: false,
            selectable: false,
            multiSelectable: false,
            enableSelectAll: false,
            deselectOnClickaway: true,
            showCheckboxes: false,
            elements: elements
        };
    }

    render() {
        return (
            <div>
                <Table fixedHeader={this.state.fixedHeader}
                    fixedFooter={this.state.fixedFooter}
                    selectable={this.state.selectable}
                    multiSelectable={this.state.multiSelectable}
                    onCellClick={()=> {this.setState({elements:elements});console.log(elements);}}>
                    <TableHeader
                        displaySelectedAll={this.state.showCheckboxes}
                        adjustForCheckbox={this.state.showCheckboxes}
                        enableSelectAll={this.state.enableSelectAll}>
                        <TableRow>
                            <TableHeaderColumn colSpan="4">
                                Elements table
                            </TableHeaderColumn>
                        </TableRow>
                        <TableRow>
                            <TableHeaderColumn>
                                Height
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                Width
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                Texture
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                Amount
                            </TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        displayRowCheckbox={this.state.showCheckboxes}
                        deselectOnClickaway={this.state.deselectOnClickaway}
                        showRowHover={this.state.showRowHover}
                        strippedRows={this.state.strippedRows}>
                        {this.state.elements.forEach((element, index) => {
                            console.log(element);
                            <TableRow>
                                <TableRowColumn>
                                    element.height
                                </TableRowColumn>
                                <TableRowColumn>
                                    {element.width}
                                </TableRowColumn>
                                <TableRowColumn>
                                    {element.height}
                                </TableRowColumn>
                                <TableRowColumn>
                                    {element.height}
                                </TableRowColumn>
                            </TableRow>;
                        })}
                        <TableRow>
                            <TableRowColumn>
                                t
                            </TableRowColumn>
                            <TableRowColumn>
                                e1
                            </TableRowColumn>
                            <TableRowColumn>
                                s
                            </TableRowColumn>
                            <TableRowColumn>
                                t
                            </TableRowColumn>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        );
    }
}

class Result extends React.Component {
    render() {
        return (
            <div>
                <canvas id="page" width="1000" height="1000"></canvas>
            </div>
        );
    }
}
function draw(cut) {
    let canvas = document.getElementById('page');
    let ctx = canvas.getContext('2d');
    cut.boardsOptimized[0].strips.forEach((strip) => {
        strip.elements.forEach((element) => {
            ctx.strokeRect(strip.x + element.x, strip.y + element.y, element.width, element.height);
        });
    });
}

ReactDom.render(
    <MuiThemeProvider>
    <div>
        <AppBar title="SolanaCut"/>
        <AddElementMenu/>
        <AddBoardMenu/>
        <ElementTable id="e"/>
        <Settings/>
        <Result id="test"/>
    </div>
</MuiThemeProvider>, document.getElementById('app'));
