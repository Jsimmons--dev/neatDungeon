"use strict"
const sys = require('process');
const assert = require('assert');
class Grid {
    constructor(n) {
        this.n = n;
        this.data = new Array(n).fill(0);
        this.data.forEach((d, i) => {
            this.data[i] = new Array(n).fill(0);
        })
    }
    indexPerimeter(i, depth, val) {
        assert((0 <= i) && ((this.n - depth - 2) * 4 + 4))
        let gridDex;
        if (i < this.n - depth) {
            gridDex = {
                "row": 0 + depth,
                "col": i
            }
        } else if ((this.n - depth <= i) && (i < (2 * (this.n - depth) - 1))) {
            gridDex = {
                "row": i % (this.n - depth) + 1,
                "col": (this.n - depth) - 1
            }
        } else if (((2 * (this.n - depth) - 1) <= i) && (i <= 3 * (this.n - depth) - 3)) {
            gridDex = {
                "row": (this.n - depth) - 1,
                "col": (this.n - depth) - 1 - ((i + 2) % (this.n - depth))
            }
        } else {
            gridDex = {
                "row": (this.n - depth) - 2 - ((i + 2) % (this.n - depth)),
                "col": 0
            }
        }
        if (val !== undefined) {
            this.data[gridDex.row][gridDex.col] = val;
        }
        return this.data[gridDex.row][gridDex.col];
    }
    at(i, j, val) {
        if (val !== undefined) {
            this.data[i][j] = val;
        }
        return this.data[i][j];
    }
    iteratePerimeter(filter, depth, val) {
        for (let i = 0; i < (this.n - 2) * 4 + 4; i++) {
            if (filter)
                this.indexPerimeter(i, depth, val);
        }
    }
    onPerimeter(val) {
        for (let i = 0; i < (this.n - 2) * 4 + 4; i++) {
            if (this.indexPerimeter(i, 0) == val) return true;
        }
        return false;
    }
}

exports.isFree = (grid, loc, dir) => {
    if (loc[0] + dir[0] < 0 || loc[0] + dir[0] >= grid.n) return false;
    if (loc[1] + dir[1] < 0 || loc[1] + dir[1] >= grid.n) return false;
    return true;
}

exports.setupBoard = (n) => {
    let notFound = true;
    let g = generateBoard(n)
    let xPos;
    let yPos;
    while (notFound) {
        xPos = Math.floor(Math.random() * (n));
        yPos = Math.floor(Math.random() * (n));
        if (g.data[xPos][yPos] == 0) {
            notFound = false;
            g.data[xPos][yPos] = 4;
        }
    }
    return {
        "grid": g,
        "playerPos": [xPos, yPos]
    };
}
exports.generateBoard = generateBoard;

function generateBoard(n) {
    var grid = new Grid(n);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            let fate = Math.random()
            if (fate < .10) {
                grid.data[i][j] = 2
            } else if (fate > .90) {

                grid.data[i][j] = 3
            }
        }
    }
    for (let i = 0; i < (n - 2) * 4 + 4; i++) {
        if (Math.random() > .9)
            grid.indexPerimeter(i, 0, 1);
    }
    let randStair = Math.floor((Math.random() * ((n - 2) * 4 + 4)));
    grid.indexPerimeter(randStair, 0, 1);
    return grid;
}
