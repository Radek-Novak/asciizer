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


/**
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


/**
* Logs and returns final result with linebreaks
* changes -
* @returns content
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
// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
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
var DropHandler = {
	$dropzone: null,
	$dropMessage: null,
	$dropBox: null,
	dropped: false,

	init: function () {
		this.$dropzone = $('.drawing');

		this.$dropzone.on('dragenter', this.dragenter.bind(this));
		this.$dropzone.on('dragover', this.dragover.bind(this));
		this.$dropzone.on('drop', this.drop.bind(this));
		this.$dropzone.on('dragleave', this.dragleave.bind(this));
	},

	dragenter: function (e) {
		e.stopPropagation();
		e.preventDefault();
	},
	dragover: function (e) {
		e.stopPropagation();
		e.preventDefault();
		this.$dropzone.css({'opacity': 0.1});
		console.log(this);
	},
	dragleave: function (e) {
		e.stopPropagation();
		e.preventDefault();

		this.$dropzone.css({'opacity': 1});
	},
	drop: function (e) {
		var dt = e.originalEvent.dataTransfer,
			files = dt.files;
			
		e.stopPropagation();
		e.preventDefault();

		this.dropped = true;

		this.ondrop(files);
		this.$dropzone.css({'opacity': 1});
	},
	ondrop: function (files) {
		handleFiles(files);
	}
};

function handleFiles(files) {
	var file = files[0],
		reader = new FileReader();

	reader.onload = function(e) {

		var imgObj = new Image();

		imgObj.onload = function() {

			last = new Asciizer(this, getGridWidth());
		};

		imgObj.src = reader.result;
		imgObj.alt = "current picture";
		$('.original-image').empty().append(imgObj);
	};

	reader.readAsDataURL(file);
}

DropHandler.init();

var last;
function Asciizer(imgObj, gridWidth) {
    var canvas = $('#atelier')[0],
        context = canvas.getContext('2d'),
        CHAR_RATIO = 7 / 13,
        img = imgObj,
        ratio = img.width / img.height,
        gridHeight = null,
        valueArray = [],
        min = Infinity,
        max = 0,
        sum = 0,
        range = null,
        step = null,
        charw = null,
        charh = null,
        chars = " .-:*+=%#@".split("").reverse().join("");

    canvas.width = img.width;
    canvas.height = img.height;

    this.setGridDimensions = function(w) {
        gridWidth = w;
        gridHeight = Math.floor(CHAR_RATIO * (gridWidth / ratio));
        charw = Math.floor(canvas.width / gridWidth);
        charh = Math.floor(canvas.height / gridHeight);
    };

    this.calculate = function(w) {
        w = w || gridWidth;
        this.setGridDimensions(w);
        
        context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

        getValues();
        analyze();
        printValues();

        // cleanup for recalc
        min = Infinity;
        max = 0;
        sum = 0;
        range = null;
        step = null;
        valueArray = [];
    };
    this.setGridDimensions(gridWidth);


    this.calculate();

    window.val = [charw, charh, gridWidth, gridHeight, canvas];


    function getValues() {
        valueArray = [];

        function sum_4(arr) {
            var sum = 0,
                arl = arr.length;

            for (var i = 0; i < arl; i += 4) {
                sum += arr[i];
                sum += arr[i + 1];
                sum += arr[i + 2];
            }

            return sum /* - alpha_values*/ ;
        }

        function getRectangle(coords) {

            return context.getImageData(coords[0], coords[1], charw, charh).data;
        }

        for (var i = 0; i < gridHeight; i++) {
            var line = [];

            for (var j = 0; j < gridWidth; j++) {
                var coords = [j * charw, i * charh];
                try {
                    line.push(sum_4(getRectangle(coords)));
                } catch (e) {
                    console.log(e, coords);
                }
            }
            //console.log(line);
            valueArray.push(line);
        }
    }

    function analyze() {

        for (var i = 0, mx = valueArray.length; i < mx; i++) {
            for (var j = 0, mxj = valueArray[0].length; j < mxj; j++) {
                try {
                    var cur = valueArray[i][j];

                    if (cur > max) {
                        max = cur;
                    } else if (cur < min) {
                        min = cur;
                    }
                } catch (e) {
                    console.log(i, j, e);
                }
            }
        }

        range = max - min;
        step = (range - min) / chars.length;
    }


    function printValues() {
        var text = '';

        $('pre').text(text);

        for (var i = 0; i < gridHeight; i++) {
            for (var j = 0; j < gridWidth; j++) {
                try {
                    //var c = valueArray[i][j] >= 500000 ? 'o' : '.';
                    var charNumber = Math.floor(valueArray[i][j] / step),
                        c = 'x';

                    if (charNumber >= chars.length) {
                        charNumber = chars.length - 1;
                    } else if (charNumber < 0) {
                        charNumber = 0;
                    }

                    c = chars[charNumber];

                    if (c === undefined) {
                        //console.log(valueArray[i][j], valueArray[i][j] / step);
                    }

                    text += c;

                } catch (e) {
                    console.log(e);
                }
            }
            text += "\n";
        }

        $('pre').text(text);
    }

    function putRectangle(ctx, data, coords) {
        ctx.putImageData(data, coords[0], coords[1]);
    }

    function paintGrid(ctx) {
        for (var i = 0; i < gridHeight; i++) {
            for (var j = 0; j < gridWidth; j++) {
                context.strokeStyle = "rgb(20, 220,100)";
                context.strokeRect(j * charw, i * charh, charw, charh);
            }
        }
    }

}
// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
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
var DropHandler = {
	$dropzone: null,
	$dropMessage: null,
	$dropBox: null,
	dropped: false,

	init: function () {
		this.$dropzone = $('.drawing');

		this.$dropzone.on('dragenter', this.dragenter.bind(this));
		this.$dropzone.on('dragover', this.dragover.bind(this));
		this.$dropzone.on('drop', this.drop.bind(this));
		this.$dropzone.on('dragleave', this.dragleave.bind(this));
	},

	dragenter: function (e) {
		e.stopPropagation();
		e.preventDefault();
	},
	dragover: function (e) {
		e.stopPropagation();
		e.preventDefault();
		this.$dropzone.css({'opacity': 0.1});
		console.log(this);
	},
	dragleave: function (e) {
		e.stopPropagation();
		e.preventDefault();

		this.$dropzone.css({'opacity': 1});
	},
	drop: function (e) {
		var dt = e.originalEvent.dataTransfer,
			files = dt.files;
			
		e.stopPropagation();
		e.preventDefault();

		this.dropped = true;

		this.ondrop(files);
		this.$dropzone.css({'opacity': 1});
	},
	ondrop: function (files) {
		handleFiles(files);
	}
};

