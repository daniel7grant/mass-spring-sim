import 'p5/lib/addons/p5.dom';
import p5 from 'p5';
import MassSpringModel from './MassSpringModel';
import './theme.scss';


/* The Model */
var model = new MassSpringModel(0.1, 1, 10, -0.5, 1, 0);
/* Time-based variables */
var dt = 0;
var previoustime = 0, playtime = 0;
var graph = [];
/* Control variables */
var playing = true;
/* Define constants */
const fps = 120; // If it stops working try to lower this
const mmtopx = 2000; // Approx. 1 m = 2000 px
const timetopx = 30;
//const Ntopx = 200;
const massx = 600, massy = 300, massw = 50, massh = 20;
const springh = 200, springn = 10, springr = 10, springtop = 20;
const arroww = 10, arrowh = 3;
const maxwidth = 10000;

var sketch1 = function (p){
	p.setup = function () {
		createToolbar();
		p.createDiv('').id('container').child(p.createCanvas(massx * 1.5, maxwidth).id('canvas1').style('left', massx + 'px'));
		reset();
		p.smooth();
		p.noLoop();
	};

	p.draw = function(){
		plotGraph();
	}

	/** Creates settings options in a form of a toolbar */
	function createToolbar() {
		let toolbar = p.createDiv('').id('toolbar')
			.child(p.createButton('Start/Pause').mousePressed(() => playing = !playing));
		for (let label of ['m', 'b', 'k', 'x0', 'f']) {
			toolbar.child(createInputWithLabel(label));
		}
		toolbar.child(
			p.createDiv('')
			.child(p.createElement('label', 'w = ' + model.getData('w')).id('wtext').attribute('for', 'w'))
			.child(p.createSlider(-1, 1, Math.log10(model.getData('w')), 0).id('w').changed(function(){
				p.select('#wtext').html('w = ' + Math.round(Math.pow(10, this.value())*100)/100);
			}))
		);
		// toolbar.child(p.createP('w = ' + model.getData('w')).id('wtext'));
		toolbar.child(p.createButton('Restart with new values').mousePressed(() => reset()));
		p.createP('Set the variables, and hit restart! m:=mass[kg], b:=damping coefficient[Ns/m], k:=spring constant[N/m], f:=force amplitude[N], w:=frequency[1/s], x0:=starting displacement[m].').class('hint');
	}

	/** Creates an input with the necessary settings */
	function createInputWithLabel(label) {
		let labelinput = p.createDiv('');
		labelinput.child(p.createElement('label', label).attribute('for', label))
			.child(p.createInput(model.getData(label)).id(label).attribute('name', label));
		return labelinput;
	}

	/** Resets the values to the defaults and restarts the animation */
	function reset(){
		p.clear();
		model = new MassSpringModel(
			parseFloat(p.select('#m').value()), parseFloat(p.select('#b').value()),
			parseFloat(p.select('#k').value()), parseFloat(p.select('#f').value()),
			Math.pow(10, parseFloat(p.select('#w').value())), parseFloat(p.select('#x0').value()));
		previoustime = now(), playtime = 0;
		graph = [{x:0, y:0, ft:0}, {x:0, y:0, ft:0}];
		p.line(0, massy + massh / 2, maxwidth - arroww, massy + massh / 2);
		p.triangle(maxwidth, massy + massh / 2, maxwidth - arroww, massy + massh / 2 + arrowh, maxwidth - arroww, massy + massh / 2 - arrowh);
		p.line(0 , arroww, 0 , 2 * (massy + massh / 2));
		p.triangle(0 , 0, arrowh, arroww, - arrowh, arroww);
	}

	function plotGraph() {
		p.select('#canvas1').style('left', (massx - playtime*timetopx) + 'px') 
		// const nth = 1;
		// for (var i = 0; graph[i + nth] && massx - (playtime - graph[i + nth].x) * timetopx > 0; i+=nth) {
			p.stroke(0, 128, 0);
			p.line(graph[0].x * timetopx,
				massy + massh / 2 + mmtopx * graph[0].y,
				graph[1].x * timetopx,
				massy + massh / 2 + mmtopx * graph[1].y);
			p.stroke(128, 128, 255);
			p.line(graph[0].x * timetopx,
				massy - springh + mmtopx/model.getData('k')*graph[0].ft,
				graph[1].x * timetopx,
				massy - springh + mmtopx/model.getData('k')*graph[1].ft);
		// }
		p.stroke(0);
	}
}

var p1 = new p5(sketch1);

var sketch2 = function (p) {

	p.setup = function () {
		p.select('#container').child(p.createCanvas(massw+1, massy * 2).id('canvas2').style('left', massx + 'px'));
		p.smooth();
		p.frameRate(fps);
	};

	p.draw = function () {
		dt = now() - previoustime || 0.00001; // In case of dt = 0
		previoustime = now();
		if (playing) {
			playtime += dt;
			p.clear();
			let y = model.next(dt);
			drawSpring(y);
			p1.redraw();
			p.rect(0, massy + mmtopx * y, massw, massh);
			graph.unshift({ 'x': playtime, 'y': y, 'ft' : model.getData('ft') });
		}
	};

	function drawSpring(y) {
		p.line(0, massy - springh + mmtopx/model.getData('k')*model.getData('ft'), 0 + massw, massy - springh + mmtopx/model.getData('k')*model.getData('ft'));
		const diff = 0.5;
		for (var t = 0; t < 2 * springn * Math.PI; t += diff) {
			p.line(0 + massw / 2 + springr * Math.sin(t),
				massy + mmtopx * y - t / (2 * springn * Math.PI) * (springh + mmtopx * y - mmtopx/model.getData('k')*model.getData('ft')),
				0 + massw / 2 + springr * Math.sin(t + diff),
				massy + mmtopx * y - (t + diff) / (2 * springn * Math.PI) * (springh + mmtopx * y - mmtopx/model.getData('k')*model.getData('ft')));
		}
	}
};

var p2 = new p5(sketch2);

/** Returns the current UNIX timestamp in seconds */
function now() {
	return Date.now() * 0.001;
}