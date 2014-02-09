$('header input.preview').on("click", function () {
	if (!$(this).is(':checked')) {
		$('canvas').hide(200);
	} else {
		$('canvas').show(300);
	}
});