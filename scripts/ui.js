$('header input.preview').on("click", function () {
	if (!$(this).is(':checked')) {
		$('canvas').hide();
	} else {
		$('canvas').show();
	}
});