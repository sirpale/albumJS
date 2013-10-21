var album = (function(){
	var my = {};
	var imageFilesPath = getFileNames();

	function parseResponse(response) {
		return response.match(/([^>\s]+jpg|jpeg|png)</ig);
	};

	function getFileNames() {
		var request = new XMLHttpRequest();

		request.open("GET", "./imagesAlbum/smallsize/", false);
		request.send(null);

		if (request.status == 200) {		
			var fileNames = parseResponse(request.responseText);
			return {
				"big":  fileNames.map(function(x) { x = x.substr(0, x.length-1); return "imagesAlbum/bigsize/" + x; }),
				"small": fileNames.map(function(x) { x = x.substr(0, x.length-1); return "imagesAlbum/smallsize/" + x; })
			}
		}

		return [];
	};

	function setCssForAlbumContainer(elem) {
		elem.style.height = "100%";
		elem.style.marginLeft = "100px";
		elem.style.marginRight = "100px";
	};

	function createPhotoHolder(child, num) {
		var aTag = document.createElement("a");
		var elem = document.createElement("div");
		aTag.className = "photo_href";
		elem.onclick = function() { my.zoomPhoto(this) };
		elem.className = "photo_holder";
		elem.id = num;
		aTag.appendChild(child);
		elem.appendChild(aTag);
		return elem;
	};

	function createBigPhotoDOM(photoSrc) {
		var bigPhotoBack = document.createElement("div");
		var bigPhoto = document.createElement("img");
		bigPhoto.className = "big_photo";
		bigPhotoBack.className = "big_photo_back";
		bigPhoto.style.display = "";
		bigPhoto.src = photoSrc;
		bigPhoto.style.marginTop = 70 + window.pageYOffset + "px";

		bigPhotoBack.onclick = function() { document.body.removeChild(this) };
		bigPhoto.onclick = function() {  };

		bigPhotoBack.appendChild(bigPhoto);
		document.body.appendChild(bigPhotoBack);
		
		return bigPhotoBack;
	};

	my.generateAlbum = function(elem) {
		elem = document.getElementById(elem);
		setCssForAlbumContainer(elem);
		var filePath = imageFilesPath["small"];

		for (var i = 0; i < filePath.length; i++) {
			var image = document.createElement("img");
			image.src = filePath[i];
			image.id = "photo" + i;
			image.className = "photo";
			elem.appendChild(createPhotoHolder(image, i));
		}
	};

	my.zoomPhoto = function(elem) {
		console.log("zoomPhoto");
		console.log(elem.id);
		var zoomWindow = createBigPhotoDOM( imageFilesPath["big"][parseInt(elem.id)] );
	};

	return my;
}());

