import * as Phaser from 'phaser';

import { Board, QuadGrid } from "phaser3-rex-plugins/plugins/board-components";
import { Tiles, Directions, KnotTile } from "./assets/tiles.js";

import {Selection, SetupGestures, SetupKeys, DrawBoard, SetupRules} from "./shared";
import {Remarkable} from "remarkable";
import rulesMD from "./assets/rules-playground.md";

export default class AbbeyPage extends Phaser.Scene {
    constructor () {
        super({key: "AbbeyPage"});
        this.snap = true;
        this.connected = true;
    }

    create() {
        const rulesMD = require("/src/assets/rules-abbey-page.md");
        SetupRules("Rules for Abbey - Page", rulesMD)

        var graphics = this.add.graphics();
        var highlightgraphics = this.add.graphics();
        highlightgraphics.postFX.addGlow(0x6610f2);

        var selected = new Selection();

        var board = new Board(this, {
            grid: new QuadGrid({
                x: 50, y: 100,
                cellWidth: 50, cellHeight: 50,
                type: "orthogonal"
            }),
            width: 10,
            height: 10
        })

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

        var sprites = [null, null, null];
        const setupSprite = SetupGestures(this, board, selected, (tileXY, sprite) => {
            const ix = sprites.findIndex((s) => s==sprite);
            board.addChess(sprite, tileXY.x, tileXY.y, 0);
            sprite.removeInteractive();
            selected.item = null;
            sprites[ix] = randomKnotTile(this, ix);
            highlightEmptyCells(this);
        })
        let randomKnotTile = function(scene, ix = 0) {
            let tile = Phaser.Math.RND.pick(Object.keys(Tiles));
            let sprite = new KnotTile(scene, 50 + ix*75, 25, tile)
                .setScale(0.5)
                .setInteractive({draggable: true});
            setupSprite(sprite);

            return sprite;
        }

        sprites = [
            randomKnotTile(this, 0),
            randomKnotTile(this, 1),
            randomKnotTile(this, 2)
        ];

        SetupKeys(this, selected, sprites);

        DrawBoard(this, board, graphics);
    }
}
