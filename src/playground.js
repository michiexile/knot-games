import * as Phaser from 'phaser';

import { Remarkable } from "remarkable";

import { Board, QuadGrid } from "phaser3-rex-plugins/plugins/board-components";

import { Tiles, Directions, KnotTile } from "./assets/tiles.js";
import {Selection, SetupGestures, SetupKeys, DrawBoard, SetupRules} from "./shared";

export default class Playground extends Phaser.Scene {
    constructor () {
        super({key: "Playground"});
        this.snap = true;
    }

    create() {
        const rulesMD = require("/src/assets/rules-playground.md");
        SetupRules("Rules for the Playground", rulesMD);

        var selected = new Selection();

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

        sprites.forEach(SetupGestures(this, board, selected, (tileXY, sprite) => {
                var newKnot = new KnotTile(this, 0, 0, sprite.knottile, sprite.orientation)
                    .setScale(0.5);
                board.addChess(newKnot, tileXY.x, tileXY.y, 0);
                this.add.existing(newKnot);
            })
        );

        SetupKeys(this, selected, sprites)

        var graphics = this.add.graphics();
        DrawBoard(this, board, graphics)
    }
}
