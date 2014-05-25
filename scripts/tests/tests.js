var el_testImages = document.querySelectorAll('.test-images img'),

    testImages = {
        white: $('[src$="white.jpg"]')[0],
        black: $('[src$="black.jpg"]')[0],
        diag: $('[src$="diag.jpg"]')[0],
        kruhyV: $('[src$="kruhyV.jpg"]')[0],
        zlovule: $('[src$="Zlovůle.jpg"]')[0],
        arrdown: $('[src$="arrowDown.png"]')[0]
    },

    asciizerObject = new Asciizer(el_testImages[0]),
    canvas = $('#atelier')[0],
    ctx = canvas.getContext('2d');



test("Calculating and setting canvas dimensions", function() {
    var testA = 20,
        ascObj = new Asciizer(testImages.black),
        cnvS, imgW, imgH, ratio;

    function getCanvasSize(sel) {
        var c = $(sel)[0] || $('#atelier')[0];

        return {
            w: c.width,
            h: c.height
        };
    }
    ascObj.setCanvasSize(testA);

    imgW = ascObj.image.width;
    imgH = ascObj.image.height;
    ratio = imgW / testA;

    // check
    cnvS = getCanvasSize();
    ok(cnvS.w === testA && cnvS.h === (imgH / ratio) * 2, "Canvas dimensions: " + cnvS.w +'x'+ cnvS.h);
    ok(ascObj.grid_w === testA && ascObj.grid_h === (imgH / ratio), "Chargrid dimensions: " + ascObj.grid_w +'x'+ ascObj.grid_h);

});


test("Drawing to canvas", function() {
    // set test values
    var pretest,
        result;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pretest = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    ctx.drawImage(el_testImages[19], 0, 0, canvas.width, canvas.height);
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

    ascObj.loadImage(testImages.zlovule);
    ascObj.setCanvasSize(20);
    ascObj.draw();
    ascObj.readCanvas();
    ascObj.calculatePixels();

    ok(ascObj.valueArray.length === ascObj.pixelLightness.length * 4, "correct array length");
});

test("Calculating char values ", function() {
    "use strict";
    
    var ascObj = new Asciizer();

    ascObj.loadImage(testImages.zlovule);
    ascObj.setCanvasSize(20);
    ascObj.draw();
    ascObj.readCanvas();
    ascObj.calculatePixels();
    ascObj.calculateCharValues();

    ok(ascObj.charValues.length * 2 === ascObj.pixelLightness.length, "correct array length");

    console.log(ascObj.charValues.length, ascObj.pixelLightness.length);
});

test("Checking char array's integrity", function() {
	var problems = [],
		itsok = true,
		ascObj = new Asciizer();

    ascObj.loadImage(testImages.zlovule);
    ascObj.setCanvasSize(20);
    ascObj.draw();
    ascObj.readCanvas();
    ascObj.calculatePixels();
    ascObj.calculateCharValues();

	for (var i = 0, ii = ascObj.charValues.length; i < ii; i++) {
		itsok = !isNaN(ascObj.charValues[i]);
		if (!itsok) {
			problems.push(i);
		}
	};
	ok(itsok, "Checking if every char value is a number. Problems: " + problems.join(','));

});

test("Analysing char values", function() {
    "use strict";
    
    var ascObj = new Asciizer();

    ascObj.loadImage(testImages.zlovule);
    ascObj.setCanvasSize(20);
    ascObj.draw();
    ascObj.readCanvas();
    ascObj.calculatePixels();
    ascObj.calculateCharValues();
    ascObj.analyze();

    for (var prop in ascObj.analysis) {
    	var cur = ascObj.analysis[prop];
    	ok(!isNaN(cur) && cur >= 0, "Property "+prop+" should be a number over zero. Value: "+cur);
    	if (prop != 'sum') {
    		ok (!isNaN(cur) && cur <= 765, "Property "+prop+" should be a number less than 765. Value: "+cur)
    	} else {
    		ok (!isNaN(cur) && cur <= ascObj.charValues.length * 765, "Property sum should be less than charValues * 765. Value: "+cur)
    	}
    }

});

test("Choosing characters", function () {
	"use strict";
    
    var ascObj = new Asciizer(), 
    	itsok = true;

    ascObj.loadImage(testImages.zlovule);
    ascObj.setCanvasSize(20);
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
    	itsok = true;

    ascObj.loadImage(testImages.zlovule);
    ascObj.setCanvasSize(20);
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

	ok(lines.length === ascObj.grid_h, "There's correct number of lines");
	ok(itsok, "Lines have the same width");

	ascObj.log();
});