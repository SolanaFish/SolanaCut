'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactTapEventPlugin = require('react-tap-event-plugin');

var _reactTapEventPlugin2 = _interopRequireDefault(_reactTapEventPlugin);

var _MuiThemeProvider = require('material-ui/styles/MuiThemeProvider');

var _MuiThemeProvider2 = _interopRequireDefault(_MuiThemeProvider);

var _RaisedButton = require('material-ui/RaisedButton');

var _RaisedButton2 = _interopRequireDefault(_RaisedButton);

var _AppBar = require('material-ui/AppBar');

var _AppBar2 = _interopRequireDefault(_AppBar);

var _TextField = require('material-ui/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _Table = require('material-ui/Table');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(0, _reactTapEventPlugin2.default)();
var elements = [];
var boards = [];

var AddElementMenu = function (_React$Component) {
    _inherits(AddElementMenu, _React$Component);

    function AddElementMenu() {
        _classCallCheck(this, AddElementMenu);

        return _possibleConstructorReturn(this, (AddElementMenu.__proto__ || Object.getPrototypeOf(AddElementMenu)).apply(this, arguments));
    }

    _createClass(AddElementMenu, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(_TextField2.default, { floatingLabelText: 'Height' }),
                _react2.default.createElement(_TextField2.default, { floatingLabelText: 'Width' }),
                _react2.default.createElement(_TextField2.default, { floatingLabelText: 'Amount' })
            );
        }
    }]);

    return AddElementMenu;
}(_react2.default.Component);

var ElementTable = function (_React$Component2) {
    _inherits(ElementTable, _React$Component2);

    function ElementTable(props) {
        _classCallCheck(this, ElementTable);

        var _this2 = _possibleConstructorReturn(this, (ElementTable.__proto__ || Object.getPrototypeOf(ElementTable)).call(this, props));

        _this2.state = {
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
        return _this2;
    }

    _createClass(ElementTable, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    _Table.Table,
                    { fixedHeader: this.state.fixedHeader,
                        fixedFooter: this.state.fixedFooter,
                        selectable: this.state.selectable,
                        multiSelectable: this.state.multiSelectable },
                    _react2.default.createElement(
                        _Table.TableHeader,
                        {
                            displaySelectedAll: this.state.showCheckboxes,
                            adjustForCheckbox: this.state.showCheckboxes,
                            enableSelectAll: this.state.enableSelectAll },
                        _react2.default.createElement(
                            _Table.TableRow,
                            null,
                            _react2.default.createElement(
                                _Table.TableHeaderColumn,
                                { colSpan: '4' },
                                'Elements table'
                            )
                        ),
                        _react2.default.createElement(
                            _Table.TableRow,
                            null,
                            _react2.default.createElement(
                                _Table.TableHeaderColumn,
                                null,
                                'Height'
                            ),
                            _react2.default.createElement(
                                _Table.TableHeaderColumn,
                                null,
                                'Width'
                            ),
                            _react2.default.createElement(
                                _Table.TableHeaderColumn,
                                null,
                                'Texture'
                            ),
                            _react2.default.createElement(
                                _Table.TableHeaderColumn,
                                null,
                                'Amount'
                            )
                        )
                    ),
                    _react2.default.createElement(
                        _Table.TableBody,
                        {
                            displayRowCheckbox: this.state.showCheckboxes,
                            deselectOnClickaway: this.state.deselectOnClickaway,
                            showRowHover: this.state.showRowHover,
                            strippedRows: this.state.strippedRows },
                        elements.map(function (element, index) {
                            _react2.default.createElement(
                                _Table.TableRow,
                                { key: index },
                                _react2.default.createElement(
                                    _Table.TableRowColumn,
                                    null,
                                    element.height
                                ),
                                _react2.default.createElement(
                                    _Table.TableRowColumn,
                                    null,
                                    element.Width
                                ),
                                _react2.default.createElement(
                                    _Table.TableRowColumn,
                                    null,
                                    element.texture
                                ),
                                _react2.default.createElement(
                                    _Table.TableRowColumn,
                                    null,
                                    element.amount
                                )
                            );
                        })
                    )
                )
            );
        }
    }]);

    return ElementTable;
}(_react2.default.Component);

_reactDom2.default.render(_react2.default.createElement(
    _MuiThemeProvider2.default,
    null,
    _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_AppBar2.default, { title: 'SolanaCut' }),
        _react2.default.createElement(AddElementMenu, null),
        _react2.default.createElement(ElementTable, { id: 'e' })
    )
), document.getElementById('app'));

var cut = function cut() {
    var req = new XMLHttpRequest();
    req.open('GET', 'http://localhost:9699/cut', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(null);
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText);
        }
    };
};

var getElements = function getElements() {
    var req = new XMLHttpRequest();
    req.open('GET', 'http://localhost:9699/getElements', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(null);
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            elements = JSON.parse(req.responseText);
            console.log(req.responseText);
        }
    };
};

var getBoards = function getBoards() {
    var req = new XMLHttpRequest();
    req.open('GET', 'http://localhost:9699/getBoards', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(null);
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText);
        }
    };
};

var getKerf = function getKerf() {
    var req = new XMLHttpRequest();
    req.open('GET', 'http://localhost:9699/getKerf', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(null);
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText);
        }
    };
};

var getRimMargin = function getRimMargin() {
    var req = new XMLHttpRequest();
    req.open('GET', 'http://localhost:9699/getRimMargin', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(null);
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText);
        }
    };
};

var getBoardMargin = function getBoardMargin() {
    var req = new XMLHttpRequest();
    req.open('GET', 'http://localhost:9699/getBoardMargin', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send(null);
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText);
        }
    };
};

var addElement = function addElement(height, width) {
    var texture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var amount = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
    var rims = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
        top: false,
        right: false,
        bottom: false,
        left: false
    };

    var req = new XMLHttpRequest();
    req.open('POST', 'http://localhost:9699/addElement', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send('height=' + height + '&width=' + width + '&texture=' + texture + '&amount=' + amount + '&rims=' + JSON.stringify(rims));
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText);
        }
    };
};

var addBoard = function addBoard(height, width) {
    var texture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var amount = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

    var req = new XMLHttpRequest();
    req.open('POST', 'http://localhost:9699/addBoard', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send('height=' + height + '&width=' + width + '&texture=' + texture + '&amount=' + amount);
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText);
        }
    };
};

var setKerf = function setKerf(kerf) {
    var req = new XMLHttpRequest();
    req.open('POST', 'http://localhost:9699/setKerf', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send('kerf=' + kerf);
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText);
        }
    };
};

var setRimMargin = function setRimMargin(margin) {
    var req = new XMLHttpRequest();
    req.open('POST', 'http://localhost:9699/setRimMargin', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send('margin=' + margin);
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText);
        }
    };
};

var setBoardMargin = function setBoardMargin(margin) {
    var req = new XMLHttpRequest();
    req.open('POST', 'http://localhost:9699/setBoardMargin', true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.send('margin=' + margin);
    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText);
        }
    };
};

getElements();