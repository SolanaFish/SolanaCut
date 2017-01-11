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

class board {
    constructor(height, width, texture) {
        this.height = height;
        this.width = width;
        this.texture = texture;
        this.strips = [];
        this.free = [];
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

class freeSpace {
    constructor(x, y, height, width) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }
}

module.exports = () => {

};
