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

		$drawing.text( new Array(w + 1).join(' '));
	};
	
	this.refreshWidth = function () {
		curW = $thisEl.find('pre:nth-child(1)').text().length;
	};

	this.refreshHeight = function () {
		curH = $thisEl.find('pre').length;
	};

	this.changeHeight = function (newH) {
		var	diff, 
			pre; 

		this.refreshHeight();
		this.refreshWidth();

		if (curH === newH) {
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
