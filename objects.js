/*
 *  Particle fireworks by serjio28, October 2012
 *  http://www.sfilippov.com
 */


// base class for all objects
function MotionObject(H,W, GraphCanvas, Radius, X, Y, path_max, v0, alfa, g) {
	this.t = 0;
	this.context = GraphCanvas;
	this.r = Radius;
	this.x = X;
	this.xShift = X;
	this.y = Y;
	this.path=[];
	this.path_max = path_max;
	this.time_divider = 10;
	this.v0=v0;
	this.alfa=alfa;
	this.g = g;
	this.H = H;
	this.W = W;
	this.died = false;
	this.id = Math.floor(Math.random() * 1000000); // unique identifier
	console.log("MotionObject:"+this.id);
	
}

MotionObject.prototype.isDied = function(){
	return this.died;	
}

MotionObject.prototype.paint = function(x,y,r) {
	this.draw("#000",x,y,r);
}

MotionObject.prototype.clear = function(p,r) {
	var x = p[0];
	var y = p[1];
	this.draw("#fff",x,y,r+2);
}

MotionObject.prototype.draw = function(color,x,y,r) {
	this.context.fillStyle = color;
	this.context.strokeStyle= color;
	this.context.beginPath();
	this.context.arc(x,y,r, 0, Math.PI * 2, true);
	this.context.closePath();
	this.context.fill();
	this.context.stroke();

}

MotionObject.prototype.queAdd = function(x,y) {
	this.path.push([x,y]);
	if(this.path.length>this.path_max){
		this.path.shift();
	}
}

MotionObject.prototype.move = function() {
	this.Xmove();
	this.Ymove();
	this.t += 1/this.time_divider;
	this.queAdd(this.x, this.y);
	var lastpath = this.path[0];
		
	if( lastpath[0] > this.W || lastpath[0] < 0 || lastpath[1] > this.H || lastpath[1] < 0){ 
		console.log("out of range. must be deleted id:"+this.id);
		this.died = true;
	}
	//console.log("alfa:"+this.alfa+" x:"+this.x+" y:"+this.y);
}

MotionObject.prototype.Xmove = function() {
	this.x=  this.xShift + Math.ceil(this.v0 * Math.cos(this.alfa))* this.t*this.time_divider;
}

MotionObject.prototype.Ymove = function() {
	this.y=  this.H - Math.ceil(  this.v0 * Math.sin(this.alfa)* this.t*this.time_divider - (this.g * this.t* this.t)/2 ); 
}

MotionObject.prototype.life = function() {
	if(this.t*this.time_divider > this.path_max)	this.clear(this.path[0], this.r);
	this.move();
	this.paint(this.x,this.y, this.r);
}
