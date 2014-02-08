var DropHandler = {
	dropzone: null,
	dropped: false,

	init: function () {
		var that = this;
		this.dropzone = document.getElementById("dropzone");

		this.dropzone.addEventListener('dragenter', function(e) {that.dragenter(e);}, false);
		//this.dropzone.addEventListener('dragover', function(e) {that.dragover(e);}, false);

		this.dragover = this.dragover.bind(this);
		this.dropzone.addEventListener('dragover', this.dragover, false);

		(function (self) {
			self.dropzone.addEventListener('drop', function(e) {self.drop(e);}, false);
		})(this);

		(function (self) {
			self.dropzone.addEventListener('dragleave', function(e) {self.dragleave(e);}, false);
		})(this);

	},

	dragenter: function (e) {
		e.stopPropagation();
		e.preventDefault();
		//console.log(this);
		this.dropzone.style.opacity = 0.5;
	},
	dragover: function (e) {
		e.stopPropagation();
		e.preventDefault();
		this.dropzone.style.opacity = 0.5;
	},
	dragleave: function (e) {
		e.stopPropagation();
		e.preventDefault();
		this.dropzone.style.opacity = this.dropped ? 0 : 1;
	},
	drop: function (e) {
		e.stopPropagation();
		e.preventDefault();
		var dt = e.dataTransfer;
		var files = dt.files;
		this.dropped = true;
		this.dropzone.style.opacity = 0;

		this.ondrop(files);
	},
	ondrop: function (files) {
		handleFiles(files);
	}
};

var canvas = document.getElementsByTagName('canvas')[0],
	//canvas2 = document.getElementById('canvas2'),
	context = canvas.getContext('2d'),
	//context2 = canvas2.getContext('2d'),
	reader;

function handleFiles(files) {
	var file = files[0];

	reader = new FileReader();

	reader.onload = function(e) {

		var imgObj = new Image();

		imgObj.onload = function() {
			//console.log(imgObj.width,imgObj.height);
			context.drawImage(this, 0, 0, this.width, this.height, 0, 0, canvas.width, canvas.height);

			getValues(); analyze(); printValues(); //paintGrid(context);
		};

		imgObj.src = reader.result;
	};

	reader.readAsDataURL(file);
}

DropHandler.init();