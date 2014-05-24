function Asciizer(imgObj, gridWidth) {
    "use strict";

    var canvas = $('#atelier')[0],
        context = canvas.getContext('2d'),
        CHAR_RATIO = 7 / 13,
        CHAR_W = 8,
        CHAR_H = 16,
        img = imgObj,
        gridHeight = null,
        charh = null,
        chars = " .-:*+=%#@".split("").reverse().join("");

    this.image = imgObj;
    this.grid_w = gridWidth;
    this.grid_h;
    this.valueArray = [];
    this.pixelLightness = [];
    this.charValues = [];
    this.analysis = {
        min: Infinity,
        max: 0,
        sum: 0,
        range: null,
        avg: null
    };

    this.loadImage = function (i) {
        this.image = i || imgObj;
    }

    this.setCanvasSize = function (w, h) {
        var ratio = this.image.width / w;
        
        this.grid_w = w;
        this.grid_h = h || (this.image.height / ratio);

        canvas.width = w;
        canvas.height = this.grid_h * 2;
    }

    this.draw = function (image2draw) {
        image2draw = image2draw || this.image;
        context.drawImage(image2draw, 0, 0, canvas.width, canvas.height);
    }

    this.readCanvas = function () {
        this.valueArray = context.getImageData(0, 0, canvas.width, canvas.height).data;
    }

    this.calculatePixels = function () {
        for (var i = 0, ii = this.valueArray.length/4; i < ii; i++) {
            var va = this.valueArray;
            this.pixelLightness.push(
                (
                    va[4*i] + va[4*i + 1] + va[4*i + 2])
                    * 
                    (256 / (va[4*i+3] + 1)
                )
            );
        }
    }

    this.calculateCharValues = function () {
        var pixl = this.pixelLightness;
        for (var i = 0, ii = pixl.length; i < ii; i++) {
            if ( (i / this.grid_w) % 2 === 0 ) {
                i += this.grid_w - 1;
                continue;
            }
            if ( i + this.grid_w < pixl.length) {
                this.charValues.push((pixl[i] + pixl[i + this.grid_w])/2);
            } else {
                this.charValues.push(pixl[i]);
            }
        }
    }

    this.analyze = function () {
        var charVals = this.charValues,
            an = this.analysis;

        for (var i = 0, ii = charVals.length; i < ii; i++) {
            var cur = charVals[i];
            an.min = cur < an.min ? cur : an.min;
            an.max = cur > an.max ? cur : an.max;
            an.sum += cur;
        }

        an.avg = an.sum / this.charValues.length;
        an.range = an.max - an.min;
    }
}