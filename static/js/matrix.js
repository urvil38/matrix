let streams = [];
let symbolSize = 15;
let r, g, b, l

function luminance(r, g, b) {
	return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function setup() {
	let x = 0;
	let y = random(-1000, 0);
	r = random(0,255)
	g = random(0,255)
	b = random(0,255)
	l = Math.round(luminance(r, g, b))
	if (l < 128) {
		background(255, 255, 255);
	} else {
		background(0);
	}

	createCanvas(window.innerWidth, window.innerHeight);
	textSize(symbolSize);
	for (let i = 0; i <= width / symbolSize; i++) {
		let stream = new Stream();
		streams.push(stream);
		stream.generateSymbol(x, y);
		x += symbolSize;
	}
}

function draw() {
	if (l < 128) {
		background(255, 255, 255);
	} else {
		background(0);
	}
	streams.forEach(function (stream) {
		stream.render(r, g, b);
	});
}

function Symbol(x, y, speed, first) {
	this.x = x;
	this.y = y;
	this.value;
	this.speed = speed;
	this.setInterval = round(random(2, 100));
	this.first = first;

	this.setToRandomSymbol = function () {
		if (frameCount % this.setInterval == 0) {
			this.value = String.fromCharCode(0x30A0 + random(0, 96));
		}
	}

	this.rain = function () {
		this.y = (this.y >= height) ? 0 : this.y += this.speed;
	}
}

function Stream() {
	this.symbols = [];
	this.totalSymbols = round(random(5, 20));
	this.speed = random(2, 14);

	this.generateSymbol = function (x, y) {

		let first = round(random(0, 4)) == 1;
		for (let i = 0; i <= this.totalSymbols; i++) {
			symbol = new Symbol(x, y, this.speed, first);
			symbol.setToRandomSymbol();
			this.symbols.push(symbol);
			y -= symbolSize;
			first = false;
		}
	}

	this.render = function (r, g, b) {
		this.symbols.forEach(function (symbol) {
			if (symbol.first) {
				fill(255, 0, 10);
			} else {
				fill(r, g, b);
			}
			text(symbol.value, symbol.x, symbol.y);
			symbol.rain();
			symbol.setToRandomSymbol();
		});
	}
}