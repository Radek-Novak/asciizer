function Drawing (sel) {
	var $drawing = $(sel),
		mouseMoveHandle;

	var getPos = function (event) {
		
		var $this = $(this),
			parentOffset = $this.parent().offset(),
        	relativeXPosition = (event.pageX - parentOffset.left),
        	//relativeYPosition = (event.pageY - parentOffset.top),
			//lineNumber = $('.box__subbox--drawing pre').index($this),
			charIndex = Math.floor((relativeXPosition / 8) - 1),
			charLine = $this.text(),
			charContent = charLine[charIndex],
			newCharLine = charLine.substring(0, charIndex - 1) + '<span class="hovered">' + charContent + '</span>' + charLine.substring(charIndex);

		//console.log($this.html());
		//console.log(newCharLine);
		//console.log(newCharLine);
		//console.log($hovered.text(charContent).html());
		//console.log(charContent, relativeXPosition, charIndex);
		//return pos;
		$this.html(newCharLine);
	};

	mouseMoveHandle = $drawing.mousemove(getPos);
}

drawing = Drawing('pre');
