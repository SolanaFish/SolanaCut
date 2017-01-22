class element {
    constructor(height, width, texture, rims = 0) {
        this.height = height;
        this.width = width;
        this.texture = texture;
        this.rims = rims;
    }
}

class placedElement extends element {
    constructor(x, y, height, width, texture, rims = 0) {
        super(height, width, texture, rims);
        this.x = x;
        this.y = y;
    }
}

class freeSpace {
    constructor(x, y, height, width) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }
}

class strip {
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
                    this.free.push(new freeSpace(free.x + element.width, free.y, free.height, free.width - element.width));
                    done = true;
                }
            });
        }
        return done;
    }
}

class board {
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
}



let elements = [];
let boards = [];
let kerf = 3;
let rimMargin = 100;
let boardMargin = 30;

module.exports = () => {
    // sprawdzicc czy zdana formatka nie jest wieksza niz płyta
    let elementsNotOptimized = [];
    let elementsLeft = JSON.parse(JSON.stringify(elements));
    let boardsOptimized = [];
    boards.forEach((oldBoard)=> {
        boardsOptimized.push(new board(oldBoard.height, oldBoard.width, oldBoard.texture));
    });
    let rimLength = 0;
    elementsLeft.forEach((element) => {
        rimLength += element.rims;
    });
    elementsLeft.sort((a, b) => {
        if (a.height != b.height) {
            // sortuj pionowymi
            return b.height - a.height;
        } else {
            // sortuj pozimiymi
            return b.width - a.width;
        }
    });
    elementsLeft.forEach((element, index) => {
        // sprawdz czy w istniejacym pasie o tym samym y nie ma miejsca na formatkę
        let done = false;
        boardsOptimized.forEach((board) => {
            if (!done && board.fitElement(element, true)) { //exact
                // place element there
                console.log('element fitted - exact');
                done = true;
            }
        });
        if (!done) {
            let elementsWithSameHeight = [element];
            let i = index + 1;
            while(i < elementsLeft.length && elementsLeft[i].height == element.height) {
                console.log(`i:${i} good:${element.height} dunno:${elementsLeft[i].height}`);
                elementsWithSameHeight.push(elementsLeft[i]);
                i++;
            }
            console.log(elementsWithSameHeight.length);
            let elementsWithSameHeightWidth = 0;
            elementsWithSameHeight.forEach((element) => {
                elementsWithSameHeightWidth += element.width;
            });
            boardsOptimized.forEach((board) => {
                if (!done && board.width >= element.width && board.fitNewStrip(element.height)) {
                    console.log('element fitted - exact, new exact strip');
                    board.fitElement(element);
                    done = true;
                }
            });
            boardsOptimized.forEach((board) => {
                if (!done && board.fitElement(element, false)) { // not exact
                    // place element there
                    console.log('element fitted - not exact');
                    done = true;
                }
            });
        }
        if (!done) {
            // jesli nie zrob nowy pas
            boardsOptimized.forEach((board) => {
                if (!done && board.width >= element.width && board.fitNewStrip(element.height)) {
                    console.log('new strip');
                    board.fitElement(element);
                    done = true;
                }
            });
            if (!done) {
                console.log('element not fitted');
                elementsNotOptimized.push(element);
            }
        }
    });
    // sprawdz czy w istniejacym pasie o mniejszym y nie ma miejsca na formatkę
    // obróć i jeszcze raz?
    // dodaj formatkę do pasa lub dodaj nowy pas i dodaj do niego formatkę
    return {
        boardsOptimized: boardsOptimized,
        elementsLeft: elementsLeft,
        elementsNotOptimized: elementsNotOptimized,
        rim: rimLength
    };
};

module.exports.addElement = (height, width, texture = null, amount = 1, rims = {
    top: false,
    right: false,
    bottom: false,
    left: false
}) => {
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
    return elements;
};

module.exports.setBoardMargin = (newBoardMargin) => {
    boardMargin = newBoardMargin;
};

module.exports.getBoards = () => {
    return boards;
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