function handleFiles(files) {
	var file = files[0],
		reader = new FileReader();

	reader.onload = function(e) {

		var imgObj = new Image();

		imgObj.onload = function() {

			last = new Asciizer(this, getGridWidth());
		};

		imgObj.src = reader.result;
		imgObj.alt = "current picture";
		$('.original-image').empty().append(imgObj);
	};

	reader.readAsDataURL(file);
}

DropHandler.init();

var last;
var char_size = {
    w: 8,
    h: 16
};

$('.controls input.preview').on("click", function() {
    var orig = $('.original-image'),
        drawing = $('.drawing'),
        label = $('[for="preview"]');

    drawing.fadeToggle(0);
    orig.fadeToggle(0);
});

function getGridWidth() {
    return parseInt($('.indicator .width').text(), 10);
}

$('.recalc').click(function() {
    last.calculate(getGridWidth());
});

$('.plus, .minus').click(function() {
    var $this = $(this),
        plus = $this.hasClass('plus'),
        $input = $this.siblings('.input-number'),
        value = parseInt($input.val(), 10);

    if (plus) {
        $input.val(value + 1);
    } else if (value > 1 && !plus) {
        $input.val(value - 1);
    }
});

// jQuery ui initializations
$(".draggable").draggable({
    grid: [char_size.w, char_size.h],
    containment: "parent",
    cancel: '.inner-box',
    stack: ".draggable"
});

$(".resizable").resizable({
    grid: [char_size.w, char_size.h],

    resize: function(event, ui) {
        var $drawing = $(ui.element[0]).find('.drawing pre'),
            drawing = {
                w: $drawing.width(),
                h: $drawing.height()
            },
            text = $drawing.text(),
            lines = text.split('\n'),
            line_width = lines[0].length,
            os = ui.originalSize,
            s = ui.size,
            i = 0;

        if (os.width !== s.width) {
            var newwidth = Math.floor(drawing.w / char_size.w);

            if (line_width > newwidth) {
                for (i = 0; i < lines.length; i++) {
                    lines[i] = lines[i].substring(0, newwidth);
                }
            } else {
                for (i = 0; i < lines.length; i++) {
                    // http://stackoverflow.com/a/1877479
                    var spaces = Array(newwidth - line_width + 1).join(" ");

                    lines[i] += spaces;
                }
            }
            $('.indicator .width').text(newwidth);
        }

        if (os.height !== s.height) {
            var newheight = Math.floor(drawing.h / char_size.h);

            if (lines.length > newheight) {
                lines.remove(newheight, Infinity);
            } else {
                for (i = 0; i < newheight - lines.length; i++) {
                    lines.push(Array(line_width + 1).join(" "));
                }
            }
            $('.indicator .height').text(newheight);
        }

        $drawing.text(lines.join('\n'));
    },
    stop: function(event, ui) {
        var max = 0,
            i,
            cur_line,
            spaces,
            $text = $(ui.element[0]).find('.drawing pre'),
            lines = $text.text().split('\n');

        for (i = 0; i < lines.length; i++) {
            cur_line = lines[i].length;
            max = max < cur_line ? cur_line : max;
        }
        for (i = 0; i < lines.length; i++) {
            cur_line = lines[i];

            if (cur_line.length < max) {
                spaces = Array(max - cur_line.length + 1).join(" ");
                lines[i] += spaces;
            }
        }
        $text.text(lines.join('\n'));
    }
});

