function Asciizer(canvas, gridWidth, ratio) {
    var context = canvas.getContext('2d'),
        CHAR_RATIO = 7 / 13,
        gridHeight = Math.floor(CHAR_RATIO*(gridWidth / ratio)),
        charw = Math.floor(canvas.width / gridWidth),
        charh = Math.floor(canvas.height / gridHeight),
        valueArray = [],
        min = Infinity,
        max = 0,
        sum = 0,
        range = null,
        step = null,
        chars = " .-:*+=%#@".split("").reverse().join("");

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

        $('output pre').text(text);

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

        $('output pre').text(text);
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

    getValues();
    analyze();
    printValues();
}

var current;

var DropHandler = {
	$dropzone: null,
	$dropMessage: null,
	$dropBox: null,
	dropped: false,

	init: function () {
		this.$dropzone = $('html');
		this.$dropMessage = $('.dropMessage');
		this.$dropBox = $('.dropBox');

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
		this.$dropBox.show();
		$('.pagewrap').css({'opacity': 0});
	},
	dragleave: function (e) {
		e.stopPropagation();
		e.preventDefault();

		this.$dropBox.hide();
		$('.pagewrap').css({'opacity': 1});
	},
	drop: function (e) {
		e.stopPropagation();
		e.preventDefault();
		var dt = e.originalEvent.dataTransfer;
		var files = dt.files;
		this.dropped = true;

		this.ondrop(files);
		this.$dropBox.hide();
		$('.pagewrap').css({'opacity': 1});
	},
	ondrop: function (files) {
		handleFiles(files, document.getElementsByTagName('canvas')[0]);
	}
};

function handleFiles(files, canvas) {
	var file = files[0],
		reader = new FileReader(),
		context = canvas.getContext('2d');

	reader.onload = function(e) {

		var imgObj = new Image();

		imgObj.onload = function() {
			var ratio = this.width / this.height;
			canvas.width = this.width;
			canvas.height = this.height;

			context.drawImage(this, 0, 0, this.width, this.height, 0, 0, canvas.width, canvas.height);

			current = new Asciizer(canvas, getGridWidth(), ratio);
		};

		imgObj.src = reader.result;
		imgObj.alt = "current picture";
		$('#original-image').empty().append(imgObj);
	};

	reader.readAsDataURL(file);
}

DropHandler.init();

$('.sidebar input.preview').on("click", function () {
	var orig = $('#original-image'),
		label = $('[for="preview"]');
	if (!$(this).is(':checked')) {
		orig.hide(200);
		label.text('show original pic');
	} else {
		orig.show(300);
		label.text('hide original pic');
	}
});
function getGridWidth () {
	return $('#pic-w').val();
}