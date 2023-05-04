import { Remarkable } from 'remarkable';
import { SetupRules } from "./shared";

export default class Front extends Phaser.Scene {
    constructor() {
        super({key: "Front"});
    }

    create() {
        SetupRules("Rules Display", "This will contain game rules within each game.");

        var md = new Remarkable();
        const welcomeMD = require("/src/assets/welcome.md")

        var el = document.getElementById("welcome");
        el.innerHTML =md.render(welcomeMD);


        this.scene.launch("MenuHandler")
    }
}