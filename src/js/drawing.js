function Drawing (sel) {
	var $drawing = $(sel),
		mouseMoveHandle;

	var getPos = function (event) {
		
		var $this = $(this),
			//lineIndex =  Math.floor((event.pageX) / 8),
			charIndex = $('.box__subbox--drawing pre').index($this),
			charContent = $this.text()[charIndex];

		console.log(charContent,charIndex);
		//return pos;
	};
	
	mouseMoveHandle = $drawing.mousemove(getPos);

}

drawing = Drawing('pre');
