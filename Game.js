"use strict"
const grid = require('./Grid')

let n = 7;
let health = 10;
let fitness = 0;
let START_HEALTH = 10;
let HEALTH_INC = 5;
let HEALTH_DEC = 1;
let DYING_HEALTH = 0;
let AGE_DEC = 1;
let TILES = {
    "OPEN": 0,
    "STAIRS": 1,
    "SPIKES": 2,
    "FOOD": 3,
    "PLAYER": 4
}
let xPos;
let yPos;
let lastPos = 0;
let START_FITNESS = 0;
let FITNESS_INC = 1;
let DIRS = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0]
]

class Player {
    constructor(pos) {
        this.setPos(pos);
        this.health = START_HEALTH;
        this.fitness = START_FITNESS;
        this.tileUnder = TILES.OPEN;
    }
    setPos(pos) {
        this.xPos = pos[0]
        this.yPos = pos[1]
    }




    getSight(grid, xPos, yPos, sight) {
        let top = Math.max(0, yPos - sight);
        let right = Math.max(0, xPos - sight);
        let bottom = Math.min(n - 1, yPos + sight);
        let left = Math.min(n - 1, xPos + sight);
        let xDis = xPos - sight;
        let yDis = yPos - sight;
        let sightArr = new Array(sight * 2 + 1).fill(0);
        sightArr.forEach((d, i) => {
            sightArr[i] = new Array(sight * 2 + 1).fill(0);
        })
        for (let i = 0; i < sight * 2 + 1; i++) {
            for (let j = 0; j < sight * 2 + 1; j++) {
                try {
                    if (j + yDis >= n || j + yDis < 0) {
                        sightArr[i][j] = -1;
                    } else {
                        sightArr[i][j] = grid.data[i + xDis][j + yDis];
                    }
                } catch (e) {
                    sightArr[i][j] = -1;
                }
            }
        }
        return sightArr;
    }
}

class Game {
    constructor() {
        this.gameStack = [];
        let newBoard = grid.setupBoard(n);
        this.player = new Player(newBoard.playerPos);
        this.currentBoard = newBoard.grid;
        this.gameStack.push(newBoard.grid);
    }

    run() {
        while (this.player.health > DYING_HEALTH) {
            this.tick(this.currentBoard);
            if (this.player.tileUnder == TILES.STAIRS) {
                let newBoard = grid.setupBoard(n);
                this.currentBoard = newBoard.grid;
                this.player.setPos(newBoard.playerPos);
                this.gameStack.push(newBoard.grid);
            }
            console.log(this.currentBoard.data);
            console.log("health: ", this.player.health)
            console.log("fitness: ", this.player.fitness)
            console.log()
        }
    }

    tick(grid) {
        this.player.health -= AGE_DEC;
        this.tryMove(grid, DIRS[Math.floor(Math.random() * DIRS.length)]);
        this.player.fitness += FITNESS_INC;
    }

    tryMove(g, dir) {
        if (grid.isFree(g, [this.player.xPos, this.player.yPos], dir)) {
            g.data[this.player.xPos][this.player.yPos] = this.player.tileUnder;
            this.player.setPos([this.player.xPos + dir[0], this.player.yPos + dir[1]]);
            this.player.tileUnder = g.data[this.player.xPos][this.player.yPos];
            if (this.player.tileUnder == TILES.SPIKES) {
                this.player.health -= HEALTH_DEC;
            }
            if (this.player.tileUnder == TILES.FOOD) {
                this.player.health += HEALTH_INC;
                this.player.tileUnder = TILES.OPEN;
            }
            g.data[this.player.xPos][this.player.yPos] = TILES.PLAYER;
            return true;
        }
        return false;
    }
}

let game = new Game();
game.run();
