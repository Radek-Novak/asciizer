function Drawing (sel, paramChar) {
	"use strict";

	var $drawing = $(sel).find('pre'),
		
		docbody = $(sel),
		mouseDown = false,
		mouseMoveHandle, 
		mouseDownHandle,
		mouseClickHandle,

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

		$drawing.text( new Array(w + 1).join(' '));
	};

	this.attachHandles = function () {
		mouseMoveHandle = null;
		mouseDownHandle = null;
		mouseClickHandle = null;
		mouseMoveHandle = $drawing.mousemove(drawChar(this, char));
		mouseDownHandle = $drawing.mouseover(drawChar(this, char));
		mouseClickHandle = $drawing.click(drawChar(this, char, true));
	};

	this.changeChar = function (c) {
		char = c || ' ';
		this.attachHandles();
	};

	// init 
	this.changeChar(paramChar);

	docbody.mouseup(function () {
		mouseDown = false;
	});
	docbody.mouseleave(function () {
		mouseDown = false;
	});
	docbody.mousedown(function () {
		mouseDown = true;
	});
}


drawing = new Drawing('.box__subbox--drawing');
