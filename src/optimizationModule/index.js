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

class board {
    constructor(height, width, texture) {
        this.height = height;
        this.width = width;
        this.texture = texture;
        this.strips = [];
        this.free = [new freeSpace(0, 0, height, width)];
    }
    canFitElementInStrip(element) {
        if(this.strips !== []) {
            this.strips.forEach((strip) => {
                if(strip.height <= element.height) {
                    stip.free.forEach((free) => {
                        if(free.height >= element.height && free.width >= element.width) {
                            return true;
                        }
                    });
                }
            });
        }
        return false;
    }
    fitNewStrip(height) {
        this.free.forEach((free, index) => {
            if(free.height >= height) {
                this.strips.push(new Strip(free.x, free.y, height, this.width));
                this.free.splice(index, 1);
                this.free.push(new freeSpace(free.x + height, free.y, free.height - height, this.width));
                return true;
            }
        });
        return false;
    }
}

class strip {
    constructor(x, y, height, width) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.elements = [];
        this.free = [];
    }
}


let elements = [];
let boards = [];
let kerf = 0;

module.exports = () => {
    // sprawdzicc czy zdana formatka nie jest wieksza niz płyta
    let elementsNotOptimized = [];
    let elementsLeft = elements;
    elementsLeft.sort((a, b) => {
        if (a.height != b.height) {
            // sortuj pionowymi
            return b.height - a.height;
        } else {
            // sortuj pozimiymi
            return b.width - a.width;
        }
    });
    elementsLeft.forEach((element) => {
        // sprawdz czy w istniejacym pasie o tym samym y nie ma miejsca na formatkę
        boards.forEach((board) => {
            if(board.canFitElementInStrip(element)) {
                // place element there
            }
        });
    });
    // sprawdz czy w istniejacym pasie o mniejszym y nie ma miejsca na formatkę
    // obróć i jeszcze raz?
    // dodaj formatkę do pasa lub dodaj nowy pas i dodaj do niego formatkę

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
