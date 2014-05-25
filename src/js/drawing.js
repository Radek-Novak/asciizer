function Drawing (sel) {
	var $drawing = $(sel),
		mouseMoveHandle;

	var getPos = function (event) {
		
		var pad = {t: 8, l: 7},
			dr_w = $drawing.width(),
			dr_h = $drawing.height(),
			pos = {
				x:	Math.floor((event.pageX - pad.l) / 8),
				y: Math.floor((event.pageY - pad.t) / 16)
			};

		console.log(pos);
		return pos;
	};
	
	mouseMoveHandle = $drawing.mousemove(getPos);

}

drawing = Drawing('pre');