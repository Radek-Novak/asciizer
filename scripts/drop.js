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
		var dt = e.originalEvent.dataTransfer,
			files = dt.files;
			
		e.stopPropagation();
		e.preventDefault();


		this.dropped = true;

		this.ondrop(files);
		this.$dropBox.hide();
		$('.intro').hide();
		$('.pagewrap').show();
		$('.pagewrap').css({'opacity': 1});
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
		$('#original-image').empty().append(imgObj);
	};

	reader.readAsDataURL(file);
}

DropHandler.init();
