import Playground from "./playground";
import AbbeyPage from "./abbeypage";


import CapImg from "/src/assets/Cap.png";
import TurnImg from "/src/assets/Turn.png";
import BraidImg from "/src/assets/Braid.png";
import BranchImg from "/src/assets/Branch.png";
import HubImg from "/src/assets/Hub.png";



const gameSpecs = [
    {
        key: "Playground",
        fun: Playground,
        menutext: "Playground",
        id: "playground"
    },
    {
        key: "AbbeyPage",
        fun: AbbeyPage,
        menutext: "Abbey - Page",
        id: "abbeypage"
    }
]

export default class MenuHandler extends Phaser.Scene {
    constructor() {
        super({key: "MenuHandler"})
        this.currentScene = null;
    }

    preload() {
        this.load.setPath("src/assets/");
        this.load.image("Cap", CapImg);
        this.load.image("Turn", TurnImg);
        this.load.image("Braid", BraidImg);
        this.load.image("Branch", BranchImg);
        this.load.image("Hub", HubImg);
    }

    create() {
        this.resizeMenu()
        this.scale.on("resize", this.resizeMenu, this);

        var homelink = document.getElementById("homelink");
        homelink.addEventListener("click", (event) => {
            if(this.currentScene) {
                this.scene.stop(this.currentScene);
                this.currentScene = null;
            }
            document.getElementById("welcome").classList.remove("invisible");
        })

        var dropdown = document.getElementById("navbarDropdown-ul")
        gameSpecs.forEach(spec => {
            var item = document.createElement("li");
            var itemlink = document.createElement("a");
            itemlink.innerText = spec.menutext;
            itemlink.href = "#";
            itemlink.id = `${spec.id}-selector`;
            itemlink.addEventListener("click", (event) => {
                document.getElementById("welcome").classList.add("invisible");
                if(this.currentScene) {
                    this.scene.stop(this.currentScene);
                }
                this.scene.start(spec.key);
                this.currentScene = spec.key;
            });
            item.appendChild(itemlink);
            dropdown.appendChild(item);
        })
    }

    resizeMenu() {
        let actualWidth = this.game.scale.displaySize.width;
        let navbar = document.getElementsByTagName("nav")[0];
        navbar.style.width = Math.max(600, actualWidth).toString() + 'px';
    }
}