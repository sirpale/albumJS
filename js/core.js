var album = (function(){
	var my = {};
	var imageFilesPath = getFileNames();
	var progress = document.createElement("img");
	progress.id = "progress_bar";
	progress.src = "img/progress_bar.gif";

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

	function setBigPhotoSize(back, photo) {
		var koef = photo.offsetWidth / photo.offsetHeight;
		if (( photo.offsetWidth >= back.offsetWidth ) || ( photo.offsetHeight >= back.offsetHeight )) {
			photo.style.height = back.offsetHeight - 100 + "px";
			photo.style.width  = parseInt(photo.style.height) * koef + "px";
		};
		
		back.removeChild(progress);
		photo.style.display = "block";
		photo.style.opacity = 1;
	};

	function createBigPhotoDOM(photoSrc, photoId) {
		document.body.style.overflow = "hidden";
		progress.style.marginTop = document.body.offsetHeight/2 - 15 + "px";
		
		var bigPhotoBack = document.createElement("div");
		var bigPhotoDiv = document.createElement("div");
		var bigPhoto = document.createElement("img");

		function switchPhoto(back) { 
			event.cancelBubble = true;
			console.log(bigPhoto);

			document.body.removeChild(bigPhotoBack);
			if (back) {
				if (photoId == 0) {
					createBigPhotoDOM( imageFilesPath["big"][imageFilesPath["big"].length - 1], imageFilesPath["big"].length - 1 );
				} else {
					createBigPhotoDOM( imageFilesPath["big"][parseInt(photoId) - 1], parseInt(photoId) - 1 );
				};
			} else {
				if (photoId < (imageFilesPath["big"].length - 1)){
					createBigPhotoDOM( imageFilesPath["big"][parseInt(photoId) + 1], parseInt(photoId) + 1 );
				} else {
					createBigPhotoDOM( imageFilesPath["big"][0], 0 );
				};
			};
		};


		bigPhoto.className = "big_photo";
		bigPhoto.id = "zoomed_photo";
		bigPhoto.style.opacity = 0;
		bigPhoto.src = photoSrc;
		
		bigPhotoBack.className = "big_photo_back";
		bigPhotoBack.style.top = window.pageYOffset + "px";

		bigPhotoBack.onclick = function() {
			document.body.removeChild(this);
			document.body.style.overflow = "auto";
		};

		bigPhoto.onclick = function() { switchPhoto(); }

		bigPhoto.onload = function() {
			console.log("loaded");
			setBigPhotoSize(bigPhotoBack, bigPhoto);
			
			var leftArrow = createArrow("left_arrow", bigPhoto.offsetHeight, bigPhoto.offsetLeft.toFixed(19));
			leftArrow.onclick = function() { switchPhoto(1); }
			bigPhotoDiv.appendChild(leftArrow);
		};

		bigPhotoBack.appendChild(progress);
		bigPhotoDiv.appendChild(bigPhoto);
		bigPhotoBack.appendChild(bigPhotoDiv);
		document.body.appendChild(bigPhotoBack);

		//$('#zoomed_photo').mousewheel(function(event, delta, deltaX, deltaY) {
			//console.log(delta, deltaX, deltaY);
			//bigPhoto.style.marginTop = parseInt(bigPhoto.style.marginTop) + 10*deltaY + "px";
		//});

		return bigPhotoBack;
	};

	function createArrow(direction, height, margin) {
		var arrow = document.createElement("div");
		arrow.className = "photo_arrow";
		arrow.id = direction;

		//arrow.style.top = "0px";
		arrow.style.width = margin;
		//arrow.style.height = "100%";
		arrow.innerHTML = "<span class='glyphicon glyphicon-chevron-left'></span>";
		
		return arrow;
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
		var zoomWindow = createBigPhotoDOM( imageFilesPath["big"][parseInt(elem.id)], elem.id );
	};
	
	return my;
}());