function Asciizer(a,b){function c(){function a(a){for(var b=0,c=a.length,d=0;c>d;d+=4)b+=a[d],b+=a[d+1],b+=a[d+2];return b}function c(a){return g.getImageData(a[0],a[1],r,s).data}l=[];for(var d=0;k>d;d++){for(var e=[],f=0;b>f;f++){var h=[f*r,d*s];try{e.push(a(c(h)))}catch(i){console.log(i,h)}}l.push(e)}}function d(){for(var a=0,b=l.length;b>a;a++)for(var c=0,d=l[0].length;d>c;c++)try{var e=l[a][c];e>n?n=e:m>e&&(m=e)}catch(f){console.log(a,c,f)}p=n-m,q=(p-m)/t.length}function e(){var a="";$("pre").text(a);for(var c=0;k>c;c++){for(var d=0;b>d;d++)try{var e=Math.floor(l[c][d]/q),f="x";e>=t.length?e=t.length-1:0>e&&(e=0),f=t[e],a+=f}catch(g){console.log(g)}a+="\n"}$("pre").text(a)}var f=$("#atelier")[0],g=f.getContext("2d"),h=7/13,i=a,j=i.width/i.height,k=null,l=[],m=1/0,n=0,o=0,p=null,q=null,r=null,s=null,t=" .-:*+=%#@".split("").reverse().join("");f.width=i.width,f.height=i.height,this.setGridDimensions=function(a){b=a,k=Math.floor(h*(b/j)),r=Math.floor(f.width/b),s=Math.floor(f.height/k)},this.calculate=function(a){a=a||b,this.setGridDimensions(a),g.drawImage(i,0,0,i.width,i.height,0,0,f.width,f.height),c(),d(),e(),m=1/0,n=0,o=0,p=null,q=null,l=[]},this.setGridDimensions(b),this.calculate(),window.val=[r,s,b,k,f]}function Drawing(a){var b,c=$(a),d=function(a){var b={t:8,l:7},d=(c.width(),c.height(),{x:Math.floor((a.pageX-b.l)/8),y:Math.floor((a.pageY-b.t)/16)});return console.log(d),d};b=c.mousemove(d)}function handleFiles(a){var b=a[0],c=new FileReader;c.onload=function(){var a=new Image;a.onload=function(){last=new Asciizer(this,getGridWidth())},a.src=c.result,a.alt="current picture",$(".original-image").empty().append(a)},c.readAsDataURL(b)}function getGridWidth(){return parseInt($(".indicator .width").text(),10)}Array.prototype.remove=function(a,b){var c=this.slice((b||a)+1||this.length);return this.length=0>a?this.length+a:a,this.push.apply(this,c)},drawing=Drawing("pre");var DropHandler={$dropzone:null,$dropMessage:null,$dropBox:null,dropped:!1,init:function(){this.$dropzone=$(".drawing"),this.$dropzone.on("dragenter",this.dragenter.bind(this)),this.$dropzone.on("dragover",this.dragover.bind(this)),this.$dropzone.on("drop",this.drop.bind(this)),this.$dropzone.on("dragleave",this.dragleave.bind(this))},dragenter:function(a){a.stopPropagation(),a.preventDefault()},dragover:function(a){a.stopPropagation(),a.preventDefault(),this.$dropzone.css({opacity:.1}),console.log(this)},dragleave:function(a){a.stopPropagation(),a.preventDefault(),this.$dropzone.css({opacity:1})},drop:function(a){var b=a.originalEvent.dataTransfer,c=b.files;a.stopPropagation(),a.preventDefault(),this.dropped=!0,this.ondrop(c),this.$dropzone.css({opacity:1})},ondrop:function(a){handleFiles(a)}};DropHandler.init();var last,char_size={w:8,h:16};$(".controls input.preview").on("click",function(){{var a=$(".original-image"),b=$(".drawing");$('[for="preview"]')}b.fadeToggle(0),a.fadeToggle(0)}),$(".recalc").click(function(){last.calculate(getGridWidth())}),$(".plus, .minus").click(function(){var a=$(this),b=a.hasClass("plus"),c=a.siblings(".input-number"),d=parseInt(c.val(),10);b?c.val(d+1):d>1&&!b&&c.val(d-1)}),$(".draggable").draggable({grid:[char_size.w,char_size.h],containment:"parent",cancel:".inner-box",stack:".draggable"}),$(".resizable").resizable({grid:[char_size.w,char_size.h],resize:function(a,b){var c=$(b.element[0]).find(".drawing pre"),d={w:c.width(),h:c.height()},e=c.text(),f=e.split("\n"),g=f[0].length,h=b.originalSize,i=b.size,j=0;if(h.width!==i.width){var k=Math.floor(d.w/char_size.w);if(g>k)for(j=0;j<f.length;j++)f[j]=f[j].substring(0,k);else for(j=0;j<f.length;j++){var l=Array(k-g+1).join(" ");f[j]+=l}$(".indicator .width").text(k)}if(h.height!==i.height){var m=Math.floor(d.h/char_size.h);if(f.length>m)f.remove(m,1/0);else for(j=0;j<m-f.length;j++)f.push(Array(g+1).join(" "));$(".indicator .height").text(m)}c.text(f.join("\n"))},stop:function(a,b){var c,d,e,f=0,g=$(b.element[0]).find(".drawing pre"),h=g.text().split("\n");for(c=0;c<h.length;c++)d=h[c].length,f=d>f?d:f;for(c=0;c<h.length;c++)d=h[c],d.length<f&&(e=Array(f-d.length+1).join(" "),h[c]+=e);g.text(h.join("\n"))}});
var char_size = {
    w: 8,
    h: 16
};

