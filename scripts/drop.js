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
		$('output, canvas').css({'opacity': 0.1});
	},
	dragleave: function (e) {
		e.stopPropagation();
		e.preventDefault();

		this.$dropBox.hide();
		$('output, canvas').css({'opacity': 1});
	},
	drop: function (e) {
		e.stopPropagation();
		e.preventDefault();
		var dt = e.originalEvent.dataTransfer;
		var files = dt.files;
		this.dropped = true;

		this.ondrop(files);
		this.$dropBox.hide();
		$('output, canvas').css({'opacity': 1});
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
			//console.log(this === imgObj);
			var ratio = this.width / this.height;
			//if (this.width > this.height) {
			canvas.width = this.width;
			canvas.height = this.height;
			//}

			context.drawImage(this, 0, 0, this.width, this.height, 0, 0, canvas.width, canvas.height);

			getValues(); analyze(); printValues(); //paintGrid(context);
		};

		imgObj.src = reader.result;
	};

	reader.readAsDataURL(file);
}

DropHandler.init();