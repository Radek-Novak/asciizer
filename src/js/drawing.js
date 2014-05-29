function Drawing (sel, paramChar) {
	"use strict";

	var $drawing = $(sel).find('pre'),

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

	this.attachHandles = function () {
		mouseMoveHandle = null;
		mouseDownHandle = null;
		mouseClickHandle = null;
		mouseMoveHandle = $drawing.mousemove(drawChar(this, char));
		mouseDownHandle = $drawing.mouseover(drawChar(this, char));
		mouseClickHandle = $drawing.click(drawChar(this, char, true));
	};

	this.changeChar = function (c) {
		char = c;
		this.attachHandles();
	};

	// init 
	this.changeChar(paramChar);

}

var mouseDown = false,
	docbody = document.body;

docbody.onmousedown = function() { 
  mouseDown = true;
};

docbody.onmouseup = docbody.onmouseleave =function() {
  mouseDown = false;
};


drawing = new Drawing('.box__subbox--drawing', '*');
