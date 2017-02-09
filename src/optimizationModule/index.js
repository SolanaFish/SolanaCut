class element { // Class of a element that was yet not fitted into a board
    constructor(height, width, texture, rims = 0) {
        this.height = height;
        this.width = width;
        this.texture = texture;
        this.rims = rims; // sum of rim lengths
    }
    rotate() {
        let tempWidth = this.width;
        this.width = this.height;
        this.height = tempWidth;
        this.texture = !this.texture;
    }
}

class placedElement extends element { // Class of a element that was fitted inta a board
    constructor(x, y, height, width, texture, rims = 0) {
        super(height, width, texture, rims);
        this.x = x;
        this.y = y;
    }
}

class freeSpace { // Class of a space, where strips or elements can be fitted
    constructor(x, y, height, width) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }
}

class strip { // Class of a stripe in a board that can fit elements and free space
    constructor(x, y, height, width) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.elements = [];
        this.free = [new freeSpace(0, 0, height, width)];
    }
    fitElement(element, exact = false) {
        if (exact && this.height != element.height) {
            return false;
        }
        let done = false;
        if (this.height >= element.height) {
            this.free.forEach((free, index) => {
                if (!done && free.width - this.elements.length * kerf >= element.width) {
                    this.elements.push(new placedElement(free.x, free.y, element.height, element.width, element.texture, element.rims));
                    this.free.splice(index, 1);
                    if(this.height > element.height) {
                        this.free.push(new freeSpace(free.x, free.y+ element.height, free.height - element.height, element.width));
                        console.log('d');
                    }
                    this.free.push(new freeSpace(free.x + element.width, free.y, free.height, free.width - element.width));
                    done = true;
                }
            });
        }
        return done;
    }
}

class board { // Class of a board that can fit strips and free space
    constructor(height, width, texture) {
        this.height = height - boardMargin;
        this.width = width - boardMargin;
        this.texture = texture;
        this.strips = [];
        this.free = [new freeSpace(0, 0, this.height, this.width)];
    }
    fitElement(element, exact = false) {
        let done = false;
        if (this.strips !== []) {
            this.strips.forEach((strip) => {
                if (!done && strip.fitElement(element, exact)) {
                    done = true;
                }
            });
        }
        return done;
    }
    fitNewStrip(height) {
        let done = false;
        this.free.forEach((free, index) => {
            if (!done && free.height - this.strips.length * kerf >= height) {
                this.strips.push(new strip(free.x, free.y, height, this.width));
                this.free.splice(index, 1);
                this.free.push(new freeSpace(free.x, free.y + height, free.height - height, this.width));
                done = true;
            }
        });
        return done;
    }
    canFitNewStrip(height) {
        let done = false;
        this.free.forEach((free, index) => {
            if (!done && free.height - this.strips.length * kerf >= height) {
                done = true;
            }
        });
        return done;
    }
    rotate() {
        let tempWidth = this.width;
        this.width = this.height;
        this.height = tempWidth;
        this.texture = !this.texture;
    }
}

let elements = []; // Array of elements that need to be optimalized
let boards = []; // Array of board that elements will get fitted into
let kerf = 3; // Kerf that is added for every cut
let rimMargin = 100; // Margin that is added to every rim length
let boardMargin = 30; // Margin that is rubtracted of every boards sizew
let orginalBoards = [];
let orginalElements = [];

