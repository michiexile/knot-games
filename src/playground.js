import * as Phaser from 'phaser';

import { Board, QuadGrid } from "phaser3-rex-plugins/plugins/board-components";
import { Tiles, Directions, KnotTile } from "./assets/tiles.js";

export default class Playground extends Phaser.Scene {
    constructor () {
        super({key: "Playground"});
        this.snap = true;
    }

    create() {
        var selected = {
            _sprite: null,
            _glow: null,
            get item() {
                return this._sprite
            },
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
        };

        const sprites = [
            new KnotTile(this, 50, 25, "Cap").setScale(0.5).setInteractive({draggable: true}),
            new KnotTile(this, 125, 25, "Turn").setScale(0.5).setInteractive({draggable: true}),
            new KnotTile(this, 200, 25, "Braid").setScale(0.5).setInteractive({draggable: true}),
            new KnotTile(this, 275, 25, "Branch").setScale(0.5).setInteractive({draggable: true}),
            new KnotTile(this, 350, 25, "Hub").setScale(0.5).setInteractive({draggable: true}),
        ];

        var togglediv = document.createElement("div");
        togglediv.classList.add(["form-check", "form-switch"])
        togglediv.innerHTML = `
        <input class="form-check-input" type="checkbox" id="snap-toggle" checked>
        <label class="form-check-label"  for="snap-toggle">Snap Tiles</label>
        `;
        var toggle = togglediv.querySelector("#snap-toggle");
        toggle.addEventListener("change", () => this.snap = toggle.checked);
        this.add.dom(450,25, togglediv)

        var board = new Board(this, {
            grid: new QuadGrid({
                x: 50, y: 100,
                cellWidth: 50, cellHeight: 50,
                type: "orthogonal"
            }),
            width: 10,
            height: 10
        })

        sprites.forEach(sprite => {
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
                    if(this.snap) {
                        var neighbors = [0,1,2,3].map(k => board.getNeighborChess({...tileXY, z:0}, k));
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
                    var newKnot = new KnotTile(this, 0, 0, sprite.knottile, sprite.orientation)
                        .setScale(0.5);
                    board.addChess(newKnot, tileXY.x, tileXY.y, 0);
                    this.add.existing(newKnot);
                }
            });

            sprite.on("wheel", (pointer, deltaX, deltaY) => {
                sprite.orientation += Math.sign(deltaY)
            });

            sprite.on("pointerup", (pointer, localX, localY, event) => {
                selected.item = sprite;
                event.stopPropagation();
            })
            this.add.existing(sprite);
        });

        this.input.on("pointerup", (pointer, currentlyOver) => {
            if(selected.item) {
                selected.item = null;
            }
        })

        this.input.keyboard.on("keydown-ONE", (event) => {
            selected.item = sprites[0];
        })
        this.input.keyboard.on("keydown-TWO", (event) => {
            selected.item = sprites[1];
        })
        this.input.keyboard.on("keydown-THREE", (event) => {
            selected.item = sprites[2];
        })
        this.input.keyboard.on("keydown-FOUR", (event) => {
            selected.item = sprites[3];
        })
        this.input.keyboard.on("keydown-FIVE", (event) => {
            selected.item = sprites[4];
        })
        this.input.keyboard.on("keydown-ZERO", (event) => {
            selected.item = null;
        })

        this.input.keyboard.on("keydown-PLUS", (event) => {
            if(selected.item) {
                selected.item.orientation += 1;
            }
        });
        this.input.keyboard.on("keydown-MINUS", (event) => {
            if(selected.item) {
                selected.item.orientation -= 1;
            }
        });


        var graphics = this.add.graphics();
        graphics.setDefaultStyles({
            lineStyle: { width: 1, color: "navy", alpha: 0.5 },
            fillStyle: { color: "aliceblue", alpha: 0.5 }
        })
        graphics.strokeRectShape(board.getBoardBounds());

        board.forEachTileXY((tileXY, board) => {
            graphics.strokeRectShape(board.getGridBounds(tileXY.x, tileXY.y));
        })
    }
}
