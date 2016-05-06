"use strict"
const grid = require('./grid')

let n = 7;
var g = grid.generateBoard(n)
let xPos;
let yPos;
let notFound = true;
while (notFound) {
    xPos = Math.floor(Math.random() * (n));
    yPos = Math.floor(Math.random() * (n));
    if (g.data[xPos][yPos] == 0) {
        notFound = false;
        g.data[xPos][yPos] = 4;
    }
}

var getSight = (grid, xPos, yPos, sight) => {
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

let sight = 6;
console.log(getSight(g, xPos, yPos, sight))
console.log(g)
