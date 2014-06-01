/*test('Get width', function () {
	var drawing = new Drawing('.test-drawing');
	
	$('.test-drawing pre').text('123456789');

	equal(drawing.getWidth(), 9, 'Reported width is 9');
	drawing = null;
});

test('Get height', function () {
	var drawing = new Drawing('.test-drawing'),
		n = 20;

	$('.test-drawing pre').remove();

	while(n--) {
		$('.test-drawing').append('<pre>123456789</pre>');
		
	}

	equal(drawing.getHeight(), 20, 'Reported height is 20');

	drawing = null;
});

test('Resize: new height == current height', function () {
	var drawing = new Drawing('.test-drawing'),
		correctH = $('.test-drawing pre').length;

	drawing.changeHeight(drawing.getHeight());

	equal(drawing.getHeight(), correctH, "Changing height to same value");

	drawing = null;
});*/

test('Resize: new height < current height', function () {
	var drawing = new Drawing('.test-drawing'),
		curH = $('.test-drawing pre').length,
		newH = curH - 13;

	drawing.changeHeight(newH);

	ok(newH < curH, "New height < old height");
	equal($('.test-drawing pre').length, newH, "Current height == new height");

	drawing = null;
});

test('Resize: new height > current height', function () {
	var drawing = new Drawing('.test-drawing'),
		curH = $('.test-drawing pre').length,
		newH = curH + 13;

	drawing.changeHeight(newH);

	ok(newH > curH, "New height < old height");
	equal($('.test-drawing pre').length, newH, "Current height == new height");

	drawing = null;
});

test('Resize: multiple', function () {
	var drawing = new Drawing('.test-drawing'),
		actualH,
		testHeights = [19,18,17,16,3,5,7,7,7,12,11];

	for (var i = 0, ii = testHeights.length; i < ii; i++) {
		drawing.changeHeight(testHeights[i]);
		actualH = $('.test-drawing pre').length;
		equal(actualH, testHeights[i], "Actual:" + actualH + " expected: " +testHeights[i]);
		console.log(actualH);
	}
});