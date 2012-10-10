/*
 *  Particle fireworks by serjio28, October 2012
 *  http://www.sfilippov.com
 */

var GC = new GraphCanvas(2, 500);
if (GC.createCanvas()) {
	var Obj = new MotionObject(GC.HEIGHT, GC.WIDTH, GC.canvasContext[1], 1,
			GC.w_middle, GC.HEIGHT - 10, 5, 10, Math.PI / 4, 9.82);
	GC.addObject(Obj);
	GC.launch();
}

