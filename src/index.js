import 'p5/lib/addons/p5.dom';
import p5 from 'p5';
import MassSpringModel from './MassSpringModel';
import './theme.scss'

var sketch = function (p) {

	/* The Model */
	var model = new MassSpringModel(0.1, 10, 10, -0.5, 2, 0.05);
	/* Time-based variables */
	var dt = 0;
	var previoustime = 0, playtime = 0;
	var graph = [];
	/* Control variables */
	var playing = true;
	/* Define constants */
	const fps = 30; // If it stops working try to lower this
	const mmtopx = 2000; // Approx. 1 m = 2000 px
	const timetopx = 30;
	const massx = 600, massy = 200, massw = 50, massh = 20;
	const springh = 150, springn = 10, springr = 10, springtop = 20;
	const arroww = 10, arrowh = 3;

	p.setup = function () {
		createToolbar();
		var canvas = p.createCanvas(p.displayWidth, p.displayHeight);
		reset();
		p.smooth();
		p.frameRate(fps);
		//previoustime = now();
	};

	p.draw = function () {
		dt = now() - previoustime;
		previoustime = now();
		if (playing) {
			playtime += dt;
			p.clear();
			let y = model.next(dt);
			console.log(1000 * y + " mm");
			plotGraph();
			drawSpring(y);
			p.rect(massx, massy + mmtopx * y, massw, massh);
			graph.push({ "x": playtime, "y": y });
		}
	};

	/** Returns the current UNIX timestamp in seconds */
	function now() {
		return (new Date()).getTime() * 0.001;
	}

	/** Resets the values to the defaults and restarts the animation */
	function reset(){
		model = new MassSpringModel(
			parseFloat(p.select('#m').value()), parseFloat(p.select('#b').value()),
			parseFloat(p.select('#k').value()), parseFloat(p.select('#f').value()),
			parseFloat(p.select('#w').value()), parseFloat(p.select('#x0').value()));
		previoustime = now(), playtime = 0
		graph = [];
	}

	/** Creates settings options in a form of a toolbar */
	function createToolbar() {
		let toolbar = p.createDiv("").id('toolbar')
			.child(p.createButton("Start/Pause").mousePressed(() => playing = !playing))
		for (let label of ['m', 'b', 'k', 'f', 'w', 'x0']) {
			toolbar.child(createInputWithLabel(label));
		}
		toolbar.child(p.createButton("Restart with new values").mousePressed(() => reset()));
		p.createP("Set the variables, and hit restart! m:=mass[kg], b:=damping coefficient[Ns/m], k:=spring constant[N/m], f:=force amplitude[N], w:=frequency[1/s], x0:=starting displacement[m].").class("hint");
	}

	/** Creates an input with the necessary settings */
	function createInputWithLabel(label) {
		let labelinput = p.createDiv("");
		labelinput.child(p.createElement("label", label).attribute("for", label))
			.child(p.createInput(model.getData(label)).attribute("id", label).attribute("name", label).input(function () {
				//model.setData(label, parseInt(this.value()));
			}));
		return labelinput;
	}

	function drawSpring(y) {
		p.line(massx + massw / 2, massy - springh, massx + massw / 2, massy - springh - springtop);
		p.line(massx, massy - springh - springtop, massx + massw, massy - springh - springtop);
		const diff = 0.5;
		for (var t = 0; t < 2 * springn * Math.PI; t += diff) {
			p.line(massx + massw / 2 + springr * Math.sin(t),
				massy + mmtopx * y - t / (2 * springn * Math.PI) * (springh + mmtopx * y),
				massx + massw / 2 + springr * Math.sin((t + diff)),
				massy + mmtopx * y - (t + diff) / (2 * springn * Math.PI) * (springh + mmtopx * y));
		}
	}

	function plotGraph() {
		p.line(0, massy + massh / 2, massx - arroww, massy + massh / 2);
		p.triangle(massx, massy + massh / 2, massx - arroww, massy + massh / 2 + arrowh, massx - arroww, massy + massh / 2 - arrowh);
		p.line(massx - playtime * timetopx, arroww, massx - playtime * timetopx, 2 * (massy + massh / 2));
		p.triangle(massx - playtime * timetopx, 0, massx - playtime * timetopx + arrowh, arroww, massx - playtime * timetopx - arrowh, arroww);
		p.stroke(0, 128, 0);
		for (var i = 0; graph[i + 1]; i++) {
			p.line(massx - (playtime - graph[i].x) * timetopx, massy + massh / 2 + mmtopx * graph[i].y,
				massx - (playtime - graph[i + 1].x) * timetopx, massy + massh / 2 + mmtopx * graph[i + 1].y);
		}
		p.stroke(0);
	}
};

new p5(sketch);