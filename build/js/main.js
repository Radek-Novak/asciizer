/**
 * Asciizer object
 * @constructor
 * @param {Image} imgObj -  Image to be converted
 * @param {Number} gridWidth - Width of the resulting grid in chars
 */
function Asciizer(imgObj, gridWidth) {
    "use strict";

    this.canvas = $('<canvas></canvas>')
                    .appendTo('body')
                    .attr('id','atelier' + new Date().getTime())
                    .hide()[0];

    this.chars = " .-:*+=%#@".split("").reverse().join("");
    this.context = this.canvas.getContext('2d');
    this.image = imgObj;
    this.grid_w = gridWidth;
    this.grid_h = null;
    this.valueArray = [];
    this.pixelLightness = [];
    this.charValues = [];
    this.analysis = {
        min: Infinity,
        max: 0,
        sum: 0,
        range: null,
        avg: null
    };
    this.chargrid = [];

    this.lines = [];

    // initialization 
    if (imgObj) {
        this.loadImage(imgObj);
    }
    if (gridWidth) {
        this.setCanvasSize(gridWidth);
    }
}
Asciizer.prototype.loadImage = function (i) {
    "use strict";
    this.image = i || imgObj;
};

Asciizer.prototype.setCanvasSize = function (w, h) {
    "use strict";
    var ratio = this.image.width / w;
    
    this.grid_w = w || gridWidth;
    this.grid_h = h || (this.image.height / ratio);

    this.canvas.width = this.grid_w;
    this.canvas.height = this.grid_h;
};

Asciizer.prototype.draw = function (image2draw) {
    "use strict";
    image2draw = image2draw || this.image;
    this.context.drawImage(image2draw, 0, 0, this.canvas.width, this.canvas.height);
};

Asciizer.prototype.readCanvas = function () {
    "use strict";
    this.valueArray = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
};


/**
 * From 4 values (RGBA) calculates lightness of a pixel
 * changes this.pixelLightness
 */
Asciizer.prototype.calculatePixels = function () {
    "use strict";
    for (var i = 0, ii = this.valueArray.length/4; i < ii; i++) {
        var va = this.valueArray;
        this.pixelLightness.push(
            (
                va[4*i] + va[4*i + 1] + va[4*i + 2]) * 
                (256 / (va[4*i+3] + 1)
            )
        );
    }
};


/**
 * Averages 2 pixels for each char.
 * changes this.charValues
 */
 Asciizer.prototype.calculateCharValues = function () {
    "use strict";
    var pixl = this.pixelLightness;
    for (var i = 0, ii = pixl.length; i < ii; i++) {
        if ( (i / this.grid_w) % 2 === 0 ) {
            i += this.grid_w - 1;
            continue;
        }
        if ( i + this.grid_w < pixl.length) {
            this.charValues.push((pixl[i] + pixl[i + this.grid_w])/2);
        } else {
            this.charValues.push(pixl[i]);
        }
    }
};


/**
 * Calculates min, max, sum, range, avg
 * changes this.analysis
 */
Asciizer.prototype.analyze = function () {
    "use strict";
    var charVals = this.charValues,
        an = this.analysis;

    for (var i = 0, ii = charVals.length; i < ii; i++) {
        var cur = charVals[i];
        an.min = cur < an.min ? cur : an.min;
        an.max = cur > an.max ? cur : an.max;
        an.sum += cur;
    }

    an.avg = an.sum / this.charValues.length;
    an.range = an.max - an.min;
};


/**
 * Selects char for each number
 * @param {string} charset - Characters to be used in resulting image
 * changes this.chargrid
 */
Asciizer.prototype.calcChars = function (charset) {
    "use strict";
    var chargrid = this.chargrid,
        charvals = this.charValues,
        thisCharset = charset || this.chars,
        len = thisCharset.length, 
        step = this.analysis.range / (len-1);

    for (var i = 0, ii = charvals.length; i < ii; i++) {
        var cur = charvals[i],
            index = ~~((cur-this.analysis.min)/step);

        chargrid.push(thisCharset[index]);

    }
};


/**
 * Splits the 1D array of characters into a 2D array
 * changes this.lines
 */
