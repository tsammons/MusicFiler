"use strict";

$(function(){
    var firebase = new Firebase("https://finalproj.firebaseio.com/");
    var songref = firebase.child("songs");
    songref.orderByChild("timestamp").once('value', function(snapshot){
        snapshot.forEach(function(songsnap){
            console.log(songsnap.key());
        });
        //console.log(snapshot.key());
    });
    var $genrebutton = $('#genrebutton');
    var $searchbutton = $('#searchbutton');
    var $searchform = $('#searchform');

    //when the sort by genre button is pressed
    $genrebutton.on('click',function(e) {

        console.log("genre button pressed");
        var list = document.getElementById('songlist');
        list.innerHTML = '';
        var genreselector = document.getElementById('choose-genre');
        var genre = genreselector.options[genreselector.selectedIndex].value;
        var sortselector = document.getElementById('choose-view');
        var sorttype = sortselector.options[sortselector.selectedIndex].value;
        var temp;


        firebase.child("songs").orderByChild(sorttype).once("value", function (snapshot) {
            console.log("HERE TOO");
            var files, file, temp, x;

            files = snapshot;
            //console.log(snapshot.val());


            files.forEach(function (file) {
                if((genre == 'all') || (genre == file.val().genre)) {
                    temp = new createItem(file.key(), file.val());
                }
            });

        })
    });

    //when the search button is pressed
    $searchform.on('submit',function(e) {
        e.preventDefault();
        e.stopPropagation();
        var list = document.getElementById('songlist');
        list.innerHTML = '';
        var searchterm = document.getElementById('searchterm').value;
        console.log(searchterm);


        firebase.child("songs").once("value", function (snapshot) {
            var songs, song, temp;

            // get all songs
            songs = snapshot.val();

            // post all to page
            for (song in songs) {
                if (songs.hasOwnProperty(song)) {
                    if (songs[song].title.toLowerCase().indexOf(searchterm.toLowerCase()) > -1) {
                        temp = new createItem(song, songs[song]);
                    }
                }
            }

        });

    });

});


//.orderByChild("timestamp")