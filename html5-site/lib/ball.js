class Ball {
    constructor(parentEl ,options={
        size: undefined,
        x: undefined,
        y: undefined,
        bgc: undefined
    }) {
        this.el = document.createElement('div');
        this.el.className = 'ball';
        this._size = options.size*1 || (15 + Math.floor(Math.random()*16));
        this._x = options.x*1 || Math.floor(Math.random()*800);
        this._y = options.y*1 || Math.floor(Math.random()*600);
        this._bgc = this.randomRGB();
        this.display();
        parentEl.append(this.el);
    }
    display(){
        this.el.style.top = this._y + 'px';
        this.el.style.left = this._x + 'px';
        this.el.style.width = this._size +'px';
        this.el.style.height = this._size +'px';
        this.el.style.backgroundColor = this._bgc;
    }
    randomRGB() {
        let c = Math.floor(16777216*Math.random());
        c = c.toString(16); // 轉換為 16 進位的字串
        return '#' + '000000'.slice(c.length) + c;
    }

    get x(){
        return this._x;
    }
    set x(val){
        this._x = val*1;
        this.display();
    }
    get y(){
        return this._y;
    }
    set y(val){
        this._y = val*1;
        this.display();
    }
    get size(){
        return this._size;
    }
    set size(val){
        this._size = val*1;
        this.display();
    }

    // Plain Object
    toJSON(){
        return {
            x: this._x,
            y: this._y,
            size: this._size,
            bgc: this._bgc,
        };
    }
}