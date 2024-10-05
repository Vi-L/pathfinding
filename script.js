import Heap from './heap.js'

function manhattanDist(p1, p2) {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y)
}

function aStarGrid(grid, start, goal, heuristic) {
    let count = 0 // safety check, prevent infinite loop
    const openSet = new Heap((a,b) => a.priority < b.priority)
    const startNode = {coords: start, priority: heuristic(start, goal), bestScore: 0}
    openSet.insert(startNode)
    const visited = {[JSON.stringify(start)]: startNode}
    const cameFrom = {[JSON.stringify(start)]: null}
    while (count < grid.length*grid.length && openSet.length() > 0) {
        count++
        const current = openSet.pop()
        //console.log(openSet.length(), JSON.stringify(current.coords), JSON.stringify(visited[JSON.stringify(current.coords)]))
        if (current.coords.x === goal.x && current.coords.y === goal.y) {
            //reconstruct path
            const path = []
            let sq = current.coords
            while (cameFrom[JSON.stringify(sq)] !== null) {
                path.push(sq)
                sq = cameFrom[JSON.stringify(sq)]
            }
            return path.reverse()
        }
        const neighbors = getNeighbors(current.coords, grid)
        for (const neighbor of neighbors) {
            const newScore = current.bestScore + 1 // +1 because unweighted rect grid
            const key = JSON.stringify(neighbor)
            if (visited[key] === undefined) {
                visited[key] = {coords: neighbor, priority: Infinity, bestScore: Infinity}
            }
            if (newScore < visited[key].bestScore) {
                //console.log("insert ", JSON.stringify(current.coords), JSON.stringify(neighbor))
                cameFrom[key] = current.coords
                visited[key].bestScore = newScore
                visited[key].priority = newScore + heuristic(neighbor, goal)
                openSet.insert({coords: neighbor, priority: visited[key].priority, bestScore: visited[key].bestScore})
            }
        }
    }
    if (count === 60) {console.log("infinite loop")}
}

function breadthFirstGrid(grid, start, goal) { 
    const queue = [start]
    const cameFrom = {[JSON.stringify(start)]: null}
    while (queue.length >= 1) {
        const currSquare = queue.shift()
        if (currSquare.x === goal.x && currSquare.y === goal.y) {
            const path = []
            let sq = currSquare
            while (cameFrom[JSON.stringify(sq)] !== null) {
                path.push(sq)
                sq = cameFrom[JSON.stringify(sq)]
            }
            return path.reverse()
        }
        for (const neighbor of getNeighbors(currSquare, grid)) {
            if (!(JSON.stringify(neighbor) in cameFrom)) {
                cameFrom[JSON.stringify(neighbor)] = currSquare
                queue.push(neighbor)
            }
        }
    }
}

function getNeighbors(node, grid) {
    const {x, y} = node
    const res = [{x: x-1, y}, {x: x+1, y}, 
                 {x, y: y-1}, {x, y: y+1}]
    return res.filter((e) => 
        // check if wall or out of bounds
            e.x >= 0 && e.y >= 0 && 
            e.y < grid.length && e.x < grid[0].length &&
            grid[e.y][e.x] === 0) 
}

let grid

window.setup = function () {
  createCanvas(windowWidth, windowHeight);
  background(255);
    randomSeed(0)
    grid = []
    for (let i = 0; i < 10; i++) {
        let row = []
        for (let j = 0; j < 10; j++) {
            row.push(random(10) > 7 ? 1 : 0)
        }
        grid.push(row)
    }
    // print(breadthFirstGrid(grid, {x: 0, y: 2}, {x: 1, y: 0}))
    
}

window.draw = function () {
    frameRate(2)
    const boxSize = 25
    const start = {x: 0, y: 2}
    const goal = {x: floor(mouseX / boxSize), y: floor(mouseY / boxSize)}
    const path = aStarGrid(grid, start, goal, manhattanDist)
    const bfsPath = breadthFirstGrid(grid, start, goal)
    stroke(0)
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === 1) {
                fill(0)
            } else {
                fill(255)
            }
            rect(j*boxSize, i*boxSize, boxSize, boxSize)
        }
    }
    fill(255, 255, 0)
    if (path) {
        if (path.length !== bfsPath.length) console.log("oh no!")
        for (const coords of path) {
            rect(coords.x*boxSize, coords.y*boxSize, boxSize, boxSize)
        }
    }
    rect(start.x*boxSize, start.y*boxSize, boxSize, boxSize)
}
