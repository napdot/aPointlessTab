// let date = new Date();
// let hour = date.getHours();
const gridDimY = 10;
const gridDimX = 10;
const timeDelayClicker = 700;
const timeDelay = 100;


class Cell {
    constructor() {
        this.value = 0;
    }
    maxValues = 2;
    el = null;
    updateEl() {
        if (this.el == null){
            console.log('Element is null');
        } else {
            this.el.innerText = this.getValue();
            this.el.className = ('btn' + this.getValue().toString());
        }
    }

    change() {
        this.value = (this.getValue() + 1 ) % this.maxValues;
        this.updateEl();
        return;
    }
    changeDelay(x){
        if (x){
            let del = Math.abs(x*timeDelay);
            let cell = this;
            setTimeout(function () {
                cell.change()
            }, del);
        } else {
            this.change();
        }

        return;
    }
    getValue(){
        return this.value;
    }
}

class Grid {
    constructor(y, x) {
        this.y = y;
        this.x = x;
        this.content = new Array(this.x);
        for (let i = 0; i < this.x; i++) {
            this.content[i] = new Array(this.y);
            for (let j=0; j< this.y; j++){
                this.content[i][j] = new Cell();
            }
        }
    };
    dimensions(){
        return "x:" + this.x.toString() + " y:" + this.y.toString();
    }

    touch(x,y) {
        this.rowChange(x, y);
        this.columnChange(x, y);
        return;
    }
    rowChange(x, y){
        for (let i=0; i<this.x; i++){
            let dist = x - i;
            this.content[i][y].changeDelay(dist);
        }
        return;
    }
    columnChange(x, y){
        for (let i=0; i<this.y; i++){
            let dist = y - i;
            this.content[x][i].changeDelay(dist);
        }
        return;
    }

    checkIfAll(){   // Game function
        let val;
        for (let i = 0; i < this.x; i++) {
            for (let j = 0; j < this.y; j++) {
                if (val === undefined){
                    val = this.content[i][j].getValue();    // Get value to compare against
                } else {
                    if (val !== this.content[i][j].getValue()){ // Compare the value
                        return
                    }
                }
            }
        }
        alert("Puzzle solved");
    }
}


class Picker {
    constructor(grid) {
        this.grid = grid;
    }
    delay = timeDelayClicker;

    pickOne(){
        let i = Math.floor((Math.random() * this.grid.x));
        let j = Math.floor((Math.random() * this.grid.y));
        this.grid.touch(i, j);
    }
}

window.onload = () => {
    console.log('Making grid...');
    let grid = new Grid(gridDimY, gridDimX);
    gridToDom(grid);
    let myPicker = new Picker(grid);
    let pallete = getPalette();
    let interval = setInterval(function (){
        myPicker.pickOne()
    }, myPicker.delay)
    document.getElementById("button_new_settings").addEventListener('click', ()=>{
        clearInterval(interval);
        grid = new Grid(document.getElementById("y_setting").value, document.getElementById("x_setting").value);
        myPicker = new Picker(grid);
        console.log("Making new grid...");
        document.getElementById("gridspace").remove();  // Somehow empty doesn't clear, doing workaround
        let gridspace = document.createElement("div");
        gridspace.id = "gridspace";
        document.body.insertBefore(gridspace, document.getElementById("setting"));
        gridToDom(grid);
        myPicker.delay = document.getElementById("clicker_setting").value;
        interval = setInterval(function (){
            myPicker.pickOne();
        }, myPicker.delay);
    });
};



function getPalette() {
    fetch("./palette.json")
        .then(response => {
            return response.json();
        })
        .then(data => console.log(data));
}


function gridToDom(grid) {
    grid.content.forEach((c, i) => {
        let newDiv = document.createElement("div");
        newDiv.id = ("_" + i.toString());
        newDiv.className = 'column';
        c.forEach((r, j) => {
            // Create button
            let newSub = document.createElement("button");
            newSub.innerText = grid.content[i][j].getValue();
            newSub.addEventListener('click', () => {
                grid.touch(i, j);
                console.log(i.toString() + " ", j.toString());
                //grid.checkIfAll();    If want to have it as a game
            });
            newSub.className = "btn" + grid.content[i][j].getValue().toString();
            newSub.id = ("__" + j.toString());
            grid.content[i][j].el = newSub;
            // Add to section.
            newDiv.appendChild(newSub);
        });
        document.getElementById("gridspace").appendChild(newDiv);
    });
}