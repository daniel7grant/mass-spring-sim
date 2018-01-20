import 'p5/lib/addons/p5.dom';
import p5 from 'p5';
import MassSpringModel from './MassSpringModel';
import './theme.scss';


/* The Model */
var model = new MassSpringModel(10, 5, 10, -0.3, 1, 0);
/* Time-based variables */
var dt = 0;
var previoustime = 0, playtime = 0;
var graph = [];
/* Control variables */
var playing = true;
/* Define constants */
var faster = 1; //Change this to make it faster tho less accurate
const fps = 120; // If it stops working try to lower this
const mmtopx = 2000; // Approx. 1 m = 2000 px
const timetopx = 30;
const massx = 600, massy = 300, massw = 50, massh = 20;
const springh = 200, springn = 10, springr = 10, springtop = 20;
const arroww = 10, arrowh = 3;
const margin = 20;
const maxwidth = 10000;
const bodepos = 200, bodewidth = 300;

/** Returns the current UNIX timestamp in seconds */
function now() {
	return Date.now() * 0.001;
}

var sketch1 = function (p){
	p.setup = function () {
		createToolbar();
		p.createDiv('').id('container').child(p.createCanvas(maxwidth, massy*2).id('canvas1').style('left', massx + 'px'));
		p.smooth();
		p.noLoop();
		reset();
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
		toolbar.child(p.createDiv('')
			.child(p.createElement('label', 'w = ' + model.getData('w')).id('wtext').attribute('for', 'w'))
			.child(p.createSlider(-1, 1, Math.log10(model.getData('w')), 0).id('w').changed(function(){
				p.select('#wtext').html('w = ' + Math.round(Math.pow(10, this.value())*100)/100);
			}))
		);
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
		p.line(margin, massy + massh / 2, maxwidth - arroww, massy + massh / 2);
		p.triangle(maxwidth, massy + massh / 2, maxwidth - arroww, massy + massh / 2 + arrowh, maxwidth - arroww, massy + massh / 2 - arrowh);
		p.line(margin, arroww, margin, 2 * (massy + massh / 2));
		p.triangle(margin, 0, margin + arrowh, arroww, margin - arrowh, arroww);
		p0.redraw();
	}

	function plotGraph() {
		p.select('#canvas1').style('left', (massx - playtime*timetopx - margin) + 'px') 
		if(graph[1].x * timetopx > maxwidth) {
			playing = false;
		}
		p.stroke(0, 128, 0);
		p.line(margin + graph[0].x * timetopx,
			massy + massh / 2 + mmtopx * graph[0].y,
			margin + graph[1].x * timetopx,
			massy + massh / 2 + mmtopx * graph[1].y);
		p.stroke(128, 128, 255);
		p.line(margin + graph[0].x * timetopx,
			massy - springh + mmtopx/model.getData('k')*graph[0].ft,
			margin + graph[1].x * timetopx,
			massy - springh + mmtopx/model.getData('k')*graph[1].ft);
		p.stroke(0);
	}
}

var p1 = new p5(sketch1);

var bode = function(p){
	
	p.setup = function(){
		p.select('#container').child(p.createCanvas(bodewidth, massy*2).id('bode').style('left', massx + bodepos + 'px'));
		p.smooth();
		p.noLoop();
	}
	
	p.draw = function(){
		p.clear();
		p.line(margin, massy + massh / 2, bodewidth - arroww, massy + massh / 2);
		p.triangle(bodewidth, massy + massh / 2, bodewidth - arroww, massy + massh / 2 + arrowh, bodewidth - arroww, massy + massh / 2 - arrowh);
		p.line(margin, arroww, margin, 2 * (massy + massh / 2));
		p.triangle(margin , 0, margin + arrowh, arroww, margin - arrowh, arroww);
		for(let i = 0; i < 10; i++){
			p.line(margin + (Math.log10(i) + 1)/2*(bodewidth - margin), massy + massh / 2 - arrowh / 2,
				margin + (Math.log10(i) + 1)/2*(bodewidth - margin), massy + massh / 2 + arrowh / 2);
			p.line(margin + (Math.log10(i*0.1) + 1)/2*(bodewidth - margin), massy + massh / 2 - arrowh / 2,
				margin + (Math.log10(i*0.1) + 1)/2*(bodewidth - margin), massy + massh / 2 + arrowh / 2);
		}
		const diff = 0.01;
		let f = model.getData('f'),
			k = model.getData('k'),
			wc = model.getData('w'),
			wn = Math.sqrt(model.getData('k')/model.getData('m')),
			zeta = model.getData('b')/(2*Math.sqrt(model.getData('k')*model.getData('m'))),
			rc = wc / wn;
		p.stroke(255, 0, 0).strokeWeight(2);
		p.line(margin + (Math.log10(wc) + 1)/2*(bodewidth - margin), massy + massh / 2,
				margin + (Math.log10(wc) + 1)/2*(bodewidth - margin),
				massy + massh / 2 + (mmtopx*f/k*1/(Math.sqrt((1-rc*rc)*(1-rc*rc)+(2*zeta*rc)*(2*zeta*rc)))));
		p.stroke(0, 0, 0).strokeWeight(1);
		for(let wlog = -1; wlog <= 1; wlog += diff){
			let r = Math.pow(10, wlog) / wn, r2 = Math.pow(10, wlog + diff);
			p.stroke(0,0,128);
			p.line(margin + (wlog + 1)/2*(bodewidth - margin),
				massy + massh / 2 + (mmtopx*f/k*1/(Math.sqrt((1-r*r)*(1-r*r)+(2*zeta*r)*(2*zeta*r)))),
				margin + (wlog + diff + 1)/2*(bodewidth - margin),
				massy + massh / 2 + (mmtopx*f/k*1/(Math.sqrt((1-r2*r2)*(1-r2*r2)+(2*zeta*r2)*(2*zeta*r2))))
				);
			p.stroke(0, 0, 0);				
		}
	}
}

var p0 = new p5(bode);

var sketch2 = function (p) {

	p.setup = function () {
		p.select('#container').child(p.createCanvas(massw+1, massy * 2).id('canvas2').style('left', massx + 'px'));
		p.smooth();
		p.frameRate(fps);
	};

	p.draw = function () {
		dt = faster*(now() - previoustime) || 0.00001; // In case of dt = 0
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

