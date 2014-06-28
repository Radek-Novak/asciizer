var el_testImages = document.querySelectorAll('.test-images img'),

    testImages = {
        arrowDown: $('[src$="arrowDown.png"]')[0],
        jupiter:   $('[src$="jupiter.jpg"]')[0],
        n:         $('[src$="n.jpg"]')[0],
        black:     $('[src$="black.jpg"]')[0],
        diag:      $('[src$="diag.jpg"]')[0],
        half:      $('[src$="half.jpg"]')[0],
        kruhyH:    $('[src$="kruhyH.jpg"]')[0],
        psychot:   $('[src$="psychoterapie.png"]')[0],
        white:     $('[src$="white.jpg"]')[0],
        brt:       $('[src$="brt.svg"]')[0],
        kruhyV:    $('[src$="kruhyV.jpg"]')[0],
        corner:    $('[src$="corner-test.png"]')[0],
        part:      $('[src$="part-transparent.png"]')[0]
    },

/*    asciizerObject = new Asciizer(el_testImages[0]),
    canvas = $('#atelier')[0],
    ctx = canvas.getContext('2d'),*/
    currentTestImage = 'n',
    currentCanvasW = 120;

$('title').append(' | picture: ' + currentTestImage + ' | char width: ' + currentCanvasW);


test("Calculating and setting canvas dimensions", function() {
    var ascObj = new Asciizer(testImages.black, currentCanvasW);

    equal(ascObj.canvas.width, currentCanvasW,'Setting canvas width in constructor');

    ascObj.setCanvasSize(137);
    equal(ascObj.canvas.width, 137,'Re-setting canvas width');    
});


test("Drawing to canvas", function() {
    // set test values
    var pretest,
        result;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pretest = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    ctx.drawImage(testImages.black, 0, 0, canvas.width, canvas.height);
    result = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    notDeepEqual(pretest, result, "something was drawn");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

test("Getting canvas raw values", function() {
    "use strict";
    // set test values
    var oktest = true,
        result,
        counter = 0;

    // test
    asciizerObject.draw(testImages.black);
    asciizerObject.readCanvas();
    result = asciizerObject.valueArray;

    for (var i = 0, ii = (result.length) / 4; i < ii; i++) {
        var curtest = result[4 * i] === 0 &&
            result[4 * i + 1] === 0 &&
            result[4 * i + 2] === 0 &&
            result[4 * i + 3] === 255;
        oktest = oktest && curtest;
        counter++;
    }

    ok(oktest, "reading drawn image");
    ok(canvas.width * canvas.height === result.length / 4, "length of data: " + result.length / 4);
});

test("Calculating pixel values ", function() {
    "use strict";
    
    var ascObj = new Asciizer();

    ascObj.loadImage(testImages[currentTestImage]);
    ascObj.setCanvasSize(currentCanvasW);
    ascObj.draw();
    ascObj.readCanvas();
    ascObj.calculatePixels();

    ok(ascObj.valueArray.length === ascObj.pixelLightness.length * 4, "correct array length");
});

test("Calculating char values ", function() {
    "use strict";
    
    // setup
    var ascObj = new Asciizer(),
    	diff;

    ascObj.loadImage(testImages[currentTestImage]);
    ascObj.setCanvasSize(currentCanvasW);
    ascObj.draw();
    ascObj.readCanvas();
    ascObj.calculatePixels();
    ascObj.calculateCharValues();

    //// test

    // odd number of rows leads to shorter array
    diff = ascObj.charValues.length * 2 - ascObj.pixelLightness.length;
    
    ok(diff === 0 || diff === -currentCanvasW, "correct array length");
});

test("Checking char array's integrity", function() {
	var problems = [],
		itsok = true,
		ascObj = new Asciizer();

    ascObj.loadImage(testImages[currentTestImage]);
    ascObj.setCanvasSize(currentCanvasW);
    ascObj.draw();
    ascObj.readCanvas();
    ascObj.calculatePixels();
    ascObj.calculateCharValues();

	for (var i = 0, ii = ascObj.charValues.length; i < ii; i++) {
		itsok = !isNaN(ascObj.charValues[i]);
		if (!itsok) {
			problems.push(i);
		}
	}
	ok(itsok, "Checking if every char value is a number. Problems: " + problems.join(','));

});

test("Analysing char values", function() {
    "use strict";
    
    var ascObj = new Asciizer();

    ascObj.loadImage(testImages[currentTestImage]);
    ascObj.setCanvasSize(currentCanvasW);
    ascObj.draw();
    ascObj.readCanvas();
    ascObj.calculatePixels();
    ascObj.calculateCharValues();
    ascObj.analyze();

    for (var prop in ascObj.analysis) {
    	var cur = ascObj.analysis[prop];
    	ok(!isNaN(cur) && cur >= 0, "Property "+prop+" should be a number over zero. Value: "+cur);
    	if (prop != 'sum') {
    		ok (!isNaN(cur) && cur <= 765, "Property "+prop+" should be a number less than 765. Value: "+cur);
    	} else {
    		ok (!isNaN(cur) && cur <= ascObj.charValues.length * 765, "Property sum should be less than charValues * 765. Value: "+cur);
    	}
    }

});

test("Choosing characters", function () {
	"use strict";
    
    var ascObj = new Asciizer(), 
    	itsok = true;

    ascObj.loadImage(testImages[currentTestImage]);
    ascObj.setCanvasSize(currentCanvasW);
    ascObj.draw();
    ascObj.readCanvas();
    ascObj.calculatePixels();
    ascObj.calculateCharValues();
    ascObj.analyze();
    ascObj.calcChars();

	for (var i = 0, ii = ascObj.charValues.length; i < ii; i++) {
		itsok = itsok && (typeof ascObj.chargrid[i] === "string");
	}

	ok(itsok, "There are only strings in chargrid");
});


test("Splitting into lines", function () {
	"use strict";
    
    var ascObj = new Asciizer(), 
    	lines = ascObj.lines,
    	itsok = true,
    	diff;

    ascObj.loadImage(testImages[currentTestImage]);
    ascObj.setCanvasSize(currentCanvasW);
    ascObj.draw();
    ascObj.readCanvas();
    ascObj.calculatePixels();
    ascObj.calculateCharValues();
    ascObj.analyze();
    ascObj.calcChars();
    ascObj.splitIntoLines();
    
	for (var i = 0, ii = lines.length; i < ii; i++) {
		itsok = itsok && lines[i].length === ascObj.grid_w;
	}

	itsok = itsok && lines.length;

	// some rounding errors may occur
	diff = lines.length - ascObj.grid_h;
	ok( diff < 2, "There's correct number of lines");
	ok( itsok, "Lines have the same width");

	//ascObj.log();

});

test("Single method running all others", function () {
    "use strict";
    
    var ascObj1 = new Asciizer(), 
        ascObj2 = new Asciizer(testImages[currentTestImage],currentCanvasW);

    ascObj1.loadImage(testImages[currentTestImage]);
    ascObj1.setCanvasSize(currentCanvasW);
    ascObj1.draw();
    ascObj1.readCanvas();
    ascObj1.calculatePixels();
    ascObj1.calculateCharValues();
    ascObj1.analyze();
    ascObj1.calcChars();
    ascObj1.splitIntoLines();

    deepEqual(ascObj1.result(), ascObj2.start(), "Results are equal");

});