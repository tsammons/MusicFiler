
function createItem(key, data) {

    // vars
    var sid, title, genre, likes, filename;
    sid = key;
    title = data.title;
    genre = data.genre;
    likes = data.likes;
    filename = data.filename;

    // vars
    var $item, $likeButton, $likes2, $title2, $audio;

    // create likes and title
    $likes2 = $("<p>"+likes+" </p>");
    $title2 = $("<p>" +" " + title + " </p>");

    // create button
    $likeButton = $("<button class='like-button'><3</button>");
    $likeButton.data({sid: sid, likes: likes});

    // create audio
    var filepath = "https://s3.amazonaws.com/tsammons/" + filename;
    $audio = $("<audio controls><source src=" + filepath + "></audio>");


    // update likes
    firebase.child("songs").child(sid).on("value", function(snapshot) {
        //$likeButton.text(snapshot.val().likes);
        $likes2.text(snapshot.val().likes);
    });



    // create item
    $item = $("<li>" +''+ "</li>");
    $item.append($likes2);
    $item.append($likeButton);
    $item.append($title2);
    $item.append($audio);


    // add to list
    $("ul").prepend($item);

}


var firebase = new Firebase("https://finalproj.firebaseio.com/");
var authData = firebase.getAuth();
var userref = firebase.child("users").child(authData.uid);


var songs, song, temp;
firebase.child("songs").once("value", function (snapshot) {


    // get all songs
    songs = snapshot.val();
    console.log(songs);

    // post all to page

    //console.log(song);
    firebase.child("users").child(authData.uid).child("likes").once("value", function(snap){
        //console.log(snap.val());
        var useruploads = snap.val();
        for (song in songs) {
            for (x in useruploads){
                if (x == song){
                    temp = new createItem(song, songs[song]);
                }
            }}

    });

});
