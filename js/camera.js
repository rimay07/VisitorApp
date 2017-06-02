Camera = function(){
	var localStream,
	streaming = false,
    video = document.getElementById('video'),
    canvas = document.getElementById('canvas'),
    buttoncontent = document.getElementById('buttoncontent'),
    photo = document.getElementById('photo'),
    startbutton = document.getElementById('startbutton'),
    width = 1920,
    height = 0;

	navigator.getMedia = (navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia);
	var input = new Input();

	this.startCamera = function(){
		navigator.getMedia({
			video: true,
			audio: false
		},
	
		function(stream) {
			if (navigator.mozGetUserMedia) {
				video.mozSrcObject = stream;
			} else {
				var vendorURL = window.URL || window.webkitURL;
				video.src = vendorURL.createObjectURL(stream);
			}
			localStream = stream.getTracks()[0];
			video.play();
		},
		
		function(err) {
			console.log("An error occured! " + err);
		});
	}
	
	this.stopCamera = function(){
		localStream.stop();
		startbutton.innerText= "CAPTURE";
		video.style.display = "block";
		canvas.style.display = "none";
		photo.src="";
	}
	
	video.addEventListener('canplay', function(ev) {
		if (!streaming) {
			height = video.videoHeight / (video.videoWidth / width);
			video.setAttribute('width', width);
			video.setAttribute('height', height);
			canvas.setAttribute('width', width);
			canvas.setAttribute('height', height);
			streaming = true;
		}
	}, false);

	function takepicture() {
		video.style.display = "none";
		startbutton.innerText= "RETAKE";
		canvas.getContext('2d').drawImage(video, 0, 0, 720, 540);
		var data = canvas.toDataURL('image/png');
		photo.setAttribute('src', data);
		localStream.stop();
		decodeImageFromBase64(data,function(decodedInformation){
			if(decodedInformation.indexOf("error") > -1){
				alert("Cannot Read QR Code")
			} else {
				input.processQrcode(decodedInformation);
			}
		})
	}
	
	function decodeImageFromBase64(data, callback){
		qrcode.callback = callback;
		qrcode.decode(data)
    }

	startbutton.addEventListener('click', function(ev) {
		if(startbutton.innerText==="CAPTURE"){
			takepicture();
		} else {
			video.style.display = "block";
			canvas.style.display = "none";
			photo.src="";
			camera.startCamera();
			startbutton.innerText= "CAPTURE";
		}
		ev.preventDefault();
	}, false);
}