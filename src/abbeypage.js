import * as Phaser from 'phaser';

import { Board, QuadGrid } from "phaser3-rex-plugins/plugins/board-components";
import { Tiles, Directions, KnotTile } from "./assets/tiles.js";
import isEmpty from "phaser3-rex-plugins/plugins/utils/object/IsEmpty";

export default class AbbeyPage extends Phaser.Scene {
    constructor () {
        super({key: "AbbeyPage"});
        this.snap = true;
    }

    create() {
        var graphics = this.add.graphics();
        graphics.setDefaultStyles({
            lineStyle: { width: 1, color: "aliceblue", alpha: 0.5 },
            fillStyle: { color: "aliceblue", alpha: 0.5 }
        })

        var highlightgraphics = this.add.graphics();
        highlightgraphics.postFX.addGlow(0x6610f2);

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

        var highlightedCells = new Set();

        let highlightEmptyCells = function(scene) {
            var tiles = board.getAllChess();
            highlightgraphics.clear();
            highlightedCells.clear();
            var highlightTiles = new Set();
            tiles.forEach(tile => {
                tile.ports.filter(direction =>
                    board.getNeighborChess(tile, direction) == null)
                    .forEach(direction =>
                        highlightTiles.add(board.getNeighborTileXY(tile, direction)))
            })
            highlightTiles.forEach(tileXY => {
                var rect = highlightgraphics.strokeRectShape(board.getGridBounds(tileXY.x, tileXY.y));
                highlightedCells.add({...tileXY,
                    rect: rect});
            })
            if(highlightTiles.size == 0) { // win the game
                graphics.alpha = 0;
                sprites.forEach(sprite => sprite.alpha = 0)
            }
        }

        var sprites = [null,null,null];

        let randomKnotTile = function(scene, ix = 0) {
            let tile = Phaser.Math.RND.pick(Object.keys(Tiles));
            let sprite = new KnotTile(scene, 50 + ix*75, 25, tile)
                .setScale(0.5)
                .setInteractive({draggable: true})
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
                    if(scene.snap) {
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

                    board.addChess(sprite, tileXY.x, tileXY.y, 0);
                    sprites[ix] = randomKnotTile(scene, ix);
                    highlightEmptyCells(scene);
                }
            });

            sprite.on("wheel", (pointer, deltaX, deltaY) => {
                sprite.orientation += Math.sign(deltaY)
            });

            sprite.on("pointerup", (pointer, localX, localY, event) => {
                selected.item = sprite;
                event.stopPropagation();
            })
            scene.add.existing(sprite);

            return sprite;
        }

        sprites = [
            randomKnotTile(this, 0),
            randomKnotTile(this, 1),
            randomKnotTile(this, 2)
        ];

        var board = new Board(this, {
            grid: new QuadGrid({
                x: 50, y: 100,
                cellWidth: 50, cellHeight: 50,
                type: "orthogonal"
            }),
            width: 10,
            height: 10
        })

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


        graphics.strokeRectShape(board.getBoardBounds());

        board.forEachTileXY((tileXY, board) => {
            graphics.strokeRectShape(board.getGridBounds(tileXY.x, tileXY.y));
        })
    }
}
