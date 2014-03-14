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
