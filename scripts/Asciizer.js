function Asciizer(imgObj, gridWidth) {
    "use strict";

    this.canvas = $('#atelier')[0],
    this.chars = " .-:*+=%#@".split("").reverse().join("");
    this.context = this.canvas.getContext('2d');
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
    this.chargrid = [];

    this.lines = [];

}
Asciizer.prototype.loadImage = function (i) {
    "use strict";
    this.image = i || imgObj;
}

Asciizer.prototype.setCanvasSize = function (w, h) {
    "use strict";
    var ratio = this.image.width / w;
    
    this.grid_w = w;
    this.grid_h = h || (this.image.height / ratio);

    this.canvas.width = w;
    this.canvas.height = this.grid_h;
}

Asciizer.prototype.draw = function (image2draw) {
    "use strict";
    image2draw = image2draw || this.image;
    this.context.drawImage(image2draw, 0, 0, this.canvas.width, this.canvas.height);
}

Asciizer.prototype.readCanvas = function () {
    "use strict";
    this.valueArray = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height).data;
}


/*
* From 4 values (RGBA) calculates lightness of a pixel
* changes this.pixelLightness
*/

Asciizer.prototype.calculatePixels = function () {
    "use strict";
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


/*
* Averages 2 pixels for each char.
* changes this.charValues
*/

 Asciizer.prototype.calculateCharValues = function () {
    "use strict";
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


/*
* Calculates min, max, sum, range, avg
* changes this.analysis
*/

Asciizer.prototype.analyze = function () {
    "use strict";
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


/*
* Selects char for each number
* changes this.chargrid
*/

Asciizer.prototype.calcChars = function (charset) {
    "use strict";
    var chargrid = this.chargrid,
        charvals = this.charValues,
        charset = charset || this.chars,
        len = charset.length, 
        step = this.analysis.range / (len-1);

    for (var i = 0, ii = charvals.length; i < ii; i++) {
        var cur = charvals[i],
            index = ~~((cur-this.analysis.min)/step);

        chargrid.push(charset[index]);

    }
}


/*
* Splits the 1D array of characters into a 2D array
* changes this.lines
*/

Asciizer.prototype.splitIntoLines = function () {
    "use strict";
    var chargrid = this.chargrid,
        gw = this.grid_w,
        lines = this.lines;
 
    for ( var i = 0, ii = chargrid.length; i < ii; i += gw ) {
        lines.push(chargrid.slice(i,i+gw));
    }
}


/*
* Logs and returns final result with linebreaks
* changes -
*/

Asciizer.prototype.log = function () {
    "use strict";
    var chargrid = this.chargrid,
        gw = this.grid_w,
        content = '';
 
    for ( var i = 0, ii = chargrid.length; i < ii; i += gw ) {
        content += chargrid.slice(i,i+gw).join('') + '\n';
    }

    console.log(content);
    return content;
}