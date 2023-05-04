import {KnotTile} from "./assets/tiles";
import {Remarkable} from "remarkable";

export class Selection {
    constructor() {
        this._sprite = null
        this._glow = null
    }
    get item() {
        return this._sprite
    }
    set item(value) {
        if(this._sprite) {
            this._sprite.preFX.remove(this._glow);
            this._glow = null;
        }
        if(value) {
            this._glow = value.preFX.addGlow(0x0d6efd)
        }
        this._sprite = value
    }
}

export var SetupGestures = (scene, board, selected, placeTile) => {
    return (sprite) => {
        scene.add.existing(sprite);
        sprite.on('drag', (pointer, dragX, dragY) => {
            sprite.x = dragX;
            sprite.y = dragY;
        });
        sprite.on('dragend', (pointer, dragX, dragY) => {
            var tileXY = board.worldXYToTileXY(pointer.x, pointer.y);
            sprite.x = sprite.input.dragStartX;
            sprite.y = sprite.input.dragStartY;
            if(board.contains(tileXY.x, tileXY.y) &&
                !board.contains(tileXY.x, tileXY.y, 0)) {
                var neighbors = [0,1,2,3].map(k => board.getNeighborChess({...tileXY, z:0}, k));
                if(scene.connected && (board.getAllChess().length > 0) && neighbors.every(t => t == null)) {
                    return; // must place tiles connected
                }
                if(scene.snap) {
                    var ports = sprite.ports;
                    if(![0,1,2,3]
                        .filter(k => neighbors[k] != null)
                        .every(k =>
                            (neighbors[k].ports.includes((k+2)%4) && ports.includes(k)) ||
                            (!neighbors[k].ports.includes((k+2)%4) && !ports.includes(k)))
                    ) {
                        return; // skip putting this tile down, because a neighbor with a port didn't find a port in me
                    }
                }
                placeTile(tileXY, sprite);
            }
        });

        sprite.on("wheel", (pointer, deltaX, deltaY) => {
            sprite.orientation += Math.sign(deltaY)
        });

        sprite.on("pointerup", (pointer, localX, localY, event) => {
            if(selected.item == sprite) {
                sprite.orientation += 1;
            } else {
                selected.item = sprite;
            }
            event.stopPropagation();
        })
    }
}

const numericKeys = [
    "ZERO", "ONE", "TWO", "THREE", "FOUR",
    "FIVE", "SIX", "SEVEN", "EIGHT", "NINE",
]
export var SetupKeys = (scene, selected, sprites) => {
    scene.input.on("pointerup", (pointer, currentlyOver) => {
        if(selected.item) {
            selected.item = null;
        }
    })

    sprites.forEach((sprite, index) => {
        scene.input.keyboard.on("keydown-" + numericKeys[index], (event) => {
            selected.item = sprite;
        })
    })

    scene.input.keyboard.on("keydown-PLUS", (event) => {
        if(selected.item) {
            selected.item.orientation += 1;
        }
    });
    scene.input.keyboard.on("keydown-MINUS", (event) => {
        if(selected.item) {
            selected.item.orientation -= 1;
        }
    });
}

export var DrawBoard = (scene, board, graphics) => {
    graphics.setDefaultStyles({
        lineStyle: { width: 1, color: 0x0d6efd, alpha: 0.5 },
        fillStyle: { color: 0x0dcaf0, alpha: 0.5 }
    })
    graphics.strokeRectShape(board.getBoardBounds());

    board.forEachTileXY((tileXY, board) => {
        graphics.strokeRectShape(board.getGridBounds(tileXY.x, tileXY.y));
    })
}

export var SetupRules = (title, markdown) => {
    var md = new Remarkable();
    var el = document.getElementById("rules-body");
    el.innerHTML =md.render(markdown);
    document.getElementById("rules-title").innerText = title;
}