Asciizer.prototype.splitIntoLines = function () {
    "use strict";
    var chargrid = this.chargrid,
        gw = this.grid_w,
        lines = this.lines;
 
    for ( var i = 0, ii = chargrid.length; i < ii; i += gw ) {
        lines.push(chargrid.slice(i,i+gw));
    }
};


/**
 * Returns final result with linebreaks
 * 
 * @returns content
 */
Asciizer.prototype.result = function () {
    "use strict";
    var chargrid = this.chargrid,
        gw = this.grid_w,
        content = '';
 
    for ( var i = 0, ii = chargrid.length; i < ii; i += gw ) {
        content += chargrid.slice(i,i+gw).join('') + '\n';
    }

    return content;
};


/**
 * Logs and returns final result with linebreaks
 * 
 * @returns content
 */
Asciizer.prototype.log = function () {
    "use strict";

    console.log(this.result());
};


/**
 * Runs all methods and returns converted image
 * 
 * @returns content
 */
Asciizer.prototype.start = function () {
    //this.loadImage();
    //this.setCanvasSize();
    this.draw();
    this.readCanvas();
    this.calculatePixels();
    this.calculateCharValues();
    this.analyze();
    this.calcChars();
    this.splitIntoLines();

    return this.result();
};
function Drawing (sel, paramChar) {
	"use strict";

	var $thisEl = $(sel),
		$drawing = $thisEl.find('pre'),
		
		mouseDown = false,
		mouseMoveHandle, 
		mouseDownHandle,
		mouseClickHandle,

		curH,
		curW,

		char,

		drawChar = 
			function drawChar ($this, chr, mouseDownCond) {
				return function () {
					if (mouseDownCond || mouseDown) {
						var $this = $(this),
							parentOffset = $this.parent().offset(),
				        	relativeXPosition = (event.pageX - parentOffset.left),
							charIndex = Math.floor((relativeXPosition / 8)),
							charLine = $this.text(),
							charContent = charLine[charIndex],
							newCharLine = charLine.substring(0, charIndex-1) + chr + charLine.substring(charIndex);

						$this.html(newCharLine);
					}
				};
			};
			
	this.clear = function () {
		var w = $drawing.html().length;
		$drawing = $thisEl.find('pre');
		$drawing.text( new Array(w + 1).join(' '));
	};
	
	this.refreshWidth = function () {
		curW = $thisEl.find('pre:nth-child(1)').text().length;
	};

	this.refreshHeight = function () {
		curH = $thisEl.find('pre').length;
	};
	this.getHeight = function () {
		this.refreshHeight();
		return curH;
	};
	this.getWidth = function () {
		this.refreshWidth();
		return curW;
	};
	this.refresh = function () {
		this.refreshWidth();
		this.refreshHeight();
		$drawing = $thisEl.find('pre');
	};
	this.changeHeight = function (newH) {
		var	diff, 
			pre; 

		this.refreshWidth();
		this.refreshHeight();

		if (curH === newH) { // TODO
			// do nothing
		} else if (curH > newH) {
			$thisEl.find('pre').slice(newH).remove();

		} else {
			pre = '<pre>'+ new Array(curW + 1).join(' ') + '</pre>';
			diff = newH - curH;
			var toAppend = new Array(diff + 1).join(pre);

			$thisEl.append(toAppend);
		}
	};
	this.addWidth = function () {
		this.refresh();
		for (var i = 0, ii = curH; i < ii; i++) {
			$($drawing[i]).text($($drawing[i]).text() + ' ');
		}
	};
	this.reduceWidth = function () {
		this.refresh();
		$drawing.each(function () {
			var $cur = $(this);
			$cur.text($cur.text().substr(0,curW-1));
		});
	};
	this.addHeight = function () {
		this.refresh();
		$thisEl.append($('<pre>'+ new Array(curW + 1).join(' ') + '</pre>'));
		this.attachHandles();
	};
	this.reduceHeight = function () {
		this.refresh();
		$drawing.last().remove();
	};
	this.insert = function (ins) {
		$drawing.remove();

		for (var i = 0, ii = ins.length; i < ii; i++) {
			$thisEl.append('<pre>' + ins[i] + '</pre>');
		}
	};
	this.attachHandles = function () {
		$drawing = $thisEl.find('pre');
		mouseMoveHandle = null;
		mouseDownHandle = null;
		mouseClickHandle = null;
		mouseMoveHandle = $drawing.mousemove(drawChar(this, char));
		mouseDownHandle = $drawing.mouseover(drawChar(this, char));
		mouseClickHandle = $drawing.click(drawChar(this, char, true));
	};

	this.changeChar = function (c) {
		char = c || '*';
		this.attachHandles();
	};

	// init 
	this.changeChar(paramChar);

	$thisEl.mouseup(function () {
		mouseDown = false;
	});
	$thisEl.mouseleave(function () {
		mouseDown = false;
	});
	$thisEl.mousedown(function () {
		mouseDown = true;
	});
}


