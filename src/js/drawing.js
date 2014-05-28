function Drawing (sel) {
	var $drawing = $(sel),
		mouseMoveHandle;

	function hovChar (c) {
		return '<span class="hovered">' + c + '</span>';
	}
	function drawChar (c) {
		return '<span class="drawn">' + c + '</span>';
	}
	var getPos = function (event) {
		
		var $this = $(this),
			parentOffset = $this.parent().offset(),
        	relativeXPosition = (event.pageX - parentOffset.left),
			charIndex = Math.floor((relativeXPosition / 8)),
			charLine = $this.text(),
			charContent = charLine[charIndex],
			newCharLine = charLine.substring(0, charIndex-1) + '*' + charLine.substring(charIndex);

		$this.html(newCharLine);
	};

	//mouseMoveHandle = $drawing.mousemove(getPos);
	mouseDownHandle = $drawing.mousedown(getPos);
}

drawing = Drawing('pre');
