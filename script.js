const tableEl = document.getElementById('table-id');
const showEl = document.getElementById('show-id');
const startEl = document.getElementById('start-id');
const stopEl = document.getElementById('stop-id');

const dh = [-1,1,0,0];
const dw = [0,0,-1,1];
let interval;

const width = 20;
const height = 10;
const gp = [];

class Queue {
    constructor() {
        this.element = [];
        this.visited = [];
        for(let i = 0; i < height; i++) {
            let row = [];
            for(let j = 0; j < width; j++) {
                row.push(false);
            }
            this.visited.push(row);
        }
    }
    size() {
        return this.element.length;
    }
    isEmpty() {
        return this.element.length==0;
    }
    peek() {
        if(this.isEmpty()) return;
        return this.element[0];
    }
    enqueue(id) {
        this.element.push(id);
    }
    dequeue() {
        if(this.isEmpty()) return;
        let top = this.peek();
        this.element.shift();
        return top;
    }
    clear() {
        this.element = [];
        this.visited.forEach(row => {
            for(let j = 0; j < row.length; j++) row[j] = false;
        })
    }
}
const queue = new Queue();

class Node {
    constructor(id,tdEl) {
        this.id = id;
        this.tdEl = tdEl;
        this.clickListener = () => {
            addCellClicks(this.id);
        }
        this.adj = [];
    }
}

function getNumber(i, j) {
    return width*i+j;
}

function getCo(numbr) {
    let i = Math.floor(numbr/width);
    let j = numbr%width;
    return [i,j];
}

function inRange(h, w) {
    if(h<0 || w<0) return false;
    if(h>=height || w>=width) return false;
    return true;
}

function makeGraph() {
    for(let i = 0; i < height; i++) {
        let trEl = document.createElement('tr');
        let row = [];
        for(let j = 0; j < width; j++) {
            let nmbr = getNumber(i,j);
            let tdEl = document.createElement('td');
            tdEl.innerText = nmbr+1;
            let nd = new Node(nmbr,tdEl);
            row.push(nd);
            trEl.appendChild(tdEl);
        }
        gp.push(row);
        tableEl.appendChild(trEl);
    }
    console.log(gp);
    for(let i = 0; i < height; i++) {
        for(let j = 0; j < width; j++) {
            for(let d = 0; d < 4; d++) {
                let newH = i + dh[d];
                let newW = j + dw[d];
                if(!inRange(newH,newW)) continue;
                let adj = gp[i][j].adj;
                adj.push(gp[newH][newW]);
            }
        }
    }
    console.log(gp);
}

let addCellClicks = function(id) {
    queue.clear();
    queue.enqueue(id);
    console.log(queue);
}

function addCellListeners() {
    gp.forEach(row => {
        row.forEach(nd => {
            let tdEl = nd.tdEl;
            let listener = nd.clickListener;
            tdEl.addEventListener('click', listener);
        });
    });
}

function removeCellListeners() {
    gp.forEach(row => {
        row.forEach(nd => {
            let tdEl = nd.tdEl;
            let listener = nd.clickListener;
            tdEl.removeEventListener('click', listener);
        })
    })
}

function startBfs() {
    startEl.removeEventListener('click', bfs);
    removeCellListeners();
    interval = setInterval(() => {
        if(queue.isEmpty()) {
            clearInterval(interval);
            addCellListeners();
            startEl.addEventListener('click',bfs);
            console.log('finished');
            return;
        }
        let topId = queue.dequeue();
        let co = getCo(topId);
        let x = co[0];
        let y = co[1];
        let visited = queue.visited;
        console.log(x,y);
        let nd = gp[x][y];
        let tdEl = nd.tdEl;
        tdEl.style.backgroundColor = 'green';
        tdEl.style.color = 'white';
        for(let d = 0; d < 4; d++) {
            let newH = x + dh[d];
            let newW = y + dw[d];
            if(!inRange(newH,newW)) continue;
            if(visited[newH][newW]) continue;
            // console.log(newH,newW);
            visited[newH][newW] = true;
            let numbr = getNumber(newH,newW);
            queue.enqueue(numbr);
        }
    },100);
}

function reRenderCells() {
    gp.forEach(row => {
        row.forEach(nd => {
            let tdEl = nd.tdEl;
            tdEl.style.backgroundColor = 'white';
            tdEl.style.color = 'black';
        })
    })
}

let bfs = () => {
    console.log('inside bfs');
    // console
    if(queue.isEmpty()) return;
    reRenderCells();
    startBfs();
}

function addStartListener() {
    console.log('inside addStartListener');
    startEl.addEventListener('click', bfs);
}

function stop() {
    if(interval) clearInterval(interval);
    reRenderCells();
    addCellListeners();
    queue.clear();
    startEl.addEventListener('click',bfs);
}

function addStopListener() {
    stopEl.addEventListener('click', stop);
}

makeGraph();
addCellListeners();
addStartListener();
addStopListener();