drawing = new Drawing('.box__subbox--drawing');

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
var DropHandler = {
	$dropzone: null,
	$dropMessage: null,
	$dropBox: null,
	dropped: false,

	init: function () {
		this.$dropzone = $('.box__subbox--drawing');

		this.$dropzone.on('dragenter', this.dragenter.bind(this));
		this.$dropzone.on('dragover', this.dragover.bind(this));
		this.$dropzone.on('drop', this.drop.bind(this));
		this.$dropzone.on('dragleave', this.dragleave.bind(this));
	},

	dragenter: function (e) {
		e.stopPropagation();
		e.preventDefault();
	},
	dragover: function (e) {
		e.stopPropagation();
		e.preventDefault();
		this.$dropzone.css({'opacity': 0.1});
	},
	dragleave: function (e) {
		e.stopPropagation();
		e.preventDefault();

		this.$dropzone.css({'opacity': 1});
	},
	drop: function (e) {
		var dt = e.originalEvent.dataTransfer,
			files = dt.files;
			
		e.stopPropagation();
		e.preventDefault();

		this.dropped = true;

		this.ondrop(files);
		this.$dropzone.css({'opacity': 1});
	},
	ondrop: function (files) {
		handleFiles(files);
	}
};

function handleFiles(files) {
	var file = files[0],
		reader = new FileReader();

	reader.onload = function(e) {

		var imgObj = new Image();

		imgObj.onload = function() {

			last = new Asciizer(this, getGridWidth());
			var asciized = last.start();
			
			//console.log(last);

			drawing.insert(asciized.split('\n'));
			drawing.attachHandles();
		};

		imgObj.src = reader.result;
		imgObj.alt = "current picture";
		//$('.original-image').empty().append(imgObj);
	};

	reader.readAsDataURL(file);
}

DropHandler.init();

var last;
var char_size = {
    w: 8,
    h: 16
};

$('.js-preview-toggle').on("click", function() {
    var orig = $('.box__subbox--original'),
        drawing = $('.box__subbox--drawing'),
        label = $('[for="preview"]');

    drawing.fadeToggle(0);
    orig.fadeToggle(0);
});

function getGridWidth() {
    return $('pre')[0].innerText.length;
}

$('.recalc').click(function() {
    last.calculate(getGridWidth());
});

$('.js-drawing-clear').click(drawing.clear);

$('.palette li').click(function (event) {
    var $this = $(this),
        coordX = event.pageX - $this.parent().offset().left,
        charIndex = Math.floor((coordX / 8));

    $this
        .siblings('li')
            .removeClass('active')
            .end()
        .addClass('active');

    drawing.changeChar($this.text());
});

$('.plus, .minus').click(function() {
    var $this = $(this),
        plus = $this.hasClass('plus'),
        $indicator = $this.siblings('.indicator'),
        value = parseInt($indicator.text(), 10),
        chWidth = $this.parent().hasClass('controls__resize__width');

    if (chWidth) {
        if (plus) {
            drawing.addWidth();
        } else if (value > 1 && !plus) {
            drawing.reduceWidth();
        }
        $indicator.text(drawing.getWidth());
    } else {
        if (plus) {
            drawing.addHeight();
        } else if (value > 1 && !plus) {
            drawing.reduceHeight();
        }
        $indicator.text(drawing.getHeight());
    }
});

// jQuery ui initializations
$(".draggable").draggable({
    grid: [char_size.w, char_size.h],
    containment: "parent",
    cancel: '.box__subbox--drawing, .controls',
    stack: ".draggable"
});

$('.js-controls-tabs').tabs();
