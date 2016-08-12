"use strict";

var firebase = new Firebase("https://finalproj.firebaseio.com/");

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
    //$e.css("background-color","yellow");

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


//
//  Load initial song list
//
firebase.child("songs").once("value", function (snapshot) {
    var songs, song, temp;

    // get all songs
    songs = snapshot.val();

    // post all to page
    for (song in songs) {
        if (songs.hasOwnProperty(song)) {
            temp = new createItem(song, songs[song]);
        }
    }

});

