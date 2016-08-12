var firebase = new Firebase("https://finalproj.firebaseio.com/");
//
// Load Items
//
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
    $likes2 = $("<p class='like-class'>"+likes+" </p>");
    $title2 = $("<p class='title-class'>" +" " + title + " </p>");

    // create button
    $likeButton = $("<button class='like-button'><3</button>");
    $likeButton.data({sid: sid, likes: likes});

    // create audio
    var filepath = "https://s3.amazonaws.com/tsammons/" + filename;
    $audio = $("<audio class='audio-class' controls><source src=" + filepath + "></audio>");


    // update likes
    firebase.child("songs").child(sid).on("value", function(snapshot) {
        //$likeButton.text(snapshot.val().likes);
        $likes2.text(snapshot.val().likes);
    });



    // create item
    $item = $("<li class='song-class'>" +''+ "</li>");
    $item.append($likes2);
    $item.append($likeButton);
    $item.append($title2);
    $item.append($audio);


    // add to list
    $("ul").prepend($item);
}

//
// Handle liking button
//
$("#songlist").on("click", ".like-button", function(e) {

    // vars
    e.preventDefault();
    e.stopPropagation();
    var $e, songref, sid, x, songtitle;
    var liked = false;

    // get song id
    $e = $(e.target);
    sid = $e.data("sid");

    // add likes
    songref = firebase.child("songs").child(sid);
    //songtitle = songref.child("title").val();
    songref.on("value", function(snapshot){
        songtitle = snapshot.child("title").val()
    });
    //songtitle = songref.title.val();
    var authData = firebase.getAuth();
    var likesref = firebase.child("users").child(authData.uid).child("likes");
    firebase.child("users").child(authData.uid).child("likes").once("value", function(snap) {
        var userlikes = snap.val();
        for (x in userlikes){
            if(x == sid) liked = true;
        }


        if(liked == false) {
            songref.child("likes").transaction(function (currentLikes) {
                if (currentLikes) {
                    return currentLikes + 1;
                }
                return 1;
            });


            likesref.child(sid).set(songtitle);
        }

    });
    return false;

});



function showMySongs() {

    var firebase = new Firebase("https://finalproj.firebaseio.com/");
    var authData = firebase.getAuth();
    var userref = firebase.child("users").child(authData.uid);

    var uploadlike = document.getElementById("uploadlike");
    uploadlike.innerHTML = "My Uploads";

    var songlist = document.getElementById("songlist");
    songlist.innerHTML = '';


    var songs, song, temp;
    firebase.child("songs").once("value", function (snapshot) {


        // get all songs
        songs = snapshot.val();
        console.log(songs);

        // post all to page

        //console.log(song);
        firebase.child("users").child(authData.uid).child("uploads").once("value", function (snap) {
            //console.log(snap.val());
            var useruploads = snap.val();
            for (song in songs) {
                if(songs.hasOwnProperty(song)) {
                    for (x in useruploads) {
                        if (x == song) {
                            temp = new createItem(song, songs[song]);
                        }
                    }
                }
            }

        });

    });

}


function showMyLikes(){
    var firebase = new Firebase("https://finalproj.firebaseio.com/");
    var authData = firebase.getAuth();
    var userref = firebase.child("users").child(authData.uid);

    var uploadlike = document.getElementById("uploadlike");
    uploadlike.innerHTML = "My Likes";

    var songlist = document.getElementById("songlist");
    songlist.innerHTML = '';


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
}

$(function() {
    /*var $controller = $('#uploadlike');
    console.log("hihihi");
    $controller.change(function () {
        console.log("hey");
        console.log($("select option:selected"));
    });*/

    $( "select" )
        .change(function () {
            var selector = document.getElementById("selector");
            //var selectvalue = selector.getAttribute("value");
            var selectvalue = selector.options[selector.selectedIndex].value;
            console.log(selectvalue);
            if(selectvalue == "likes"){
                showMyLikes();
            }else if(selectvalue == "uploads"){
                showMySongs();
            }

        })

});

showMySongs();
