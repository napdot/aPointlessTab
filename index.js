let date = new Date();
let hour = date.getHours();
const gridDim = 10;
const timeDelay = 500;

class Cell {
    constructor() {
        this.value = 0;
    }
    change() {
        if (this.value === 0){
            this.value = 1;
        } else {
            this.value = 0;
        }
        return;
    }
    changeDelay(x){
        if (x){
            setTimeout(this.change(), x*timeDelay)
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
    constructor(x,y) {
        this.height = y;
        this.width = x;
        this.content = new Array(this.width);
        for (let i = 0; i < this.width; i++) {
            this.content[i] = new Array(this.height);
            for (let j=0; j< this.height; j++){
                this.content[i][j] = new Cell();
            }
        }
    };

    touch(x,y) {
        this.rowChange(x, y);
        this.columnChange(x, y);
        return;
    }
    rowChange(x, y){
        for (let i=0; i<this.width; i++){
            let dist = x - i;
            this.content[i][y].changeDelay(dist);
        }
        return;
    }
    columnChange(x, y){
        for (let i=0; i<this.height; i++){
            let dist = y - i;
            this.content[x][i].changeDelay(dist);
        }
        return;
    }

    displayGrid(){
        let gridText = "";
        for (let i=0; i<this.height; i++){
            for (let j=0; j<this.width; j++){
                gridText +=  (this.content[i][j].getValue()).toString()
            }
            gridText += "\n";
        }
        return gridText;
    }
}

window.onload = (event) => {
    console.log('Making grid...');
    let grid = new Grid(gridDim, gridDim);
};

