var DropHandler = {
	dropzone: null,
	dropped: false,

	init: function () {
		var that = this;
		this.dropzone = document.getElementById("dropzone");

		this.dropzone.addEventListener('dragenter', function(e) {that.dragenter(e);}, false);
		//this.dropzone.addEventListener('dragover', function(e) {that.dragover(e);}, false);

		this.dragover = this.dragover.bind(this);
		this.dropzone.addEventListener('dragover', this.dragover, false);

		(function (self) {
			self.dropzone.addEventListener('drop', function(e) {self.drop(e);}, false);
		})(this);

		(function (self) {
			self.dropzone.addEventListener('dragleave', function(e) {self.dragleave(e);}, false);
		})(this);

	},

	dragenter: function (e) {
		e.stopPropagation();
		e.preventDefault();
		//console.log(this);
		this.dropzone.style.opacity = 0.5;
	},
	dragover: function (e) {
		e.stopPropagation();
		e.preventDefault();
		this.dropzone.style.opacity = 0.5;
	},
	dragleave: function (e) {
		e.stopPropagation();
		e.preventDefault();
		this.dropzone.style.opacity = this.dropped ? 0 : 1;
	},
	drop: function (e) {
		e.stopPropagation();
		e.preventDefault();
		var dt = e.dataTransfer;
		var files = dt.files;
		this.dropped = true;
		this.dropzone.style.opacity = 0;

		this.ondrop(files);
	},
	ondrop: function (files) {
		handleFiles(files);
	}
};

var canvas = document.getElementsByTagName('canvas')[0],
	//canvas2 = document.getElementById('canvas2'),
	context = canvas.getContext('2d'),
	//context2 = canvas2.getContext('2d'),
	reader;

function handleFiles(files) {
	var file = files[0];

	reader = new FileReader();

	reader.onload = function(e) {

		var imgObj = new Image();

		imgObj.onload = function() {
			//console.log(imgObj.width,imgObj.height);
			context.drawImage(this, 0, 0, this.width, this.height, 0, 0, canvas.width, canvas.height);

			getValues(); analyze(); printValues(); //paintGrid(context);
		};

		imgObj.src = reader.result;
	};

	reader.readAsDataURL(file);
}

DropHandler.init();
var cw = canvas.width,
	ch = canvas.height,
	charw = 3,
	charh = 5,
	gridWidth = cw / charw,
	gridHeight = ch / charh,
	valueArray = [],
	min = Infinity,
	max = 0,
	sum = 0,
	range = null,
	step = null,
	chars = " .:-=+*#%@".split("").reverse().join("");

function sum_4 (arr) {
	var sum = 0,
		arl = arr.length/*,
		alpha_values = (arl / 4) * 255*/;

	for (var i = 0; i < arl; i += 4 ) {
		sum += arr[i];
		sum += arr[i + 1];
		sum += arr[i + 2];
	}

	return sum/* - alpha_values*/;
}
function analyze () {

	for (var i = 0, mx = valueArray.length; i < mx; i++) {
		for (var j = 0, mxj = valueArray[0].length; j < mxj; j++) {
			try {
				var cur = valueArray[i][j];
				
				if ( cur > max ) {
					max = cur;
				} else if ( cur < min ) {
					min = cur;
				}
			} catch (e) {
				console.log(i,j,e);
			}
		}
	}

	range = max - min;
	step = (range - min) / chars.length;
}

function getRectangle (coords) {
	//console.log(coords);
	return context.getImageData(coords[0], coords[1], charw, charh).data;
}

function putRectangle (ctx, data, coords) {
	ctx.putImageData(data, coords[0], coords[1]);
}

function getValues () {
	valueArray = [];

	for (var i = 0; i < gridHeight; i++) {
		var line = [];
	
		for (var j = 0; j < gridWidth; j++) {
			var coords = [j * charw, i * charh];

			line.push(sum_4(getRectangle(coords)));

		}
		//console.log(line);
		valueArray.push(line);
	}
}

function printValues() {
	var text = '';

	document.getElementById('out').innerHTML = text;

	for ( var i = 0; i < gridHeight; i++ ) {
		for ( var j = 0; j < gridWidth; j++ ) {
			try {
				//var c = valueArray[i][j] >= 500000 ? 'o' : '.';
				var charNumber = Math.floor(valueArray[i][j] / step),
					c = 'x';

				if (charNumber >= chars.length) {
					charNumber = chars.length - 1;
				} else if ( charNumber < 0 ) {
					charNumber = 0;
				}

				c = chars[ charNumber ];

				if (c === undefined) {
					console.log(valueArray[i][j], valueArray[i][j] / step);
				}

				text +=  c;

			} catch (e) {
				console.log(e);
			}
		}
		text += "<br>";
	}

	document.getElementById('out').innerHTML = text;
}

function paintGrid(ctx) {
	for ( var i = 0; i < gridHeight; i++ ) {
		for ( var j = 0; j < gridWidth; j++ ) {
			context.strokeStyle = "rgb(20, 220,100)";
			context.strokeRect(j*charw,i*charh,charw, charh);
		}
	}
}

$('header input.preview').on("click", function () {
	if (!$(this).is(':checked')) {
		$('canvas').hide();
	} else {
		$('canvas').show();
	}
});