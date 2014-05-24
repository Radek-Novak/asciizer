var el_testImages = document.querySelectorAll('.test-images img'),

    testImages = {
        white: $('[src$="white.jpg"]')[0],
        black: $('[src$="black.jpg"]')[0],
        diag: $('[src$="diag.jpg"]')[0]
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

    // test

    // check
    notDeepEqual(pretest, result, "something was drawn");

    //ok(result.w == a && result.h == b, "Passed!" );

    // cleanup 
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

    // cleanup 
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
});

test("Calculating pixel values ", function() {
    "use strict";
    
    var ascObj = new Asciizer();

    ascObj.loadImage(testImages.diag);
    ascObj.setCanvasSize(20);
    ascObj.draw();
    ascObj.readCanvas();
    ascObj.calculate();

    ok(ascObj.valueArray.length === ascObj.pixelLightness.length * 4, "correct array length");
	console.log(ascObj);
});
