/*
 *  Particle fireworks by serjio28, October 2012
 *  http://www.sfilippov.com
 */

function GraphCanvas(d, rlimit) {
	this.WIDTH = 0; // the screen width
	this.HEIGHT = 0; // the screen height
	this.h_middle = 0; // height divided by 2
	this.w_middle = 0; // width divided by 2
	this.resolution_limit = rlimit;
	this.canvasContext = []; // array with contexts
	this.canvasGraph = []; // array with graphs
	this.Inhabitans = []; // objects which inhabit this canvas
	this.hAnimation = null; // link to timer function
	this.d = d;
	this.time_life = 0;
	this.mutex = 0;
	this.ball_frequency=Math.floor(1/20*1000);

	// sanity check for screen resolution
	if (typeof (window.innerWidth) == 'number') {
		this.WIDTH = window.innerWidth;
		this.HEIGHT = window.innerHeight;
	} else {
		$('sorry, window parameters can not be detected').appendTo('body');
		return;
	}
	;

	// whether the screen width and height exceeds our limit
	// if yes then divide it by 2
	if (this.WIDTH > this.resolution_limit) {
		this.WIDTH = Math.floor(this.WIDTH / d);
	}

	if (this.HEIGHT > this.resolution_limit) {
		this.HEIGHT = Math.floor(this.HEIGHT / d);
	}

	this.h_middle = Math.floor(this.HEIGHT / 2);
	this.w_middle = Math.floor(this.WIDTH / 2);

}

GraphCanvas.prototype.createCanvas = function() {
	var GraphCanvasObject = this;
	$('body').append('<input type="button" id="bstop" value="Stop" style=\"width:50px; z-index:2;top:0;left:0;\">').click(
			function() {
				if (GraphCanvasObject.hAnimation != null) {
					GraphCanvasObject.terminate();
				} else {
					GraphCanvasObject.launch();
				}
			});

	$('body').append("<div id='slider1' style=\"width:5px;height:200px; position:absolute; z-index:2;top:40;left:10;\" ></div");
	
	$("#slider1" ).slider({
		range: "min",
		orientation: "vertical",		
		min: 1,
		max: 100,
		value:20,
		slide: function( event, ui ) {
			//console.log("slider:"+ui.value);
			//$( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
			GraphCanvasObject.terminate();
			GraphCanvasObject.ball_frequency=Math.floor(1/ui.value*1000);
			GraphCanvasObject.launch();
		}
	}) ;

	var canvas_definition = [
			"<canvas width='" + this.WIDTH + "' height='" + this.HEIGHT
					+ "' style=\"display:none\"></canvas>",
			"<canvas width='"
					+ this.WIDTH
					+ "' height='"
					+ this.HEIGHT
					+ "' style=\"z-index:1;position: absolute; padding-left: 0;padding-right: 0;margin-left: auto; margin-right: auto;\"></canvas>" ];

	for ( var i = 0; i < canvas_definition.length; i++) {
		try {
			// initialize a canvas
			var canvas = $(canvas_definition[i]);
			// get context and graph
			this.canvasContext[i] = canvas.get(0).getContext("2d");
			this.canvasGraph[i] = canvas.get(0);
			// add the context to body of the document
			canvas.appendTo('body');
		} catch (e) {
			var message = e.message;
			var name = e.name;
			console.log(" name:" + name + " message:" + _message);
			return false;
		}
	}

	;
	this.clearCanvas();
	return true;
};

GraphCanvas.prototype.clearCanvas = function() {
	// clear the hidden context before do anything
	this.canvasContext[1].fillStyle = "#fff";
	this.canvasContext[1].fillRect(0, 0, this.WIDTH, this.HEIGHT);
};

GraphCanvas.prototype.addObject = function(object) {
	this.Inhabitans.push(object);
	console.log("new item:"+object.id.toString());
	console.log("after push size:" + this.Inhabitans.length);
};

GraphCanvas.prototype.terminate = function() {
	console.log("terminate");
	clearInterval(this.hAnimation);
	clearInterval(this.hObjectGen);
	this.hAnimation = null;
	$("#bstop").attr('value', 'Start');
};

GraphCanvas.prototype.launch = function() {
	var GraphCanvasObject = this;
	this.hAnimation = setInterval(function() {
		GraphCanvasObject.life();
	}, Math.ceil(1000 / 25));
	
	this.hObjectGen = setInterval(function() {
		if(GraphCanvasObject.mutex == 0) {
			GraphCanvasObject.mutex = 1;

			var x = 100;
			var angle = Math.random() * (Math.PI);
			var v0 = Math.random() * 20;
			if (v0 > 5 && angle > Math.PI/6 && angle < 5*Math.PI/6) {
				var Obj = new MotionObject(GraphCanvasObject.HEIGHT, GraphCanvasObject.WIDTH,
						GraphCanvasObject.canvasContext[1], 1, GraphCanvasObject.w_middle, GraphCanvasObject.HEIGHT - 10, 5, v0, angle,
						9.82);
				if(Obj!=undefined) GraphCanvasObject.addObject(Obj);

			}
			;
			GraphCanvasObject.mutex = 0;
		};
	}, this.ball_frequency);
	
	$("#bstop").attr('value', 'Stop');
};

GraphCanvas.prototype.life = function() {
	var deadlock_detect = 0;
	if (this.mutex == 0) {
		this.mutex = 1;
		// console.log("GC mutex=1");
		if (this.Inhabitans.length == 0) {
			this.terminate();
		}
		;

		// delete object which were died now
		for ( var i = 0; i < this.Inhabitans.length; i++) {
			var item = this.Inhabitans[i];
			if (item != undefined) {
				if (item.isDied()) {
					console.log("before size:" + this.Inhabitans.length);
					delete this.Inhabitans[i];
					this.Inhabitans.splice(i, 1);
					console.log("deleted:"+i);
					console.log("after size:" + this.Inhabitans.length);
				}
				;
			}
			;
		}

		var r = "";
		// give each object a chance to live in
		this.Inhabitans.forEach(function(item) {
			if (item != undefined){
				if(item.path.length>1){
					var lp = item.path[0];
					r += item.id.toString() + " [x:" +  item.x + " y:" + item.y + "][ lx:" +lp[0] +" ly:"+ lp[1]+"] " + ",";
				};
				item.life();
			};
		});
		console.log("alive:"+r);
		;
		this.mutex = 0;
		// console.log("GC mutex=0");
	}
	;
	this.canvasContext[1].drawImage(this.canvasGraph[0], 0, 0);
};
