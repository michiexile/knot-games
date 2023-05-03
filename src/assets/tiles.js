// use same convention as the Board
export const Directions = {
    "right": 0,
    "bottom": 1,
    "left": 2,
    "top": 3,
}

export const Cap = {
    "ports": {
        0: {"under": null, "over": null}, // from right
        1: {"under": Directions.bottom, "over": Directions.bottom}, // from bottom
        2: {"under": null, "over": null}, // from left
        3: {"under": null, "over": null}, // from top
    }
};

export const Turn = {
    "ports": {
        0: {"under": null, "over": null}, // from right
        1: {"under": Directions.left, "over": Directions.left}, // from bottom
        2: {"under": Directions.bottom, "over": Directions.bottom}, // from left
        3: {"under": null, "over": null}, // from top
    }
};

export const Braid = {
    "ports": {
        0: {"under": null, "over": null}, // from right
        1: {"under": Directions.top, "over": Directions.top}, // from bottom
        2: {"under": null, "over": null}, // from left
        3: {"under": Directions.bottom, "over": Directions.bottom}, // from top
    }
};

export const Branch = {
    "ports": {
        0: {"under": Directions.left, "over": Directions.bottom}, // from right
        1: {"under": Directions.right, "over": Directions.left}, // from bottom
        2: {"under": Directions.bottom, "over": Directions.right}, // from left
        3: {"under": null, "over": null}, // from top
    }
};

export const Hub = {
    "ports": {
        0: {"under": Directions.top, "over": Directions.bottom}, // from right
        1: {"under": Directions.right, "over": Directions.left}, // from bottom
        2: {"under": Directions.bottom, "over": Directions.top}, // from left
        3: {"under": Directions.left, "over": Directions.right}, // from top
    }
};


export const Tiles = {
    "Cap": Cap,
    "Turn": Turn,
    "Braid": Braid,
    "Branch": Branch,
    "Hub": Hub
}


export class KnotTile extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type, orientation=Directions.right) {
        super(scene, x, y);
        this.setTexture(type);
        this.knottile = type;
        this.setPosition(x,y);
        //this._orientation = Directions.bottom;
        this.orientation = orientation;
    }

    set orientation(orient) {
        this._orientation = ((orient % 4)+4)%4;
        this.setAngle(90*this._orientation);
    }
    get orientation() {
        return this._orientation;
    }
    rotateLeft(steps) {
        this.orientation -= steps;
    }
    rotateRight(steps) {
        this.orientation += steps;
    }
    
    get ports() {
        return Object
            .values(Directions)
            .filter(k => Tiles[this.knottile].ports[k].under != null)
            .map(k => (((k + this.orientation) % 4) + 4) % 4)
    }
}