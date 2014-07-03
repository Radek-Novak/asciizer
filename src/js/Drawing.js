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