module.exports = () => {
    let elementsNotOptimized = []; // Array of elements that cannot be optimalized (they don't fit into any board)
    let elementsLeft = []; // Array of elements to optimalize
    let boardsOptimized = []; // Array of boards that elements will get fited into
    let textureMatters = false; // variable that tells us if we have to take into consideration texture of boards
    let rimLength = 0; // Rim length of all elements that need it
    boards.forEach((oldBoard) => { // Copy boards to new array
        boardsOptimized.push(new board(oldBoard.height, oldBoard.width, oldBoard.texture));
    });
    elements.forEach((oldElement) => { // Copy elements to new array
        elementsLeft.push(new element(oldElement.height, oldElement.width, oldElement.texture, oldElement.rims));
    });

    // check if textures matter
    elementsLeft.forEach((element) => {
        if (element.texture !== null) {
            textureMatters = true;
        }
    });
    if (textureMatters) { // If texture matters rotate everything
        boardsOptimized.forEach((board) => {
            if (board.texture === false) {
                board.rotate();
            }
        });
        elementsLeft.forEach((element) => {
            if (element.texture === false) {
                element.rotate();
            }
        });
    }

    elementsLeft.forEach((element) => {
        if(element.texture === null) {
            if(element.width < element.height) {
                element.rotate();
            }
        }
    });

    elementsLeft.forEach((element) => { // Calculate rim length
        rimLength += element.rims;
    });

    elementsLeft.sort((a, b) => { // Sort elements
        if (a.height != b.height) {
            // by height
            return b.height - a.height;
        } else {
            // and by width
            return b.width - a.width;
        }
    });

    elementsLeft.forEach((element, index) => {
        let done = false;
        boardsOptimized.forEach((board) => { // Try to place element in stripe of same height as element
            if (!done && board.fitElement(element, true)) { //exact
                done = true;
            }
        });
        if (!done) {
            // Get array of not optimalized elements
            let elementsWithSameHeight = [element];
            let i = index + 1;
            while (i < elementsLeft.length && elementsLeft[i].height == element.height) {
                elementsWithSameHeight.push(elementsLeft[i]);
                i++;
            }
            // Calculate their width
            let elementsWithSameHeightWidth = 0;
            let elementsWithSameHeightHeight = 0;
            let elementsWithSameHeightTexture = false;
            elementsWithSameHeight.forEach((element) => {
                elementsWithSameHeightWidth += element.width + kerf;
                elementsWithSameHeightHeight += element.height + kerf;
                if(element.texture !== null) {
                    let elementsWithSameHeightTexture = true;
                }
            });
            // If their width is bigger than  half of width of board make new strip for them
            boardsOptimized.forEach((board) => {
                if(!done && elementsWithSameHeightWidth > board.width / 2) {
                    if(elementsWithSameHeightWidth <= board.width) {
                        board.fitNewStrip(element.height);
                        board.fitElement(element);
                        done = true;
                    } else {
                        if(elementsWithSameHeightHeight < board.width && elementsWithSameHeightHeight > board.width / 2 && !elementsWithSameHeightTexture) {
                            elementsWithSameHeight.forEach((element) => {
                                element.rotate();
                            });
                            board.fitNewStrip(element.height);
                            board.fitElement(element);
                            done = true;
                        }
                    }
                }
            });
            // If that wasn't the case try to fit element into bigger strip
            boardsOptimized.forEach((board) => {
                if (!done && board.fitElement(element, false)) { // not exact
                    // place element there
                    done = true;
                }
            });
        }
        if (!done) {
            // If any strip wasn't able to fit element try to make new strip for it
            boardsOptimized.forEach((board) => {
                if (!done && board.width >= element.width && board.fitNewStrip(element.height)) {
                    board.fitElement(element);
                    done = true;
                }
            });
            // If element can't fit into new strip, then in cannot be optimalized
            if (!done) {
                elementsNotOptimized.push(element);
            }
        }
    });
    return {boardsOptimized: boardsOptimized, elementsLeft: elementsLeft, elementsNotOptimized: elementsNotOptimized, rim: rimLength};
};

module.exports.addElement = (height, width, texture = null, amount = 1, rims = {
    top: false,
    right: false,
    bottom: false,
    left: false
}) => {
    orginalElements.push({
        height: height,
        width: width,
        texture: texture,
        amount: amount,
        rims: rims
    });
    for (let i = 0; i < amount; i++) {
        let rimsLength = 0;
        if (rims.top) {
            rimsLength += width + rimMargin;
        }
        if (rims.bottom) {
            rimsLength += width + rimMargin;
        }
        if (rims.right) {
            rimsLength += height + rimMargin;
        }
        if (rims.left) {
            rimsLength += height + rimMargin;
        }
        elements.push(new element(height, width, texture, rimsLength));
    }
};

module.exports.addBoard = (height, width, texture = null, amount = 1) => {
    orginalBoards.push({
        height: height,
        width: width,
        texture: texture,
        amount: amount
    });
    for (let i = 0; i < amount; i++) {
        boards.push(new board(height, width, texture));
    }
};

module.exports.setKerf = (newKerf) => {
    kerf = newKerf;
};

module.exports.setRimMargin = (newRimMargin) => {
    rimMargin = newRimMargin;
};

module.exports.getElements = () => {
    return orginalElements;
};

module.exports.setBoardMargin = (newBoardMargin) => {
    boardMargin = newBoardMargin;
};

module.exports.getBoards = () => {
    return orginalBoards;
};

module.exports.getKerf = () => {
    return kerf;
};

module.exports.getRimMargin = () => {
    return rimMargin;
};

module.exports.getBoardMargin = () => {
    return boardMargin;
};
