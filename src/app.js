import React from 'react';
import ReactDom from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
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

class AddElementMenu extends React.Component {
    render() {
        return (
            <div>
                <TextField floatingLabelText="Height"/>
                <TextField floatingLabelText="Width"/>
                <TextField floatingLabelText="Amount"/>
            </div>
        );
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
            showCheckboxes: false
        };
    }

    render() {
        return (
            <div>
                <Table fixedHeader={this.state.fixedHeader}
                    fixedFooter={this.state.fixedFooter}
                    selectable={this.state.selectable}
                    multiSelectable={this.state.multiSelectable}>
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
                        {elements.map((element, index)=> {
                            <TableRow key={index}>
                                <TableRowColumn>
                                    {element.height}
                                </TableRowColumn>
                                <TableRowColumn>
                                    {element.Width}
                                </TableRowColumn>
                                <TableRowColumn>
                                    {element.texture}
                                </TableRowColumn>
                                <TableRowColumn>
                                    {element.amount}
                                </TableRowColumn>
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

ReactDom.render(
    <MuiThemeProvider>
    <div>
        <AppBar title="SolanaCut"/>
        <AddElementMenu/>
        <ElementTable id="e"/>
    </div>
</MuiThemeProvider>, document.getElementById('app'));

let cut = () => {
    let req = new XMLHttpRequest();
    req.open('GET', 'http://localhost:9699/cut', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(null);
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText);
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
            elements = JSON.parse(req.responseText);
            console.log(req.responseText);
        }
    };
};

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

getElements();
