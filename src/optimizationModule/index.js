class element {
    constructor(height, width, texture) {
        this.height = height;
        this.width = width;
        this.texture = texture;
    }
}

class placedElement extends element {
    constructor(x, y, height, width, texture) {
        super(height, width, texture);
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
        this.free = [new freeSpace(0,0, height, width)];
    }
    fitElement(element) {
        let done = false;
        if (this.height <= element.height) {
            this.free.forEach((free, index) => {
                if (!done && free.width >= element.width) {
                    this.elements.push(new placedElement(free.x, free.y, element.height, element.width, element.texture));
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
        this.height = height;
        this.width = width;
        this.texture = texture;
        this.strips = [];
        this.free = [new freeSpace(0, 0, height, width)];
    }
    fitElement(element) {
        let done = false;
        if (this.strips !== []) {
            this.strips.forEach((strip) => {
                if(!done && strip.fitElement(element)) {
                    done = true;
                }
            });
        }
        return done;
    }
    fitNewStrip(height) {
        let done = false;
        this.free.forEach((free, index) => {
            if (!done && free.height >= height) {
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
let kerf = 0;

module.exports = () => {
    // sprawdzicc czy zdana formatka nie jest wieksza niz płyta
    let elementsNotOptimized = [];
    let elementsLeft = elements;
    let boardsOptimized = boards;
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
            if (!done && board.fitElement(element)) {
                // place element there
                done = true;
                elementsLeft.splice(index, 1);
            }
        });
        if (!done) {
            // jesli nie zrob nowy pas
            let done = false;
            boardsOptimized.forEach((board) => {
                if(!done && board.fitNewStrip(element.height)) {
                    console.log('after new strip');
                    console.log(board.fitElement(element));
                    done = true;
                }
            });
            if(!done) {
                elementsLeft.splice(index, 1);
                elementsNotOptimized.push(element);
            }
        }
    });
    // sprawdz czy w istniejacym pasie o mniejszym y nie ma miejsca na formatkę
    // obróć i jeszcze raz?
    // dodaj formatkę do pasa lub dodaj nowy pas i dodaj do niego formatkę
    return boardsOptimized;
};

module.exports.addElement = (height, width, texture = null, amount = 1) => {
    for (let i = 0; i < amount; i++) {
        elements.push(new element(height, width, texture));
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

module.exports.getElements = () => {
    return elements;
};

module.exports.getBoards = () => {
    return boards;
};

module.exports.getKerf = () => {
    return kerf;
};
