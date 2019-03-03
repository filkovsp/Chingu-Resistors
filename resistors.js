/*
Color Dictionaries:
*/
const colorTable = {
	"0" : "black",
	"1" : "brown",
	"2" : "red",
	"3" : "orange",
	"4" : "yellow",
	"5" : "green",
	"6" : "Blue",
	"7" : "violet",
	"8" : "grey",
	"9" : "White"
};

const toleranceTable = {
	"0" : {"tolerance" : "20",   "background-color" : "transparent"	},
	"1" : {"tolerance" : "10",   "background-color" : "pink"  		},
	"2" : {"tolerance" : "5", 	 "background-color" : "gold"  		},
	"3" : {"tolerance" : "2", 	 "background-color" : "red"   		},
	"4" : {"tolerance" : "1", 	 "background-color" : "brown" 		},
	"5" : {"tolerance" : "0.5",  "background-color" : "green" 		},
	"6" : {"tolerance" : "0.25", "background-color" : "blue"  		},
	"7" : {"tolerance" : "0.1",  "background-color" : "violet"		}
};


// this solution comes from https://developer.mozilla.org/en-US/docs/Web/Events/change
document.addEventListener('DOMContentLoaded', function() {

	var oldValue = null;
	var msg = null;
	resetResitor();

	/*
		when we got focus on our input field, we want to save its current value
		into a variable, so that we know if it changed when we fall back into
		"onkeypress" or "onblur" event handler.
	*/
	document.querySelector('input[name="nominal"]').onfocus = function() {
		oldValue = event.target.value;
	}
	
	/*
		we want to check the validity of the input while user is typing it
		however, if we use input[type="number"], we don't really need 
		this event handler. As this is done by the system then.
	*/
	// document.querySelector('input[name="nominal"]').oninput = function() {
	//     if (oldValue != event.target.value) {
	//         checkInput(event.target.value);
	//     }
	// };
	
	/* 
		we are going to check if "Enter" key pressed. If yes, 
		then we release focuse from input[name="nominal" element
		automatically its "onblur" event will fire up and we'll intersect with it 
		in the next event handler below.
	*/
	document.querySelector('input[name="nominal"]').onkeypress = function() {
		if (event.charCode == 13) {
			event.target.blur();
			document.querySelector('select[name="multiplier"]').focus();
		} else {
			// console.log(event.charCode);
		}
	};

	/*
		When we release input[name="nominal" we want to check if any changes to 
		its valuue have been introduced, if yes - then will process them further 
		in "calc" function.
	*/
	document.querySelector('input[name="nominal"]').onblur = function() {
		if (oldValue != event.target.value) {
			calc(event.target.value);
		}
	}
	
	/*
		we are not doing to use "onchange" event for now.
	*/
	// document.querySelector('input[name="nominal"]').onchange = calc;

	/*
		we process changes in selectors "multiplier" & "tolerance":
	*/
	document.querySelector('select[name="multiplier"]').onchange = calc;
	document.querySelector('select[name="tolerance"]').onchange = calc;                
	// more about events here: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement

}, false); // end of addEventListener()

/*
	check and validate the numerical value entered from use:
*/
function checkInput(value) {
	// isNaN = "is Not as Number" returns TRUE is value is NOT a NUMBER...
	if (!isNaN(value)) {
		if (parseFloat(value) >=0 ) {
			return true;
		} else {
			msg = "Hey! this is not a valid number!!!"
			// console.log(msg);
			document.getElementById("error").innerHTML = msg
			resetResitor();
			return false;
		}
	} else {
		msg = "Hey! this is not a number!!!"
		// console.log(msg);
		document.getElementById("error").innerHTML = msg
		resetResitor();
		return false;
	}
}

/*
	calc() resposible for determining band variables out of the entered values 
	into numeric input field and selectors. whatever user entered we transform into 4 numbers and
	then lookup them in color dictionaries for the corresponding color.
*/
function calc(event) {
	// for more info about event.<x> see this link:
	// https://www.w3schools.com/jsref/obj_inputevent.asp
	
	// console.log("something has changed in " + event.target.name);
	// console.log("inputType: " + event.inputType + ", data: " + event.data);
	
	// other useful properties of the "target":
	// event.type: { "input" for "text" , "change" for "select-one" }
	// event.target.value: value for the current event.target which has just been changed
	// event.target.type: { text, select-one }
	// event.target.name: {nominal, multiplier, tolerance}
	
	// reset our error message if any:
	document.getElementById("error").innerHTML = "";

	// we are trying to draw the resistor if Nominal value eneted, or 
	// one other selectors changed: "multiplier" or "tolerance":
	
	// we need to check if NUMBER has been entered as Nominal value:
	var value = document.querySelector('input[name="nominal"]').value;
	if (checkInput(value) & value != "") {
		jsonValue = "{" + 
			"\"nominal\":\""    + document.querySelector('input[name="nominal"]').value     + "\"" + "," +
			"\"multiplier\":\"" + document.querySelector('select[name="multiplier"]').value + "\"" + "," +
			"\"tolerance\":\""  + document.querySelector('select[name="tolerance"]').value  + "\"" +
		"}";

		drawResistor(jsonValue);
	}
}

function resetResitor() {
	document.getElementById("band1").style.backgroundColor = "transparent";
	document.getElementById("band2").style.backgroundColor = "transparent";
	document.getElementById("band3").style.backgroundColor = "transparent";
	document.getElementById("band4").style.backgroundColor = "transparent";
}

function drawResistor(value) {
	// we might want to check if we did received JSON str.
	// this is how we do it: https://stackoverflow.com/questions/9804777/how-to-test-if-a-string-is-json-or-not
	try {
		var str = JSON.parse(value);
		console.log(str);

		/*
			we transform walue to make it looking like:
			xx * 10^y 
			where resistance is > tham 10 Ohm
		*/
		var val = str.nominal * str.multiplier;

		if (val < 10 ) {    
			band1 = 0;
			band2 = str.nominal;
			band3 = str.multiplier;
			
		} else {
			val = Math.round(
					val / Math.pow(10, ((val + "").length - 2))
				) * Math.pow(10, ((val + "").length - 2));
			
			band1 = val.toString()[0];
			band2 = val.toString()[1];
			band3 = (val + "").length - 2
		}
		
		band4 = str.tolerance;
		
		document.getElementById("band1").style.backgroundColor = colorTable[band1];
		document.getElementById("band2").style.backgroundColor = colorTable[band2];
		document.getElementById("band3").style.backgroundColor = colorTable[band3];
		document.getElementById("band4").style.backgroundColor = toleranceTable[band4]["background-color"];

	} catch (e) {
		console.log(value);
		console.log("ERROR: this is not a valid JSON string! \nException Log: " + e);
	}
	
}