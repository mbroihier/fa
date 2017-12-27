window.onload = function(){
    var c = document.getElementById("canvas1");
    var ctx1 = c.getContext("2d");
    let start = Date.now();
    // Install event handler to handle manual rule number changes
    document.getElementById("value").onkeyup = function(event) {
        let fieldContents = parseInt(valueElement.value);
        if (fieldContents >= 0 && fieldContents < 256) {
	    newRule = true;
	    number = fieldContents;
        }
    };
    var valueElement = document.getElementById("value");
    // On load, set focus to rule number field and value to initial value
    valueElement.focus();
    document.getElementById("value").value = number;
    // Draw the first time
    drawRule(number, ctx1);
    var ctx2 = document.getElementById("canvas2").getContext("2d");
    drawReversibleRule(number, ctx2);
};
// Implement a display function to show the first 100 iterations of Wolfram's rule
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
    for (let y = 0; y < 100; y++) {
	let left = 0;
	let center = 0;
	let right = 0;
	for (let x = 0; x < 200; x++) {
	    if (y == 0) {
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

// Implement a display function to show the first 100 iterations of Wolfram's reversible rule
var drawReversibleRule = function(value, ctx){
    let pseudoImageArray = [];
    let start = Date.now();
    for (let j = 0; j < 2; j++) {
      let columns = [];
      for (let i = 0; i < 200; i++) {
	columns.push(0);
      }
      pseudoImageArray.push(columns);
    }
    pseudoImageArray[1][100] = 1; // 1 is black

    let rule = [0, 0, 0, 0, 0, 0, 0, 0];
    let mask = 1;
    for (let i = 0; i < 8; i++) {
	rule[i] = ((value & mask) != 0) ? 1 : 0;
	mask = mask << 1;
    }
    let pixelWhite = "rgba(255,255,255,1.0)";
    let pixelBlack = "rgba(0,0,0,1.0)";
    for (let y = 0; y < 100; y++) {
	let left = 0;
	let center = 0;
	let right = 0; 
	for (let x = 0; x < 200; x++) {
	    
	    if (y == 0) {
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
		        pseudoImageArray[0][x] = center;
  	            } else {
		        ctx.fillStyle = pixelWhite;
		        pseudoImageArray[1][x] = 0;
		        pseudoImageArray[0][x] = center;
		    }
		} else { // if white, don't flip
		    if (fa(left, center, right, rule) == 1) {
		        ctx.fillStyle = pixelBlack;
		        pseudoImageArray[1][x] = 1;
		        pseudoImageArray[0][x] = center;
		    } else {
		        ctx.fillStyle = pixelWhite;
		        pseudoImageArray[1][x] = 0;
		        pseudoImageArray[0][x] = center;
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
var cycleStartInterval = 0;

// Finite Automata function - given rule and current state of a pixel and it's neighbors, calculate the next state
var fa = function(left, center, right, rule) {
    return rule[(left<<2) + (center<<1) + right];
};

// Update the rule number to display all 256 possible rules
setInterval(function() {
    var ctx1 = document.getElementById("canvas1").getContext("2d");
    var ctx2 = document.getElementById("canvas2").getContext("2d");
    let start = Date.now();
    if (newRule) {
	newRule = false;
        cycleStartInterval = 0;
    } else {
	cycleStartInterval++;
	if (cycleStartInterval > 3) {
	    cycleStartInterval = 0;
	    number = (number + 1) % 256;
            document.getElementById("value").value = number;
	}
    }
    drawRule(number, ctx1);
    drawReversibleRule(number, ctx2);
}, 1000);
