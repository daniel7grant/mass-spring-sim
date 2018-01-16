import 'p5/lib/addons/p5.dom';
import p5 from 'p5';
import MassSpringModel from './MassSpringModel';
import './theme.scss';

var sketch = function (p) {

	/* The Model */
	var model = new MassSpringModel(0.1, 10, 10, -0.5, 1, 0);
	/* Time-based variables */
	var dt = 0;
	var previoustime = 0, playtime = 0;
	var graph = [];
	/* Control variables */
	var playing = true;
	/* Define constants */
	const fps = 60; // If it stops working try to lower this
	const mmtopx = 2000; // Approx. 1 m = 2000 px
	const timetopx = 30;
	const Ntopx = 100;
	const massx = 600, massy = 300, massw = 50, massh = 20;
	const springh = 150, springn = 10, springr = 10, springtop = 20;
	const arroww = 10, arrowh = 3;

	p.setup = function () {
		createToolbar();
		p.createCanvas(p.displayWidth, p.displayHeight);
		reset();
		p.smooth();
		p.frameRate(fps);
		//previoustime = now();
	};

	p.draw = function () {
		dt = now() - previoustime || 0.00001; // In case of dt = 0
		previoustime = now();
		if (playing) {
			playtime += dt;
			p.clear();
			let y = model.next(dt);
			//console.log(1000 * y + ' mm');
			plotGraph();
			drawSpring(y);
			p.rect(massx, massy + mmtopx * y, massw, massh);
			graph.unshift({ 'x': playtime, 'y': y });
		}
	};

	/** Returns the current UNIX timestamp in seconds */
	function now() {
		return Date.now() * 0.001;
	}

	/** Resets the values to the defaults and restarts the animation */
	function reset(){
		model = new MassSpringModel(
			parseFloat(p.select('#m').value()), parseFloat(p.select('#b').value()),
			parseFloat(p.select('#k').value()), parseFloat(p.select('#f').value()),
			parseFloat(p.select('#w').value()), parseFloat(p.select('#x0').value()));
		previoustime = now(), playtime = 0;
		graph = [];
	}

	/** Creates settings options in a form of a toolbar */
	function createToolbar() {
		let toolbar = p.createDiv('').id('toolbar')
			.child(p.createButton('Start/Pause').mousePressed(() => playing = !playing));
		for (let label of ['m', 'b', 'k', 'f', 'w', 'x0']) {
			toolbar.child(createInputWithLabel(label));
		}
		toolbar.child(p.createButton('Restart with new values').mousePressed(() => reset()));
		p.createP('Set the variables, and hit restart! m:=mass[kg], b:=damping coefficient[Ns/m], k:=spring constant[N/m], f:=force amplitude[N], w:=frequency[1/s], x0:=starting displacement[m].').class('hint');
	}

	/** Creates an input with the necessary settings */
	function createInputWithLabel(label) {
		let labelinput = p.createDiv('');
		labelinput.child(p.createElement('label', label).attribute('for', label))
			.child(p.createInput(model.getData(label)).attribute('id', label).attribute('name', label).input(function () {
				//model.setData(label, parseInt(this.value()));
			}));
		return labelinput;
	}

	function drawSpring(y) {
		p.line(massx, massy - springh + Ntopx*model.getData('ft'), massx + massw, massy - springh + Ntopx*model.getData('ft'));
		const diff = 0.5;
		for (var t = 0; t < 2 * springn * Math.PI; t += diff) {
			p.line(massx + massw / 2 + springr * Math.sin(t),
				massy + mmtopx * y - t / (2 * springn * Math.PI) * (springh + mmtopx * y - Ntopx*model.getData('ft')),
				massx + massw / 2 + springr * Math.sin(t + diff),
				massy + mmtopx * y - (t + diff) / (2 * springn * Math.PI) * (springh + mmtopx * y - Ntopx*model.getData('ft')));
		}
	}

	function plotGraph() {
		p.line(0, massy + massh / 2, massx - arroww, massy + massh / 2);
		p.triangle(massx, massy + massh / 2, massx - arroww, massy + massh / 2 + arrowh, massx - arroww, massy + massh / 2 - arrowh);
		if(massx - playtime * timetopx > 0){
			p.line(massx - playtime * timetopx, arroww, massx - playtime * timetopx, 2 * (massy + massh / 2));
			p.triangle(massx - playtime * timetopx, 0, massx - playtime * timetopx + arrowh, arroww, massx - playtime * timetopx - arrowh, arroww);
		}
		const nth = 3;
		for (var i = 0; graph[i + nth] && massx - (playtime - graph[i + nth].x) * timetopx > 0; i+=nth) {
			p.stroke(0, 128, 0);
			p.line(massx - (playtime - graph[i].x) * timetopx,
				massy + massh / 2 + mmtopx * graph[i].y,
				massx - (playtime - graph[i + nth].x) * timetopx,
				massy + massh / 2 + mmtopx * graph[i + nth].y);
			p.stroke(128, 128, 255);
			p.line(massx - (playtime - graph[i].x) * timetopx,
				massy - springh + Ntopx*model.getData('f')*Math.sin(model.getData('w')*(graph[i].x)),
				massx - (playtime - graph[i + nth].x) * timetopx,
				massy - springh + Ntopx*model.getData('f') * Math.sin(model.getData('w') * (graph[i + nth].x)));
		}
		p.stroke(0);
	}
};

new p5(sketch);