$('.controls input.preview').on("click", function() {
    var orig = $('.original-image'),
        drawing = $('.drawing'),
        label = $('[for="preview"]');

    drawing.fadeToggle(0);
    orig.fadeToggle(0);
});

function getGridWidth() {
    return parseInt($('.indicator .width').text(), 10);
}

$('.recalc').click(function() {
    last.calculate(getGridWidth());
});

$('.plus, .minus').click(function() {
    var $this = $(this),
        plus = $this.hasClass('plus'),
        $input = $this.siblings('.input-number'),
        value = parseInt($input.val(), 10);

    if (plus) {
        $input.val(value + 1);
    } else if (value > 1 && !plus) {
        $input.val(value - 1);
    }
});

// jQuery ui initializations
$(".draggable").draggable({
    grid: [char_size.w, char_size.h],
    containment: "parent",
    cancel: '.inner-box',
    stack: ".draggable"
});

$(".resizable").resizable({
    grid: [char_size.w, char_size.h],

    resize: function(event, ui) {
        var $drawing = $(ui.element[0]).find('.drawing pre'),
            drawing = {
                w: $drawing.width(),
                h: $drawing.height()
            },
            text = $drawing.text(),
            lines = text.split('\n'),
            line_width = lines[0].length,
            os = ui.originalSize,
            s = ui.size,
            i = 0;

        if (os.width !== s.width) {
            var newwidth = Math.floor(drawing.w / char_size.w);

            if (line_width > newwidth) {
                for (i = 0; i < lines.length; i++) {
                    lines[i] = lines[i].substring(0, newwidth);
                }
            } else {
                for (i = 0; i < lines.length; i++) {
                    // http://stackoverflow.com/a/1877479
                    var spaces = Array(newwidth - line_width + 1).join(" ");

                    lines[i] += spaces;
                }
            }
            $('.indicator .width').text(newwidth);
        }

        if (os.height !== s.height) {
            var newheight = Math.floor(drawing.h / char_size.h);

            if (lines.length > newheight) {
                lines.remove(newheight, Infinity);
            } else {
                for (i = 0; i < newheight - lines.length; i++) {
                    lines.push(Array(line_width + 1).join(" "));
                }
            }
            $('.indicator .height').text(newheight);
        }

        $drawing.text(lines.join('\n'));
    },
    stop: function(event, ui) {
        var max = 0,
            i,
            cur_line,
            spaces,
            $text = $(ui.element[0]).find('.drawing pre'),
            lines = $text.text().split('\n');

        for (i = 0; i < lines.length; i++) {
            cur_line = lines[i].length;
            max = max < cur_line ? cur_line : max;
        }
        for (i = 0; i < lines.length; i++) {
            cur_line = lines[i];

            if (cur_line.length < max) {
                spaces = Array(max - cur_line.length + 1).join(" ");
                lines[i] += spaces;
            }
        }
        $text.text(lines.join('\n'));
    }
});
