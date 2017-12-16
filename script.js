window.onload = function(){
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    let start = Date.now();
    document.getElementById("value").onkeyup = function(event) {
        let fieldContents = parseInt(valueElement.value);
        if (fieldContents >= 0 && fieldContents < 256) {
	    newRule = true;
	    number = fieldContents;
        }
    };
    var valueElement = document.getElementById("value");

    valueElement.focus();
    
    drawRule(129, ctx);
    var ctx2 = document.getElementById("canvas2").getContext("2d");
    drawReversibleRule(41, ctx2);
};
var drawRule = function(value, ctx){
    let pseudoImageArray = [];
    let start = Date.now();
    for (let i = 0; i < 200; i++) {
	pseudoImageArray.push(0);
    }
    pseudoImageArray[100] = 1; // 1 is black

    let rule = [0, 0, 0, 0, 0, 0, 0, 0];
    let mask = 1;
    for (let i = 0; i < 8; i++) {
	rule[i] = ((value & mask) != 0) ? 1 : 0;
	mask = mask << 1;
    }
    let pixelWhite = "rgba(255,255,255,1.0)";
    let pixelBlack = "rgba(0,0,0,1.0)";
    for (let y = 100; y < 200; y++) {
	let left = 0;
	let center = 0;
	let right = 0;
	for (let x = 0; x < 200; x++) {
	    if (y == 100) {
		if (pseudoImageArray[x] == 1) {
		    ctx.fillStyle = pixelBlack;
		} else {
		    ctx.fillStyle = pixelWhite;
		}
	    } else {
		if (x == 0) {
		    left = 0;
		    center = pseudoImageArray[x];
		    right = pseudoImageArray[x+1];
		} else if (x < pseudoImageArray.length - 2) {
		    left = center;
		    center = right;
		    right = pseudoImageArray[x+1];
		} else {
		    left = center;
		    center = right;
		    right = 0;
		}
		if (fa(left, center, right, rule) == 1) {
		    ctx.fillStyle = pixelBlack;
		    pseudoImageArray[x] = 1;
		} else {
		    ctx.fillStyle = pixelWhite;
		    pseudoImageArray[x] = 0;
		}
	    }
	    ctx.fillRect(x, y, 1, 1);
	}
    }
    let stop = Date.now();
    console.log("time: " + (stop - start));
};

var drawReversibleRule = function(value, ctx){
    let pseudoImageArray = [];
    let start = Date.now();
    let columns = [];
    for (let i = 0; i < 200; i++) {
	columns.push(0);
    }
    pseudoImageArray.push(columns);
    pseudoImageArray.push(columns);
    //pseudoImageArray[0][100] = 1; // 1 is black
    pseudoImageArray[1][100] = 1; // 1 is black

    let rule = [0, 0, 0, 0, 0, 0, 0, 0];
    let mask = 1;
    for (let i = 0; i < 8; i++) {
	rule[i] = ((value & mask) != 0) ? 1 : 0;
	mask = mask << 1;
    }
    let pixelWhite = "rgba(255,255,255,1.0)";
    let pixelBlack = "rgba(0,0,0,1.0)";
    for (let y = 100; y < 200; y++) {
	let left = 0;
	let center = 0;
	let right = 0;
	for (let x = 0; x < 200; x++) {
	    
	    if (y == 100) {
		if (pseudoImageArray[1][x] == 1) {
		    ctx.fillStyle = pixelBlack;
		} else {
		    ctx.fillStyle = pixelWhite;
		}
		pseudoImageArray[0][x] = pseudoImageArray[1][x];
	    } else { // not first row
		if (x == 0) {
		    left = 0;
		    center = pseudoImageArray[1][x];
		    right = pseudoImageArray[1][x+1];
		} else if (x < (pseudoImageArray[0].length - 2)) {
		    left = center;
		    center = right;
		    right = pseudoImageArray[1][x+1];
		} else {
		    left = center;
		    center = right;
		    right = 0;
		}
		if (pseudoImageArray[0][x] == 1) { // if black, flip
		    if (fa(left, center, right, rule) == 0) {
		        ctx.fillStyle = pixelBlack;
	                pseudoImageArray[1][x] = 1;
		        pseudoImageArray[0][x] = 1;
  	            } else {
		        ctx.fillStyle = pixelWhite;
		        pseudoImageArray[1][x] = 0;
		        pseudoImageArray[0][x] = 0;
		    }
		} else { // if white, don't flip
		    if (fa(left, center, right, rule) == 1) {
		        ctx.fillStyle = pixelBlack;
		        pseudoImageArray[1][x] = 1;
		        pseudoImageArray[0][x] = 1;
		    } else {
		        ctx.fillStyle = pixelWhite;
		        pseudoImageArray[1][x] = 0;
		        pseudoImageArray[0][x] = 0;
		    }
		}
	    }
	    ctx.fillRect(x, y, 1, 1);
	}
    }
    let stop = Date.now();
    console.log("time: " + (stop - start));
};

var newRule = false;
var number = 129;

var fa = function(left, center, right, rule) {
    return rule[(left<<2) + (center<<1) + right];
};

setInterval(function() {
    if (newRule) {
        var ctx = document.getElementById("canvas").getContext("2d");
        var ctx2 = document.getElementById("canvas2").getContext("2d");
        let start = Date.now();
	drawRule(number, ctx);
	drawReversibleRule(number, ctx2);
	newRule = false;
    }
}, 3000);
