// See the Configuring section to configure credentials in the SDK
AWS.config.update({accessKeyId: 'AKIAJQ3HJI57GGLMMEPQ', secretAccessKey: 'b0RblOCA2L1SkNqJ9h7oTfncM79JUMlrCyQamzcR'});

// Configure your region
AWS.config.region = 'us-east-1';


var bucket = new AWS.S3({params: {Bucket: 'tsammons'}});

//var $uploadform = $('#uploadform');
var firebase = new Firebase("https://finalproj.firebaseio.com");
var songsref = firebase.child("songs");
var authData = firebase.getAuth();
var userref = firebase.child("users").child(authData.uid).child("uploads");

var fileChooser = document.getElementById('file-chooser');
var button = document.getElementById('upload-button');
//var uploadform = document.getElementById('uploadform');
var results = document.getElementById('results');

//uploadform.addEventListener('submit', function() {
button.addEventListener('click', function() {
	var newtitle = $('#newtitle').val();
	var newgenre = $('#newgenre').val();
	var file = fileChooser.files[0];
	var filename = btoa(fileChooser.files[0].name);


	//create a new object to be added to firebase
	var newsong = {
		title: newtitle,
		genre: newgenre,
		filename: filename,
		timestamp: Date.now(),
		likes: 0
	};

	//add the title, genre, and file to firebase, initialize likes
	var songkey = songsref.push(newsong);
	userref.child(songkey.key()).set(newtitle);

	if (filename) {
	    results.innerHTML = '';

	    var params = {Key: filename, ContentType: file.type, Body: file};
		results.innerHTML = "Uploading Song...";
		bucket.upload(params, function (err, data) {
		    results.innerHTML = err ? 'ERROR!' : 'UPLOADED.';
			window.location="index.html";
		});
	} else {
	    results.innerHTML = 'Nothing to upload.';
	}
    }, false);


