var streams = [];
var symbolSize = 15;

function setup(){
	var x = 0;
	var y = random(-1000,0);
	createCanvas(window.innerWidth,window.innerHeight);
	background(255,255,255);
	textSize(symbolSize);
	for(var i=0;i<= width/symbolSize;i++){
		var stream = new Stream();
		streams.push(stream);
		stream.generateSymbol(x,y);
		x += symbolSize;		
	}
}

function draw(){
	background(0);
	streams.forEach(function(stream){
		stream.render();
	});
}

function Symbol(x,y,speed,first){
	this.x = x;
	this.y = y;
	this.value;
	this.speed = speed;
	this.setInterval = round(random(2,100));
	this.first = first;

	this.setToRandomSymbol = function(){
		if(frameCount % this.setInterval == 0){
			this.value = String.fromCharCode(0x30A0 + random(0,96));
		}
	}

	this.rain = function(){
		this.y = (this.y >= height) ? 0 : this.y += this.speed;
	}
}

function Stream(){
	this.symbols = [];
	this.totalSymbols = round(random(5,20));
	this.speed = random(2,14);

	this.generateSymbol = function(x,y){

		var first = round(random(0,4)) == 1;
		for(var i=0;i<=this.totalSymbols;i++){
			symbol = new Symbol(x,y,this.speed,first);
			symbol.setToRandomSymbol();
			this.symbols.push(symbol);
			y -= symbolSize;
			first = false;
		}
	}

	this.render = function(){
		this.symbols.forEach(function(symbol){
			if(symbol.first){
				fill(255,0,0);
			}else{
				fill(255,0,10);
			}
			text(symbol.value,symbol.x,symbol.y);
			symbol.rain();
			symbol.setToRandomSymbol();
		});
	}
}