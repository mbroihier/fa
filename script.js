window.onload = function(){
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    let start = Date.now();
    document.getElementById("value").onkeyup = function(event) {
        let fieldContents = parseInt(valueElement.value);
        if (fieldContents >= 0 && fieldContents < 256) {
	    let mask = 1;
	    for (let i = 0; i < 8; i++) {
		rule[i] = ((fieldContents & mask) != 0) ? 1 : 0;
		mask = mask << 1;
	    }
	    drawRule(fieldContents, ctx);
        }
    };
    var valueElement = document.getElementById("value");
    
    drawRule(129, ctx);
};
var drawRule = function(value, ctx){
    let pseudoImageArray = [];
    let start = Date.now();
    for (let i = 0; i < 200; i++) {
	pseudoImageArray.push(0);
    }
    pseudoImageArray[100] = 1;
    
    let pixelOn = "rgba(255,255,255,1.0)";
    let pixelOff = "rgba(0,0,0,1.0)";
    for (let y = 100; y < 200; y++) {
	let left = 0;
	let center = 0;
	let right = 0;
	for (let x = 0; x < 200; x++) {
	    if (y == 100) {
		if (pseudoImageArray[x] == 1) {
		    ctx.fillStyle = pixelOn;
		} else {
		    ctx.fillStyle = pixelOff;
		}
	    } else {
		if (x == 0) {
		    left = 0;
		    center = pseudoImageArray[x];
		    right = pseudoImageArray[x+1];
		} else if (x < pseudoImageArray.length - 1) {
		    left = center;
		    center = right;
		    right = pseudoImageArray[x+1];
		} else {
		    left = center;
		    center = right;
		    right = 0;
		}   
		if (fa(left, center, right) == 1) {
		    ctx.fillStyle = pixelOn;
		    pseudoImageArray[x] = 1;
		} else {
		    ctx.fillStyle = pixelOff;
		    pseudoImageArray[x] = 0;
		}
	    }
	    ctx.fillRect(x, y, 1, 1);
	}
    }
    let stop = Date.now();
    console.log("time: " + (stop - start));
};

var rule = [ 1, 0, 0, 0, 0, 0, 0, 1];

var fa = function(left, center, right) {
    return rule[(left<<2) + (center<<1) + right];
};


