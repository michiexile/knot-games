import Phaser from 'phaser';

import Front from "./front";
import MenuHandler from "./menuhandler";
import Playground from "./playground";
import AbbeyPage from "./abbeypage";

const config = {
    type: Phaser.WEBGL,
    scale: {
        parent: 'game',
        width: 800,
        height: 600,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    },
    dom: { createContainer: true },
    scene: [Front, MenuHandler, Playground, AbbeyPage],
    backgroundColor: "#ffffff"
};

const game = new Phaser.Game(config);
