import { Remarkable } from 'remarkable';
import welcomeMD from "./assets/welcome.md";

export default class Front extends Phaser.Scene {
    constructor() {
        super({key: "Front"});
    }

    create() {
        var md = new Remarkable();

        const welcomeMD = require("/src/assets/welcome.md")

        var el = document.getElementById("welcome");
        el.innerHTML =md.render(welcomeMD);


        this.scene.launch("MenuHandler")
    }
}