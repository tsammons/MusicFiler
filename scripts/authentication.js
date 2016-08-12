/**
 * Created by Jacob on 4/14/2016.
 */


function User() {
    var firebase = new Firebase("https://finalproj.firebaseio.com");
    this.firebase = firebase;
    var usersRef = this.firebase.child('users');
    this.usersRef = usersRef;
    var uid;
    var instance = this;


    // login with email and password
    this.login = function(email,password) {
        this.firebase.authWithPassword({
            email: email,
            password : password
        }, function(error, authData) {
            if (!error) {
                instance.auth = authData;
                console.log("uid:", authData.uid);
            } else {
                instance.onError("login failed! " + error);
                instance.onLoginFailure();
            }
        }, {
            remember : "sessionOnly"
        });
    };

    // logout
    this.logout = function() {
        this.firebase.unauth();
        instance.auth=null;
    };

    // signup with an alias
    this.signup = function(email, name, phone, password, street, city, state, zip) {
        this.firebase.createUser({
            email : email,
            password : password
        }, function(error, userData) {
            if (error) {
                instance.onError("Error creating user" + error);
            }
            else {
                instance.userData = userData;
                console.log("user data",userData);
                usersRef.child(userData.uid).set({
                    email : email,
                    name : name,
                    phone: phone,
                    deliveryaddress: {
                        street: street,
                        city: city,
                        state: state,
                        zip: zip}
                }, function(error) {
                    if (error) {
                        instance.onError(error);
                    }
                    else {
                        instance.login(email,password);
                    }
                });
            }
        });
    };

}


$(function(){
    var ll = new User();
    var ref = new Firebase("https://finalproj.firebaseio.com");

    var $signupForm = $('#signup-form'),
        $signupButton = $('#signup-button'),
        $loginButton = $('#login-button'),
        $loginForm = $('#login-form'),
        $logoutButton = $('#logout-button'),
        $fbButton = $('#facebook-button'),
        $submitButton = $('#uploadbutton'),
        $profileButton = $('#profilebutton');

    var authData = ref.getAuth();
    if(authData == null) {
        $loginButton.show();
        $signupButton.show();
        $fbButton.show();
        $logoutButton.hide();
        $submitButton.hide(),
        $profileButton.hide();
    }else{
        $loginButton.hide();
        $signupButton.hide();
        $fbButton.hide();
        $logoutButton.show();
        $submitButton.show(),
        $profileButton.show();
    }
    $signupForm.hide();
    $loginForm.hide();



    // errors
    ll.onError = function(error) {
        //showAlert(error,"danger");
        alert(error, "dander");
    };

    ll.onLoginFailure = function() {
        console.log("in onLoginFailure");
        $loginButton.show();
        $signupButton.show();
    };


    // logout
    $logoutButton.on('click',function(e) {
        var r = confirm("Are you sure you want to logout?");
        if (r == true) {

            ll.logout();
            $logoutButton.hide();
            $submitButton.hide();
            $profileButton.hide();
            $loginButton.show();
            $signupButton.show();
            $fbButton.show();


            return false;
        } else {
        }

    });

    // login forms
    $loginButton.on('click',function(e) {
        $loginButton.hide();
        $signupButton.show();
        $signupForm.hide();
        $loginForm.show();
        $('#login-email').val("").focus();
        $('#login-password').val("").blur();
        return false;
    });

    // fbbutton
    $fbButton.on('click', function(e){
        $fbButton.hide();
        $loginButton.hide();
        $loginForm.hide();
        $signupButton.hide();
        $signupForm.hide();
        $logoutButton.show();
        $submitButton.show(),
        $profileButton.show();

        ll.firebase.authWithOAuthPopup("facebook", function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
            }
        });
    });


    $loginForm.on('submit',function(e) {
        $logoutButton.show();
        $submitButton.show();
        $profileButton.show();
        $loginForm.hide();
        $fbButton.hide();
        $signupButton.hide();
        $loginButton.hide();
        e.preventDefault();
        e.stopPropagation();
        ll.login($(this).find('#login-email').val(), $(this).find('#login-password').val());
        $('#login-email').val("").blur();
        $('#login-password').val("").blur();
        return false;
    });

    $signupButton.on('click', function (e) {
        $signupButton.hide();
        $loginButton.show();
        $loginForm.hide();
        $signupForm.show();
        $('#signup-email').val("").focus();
        $('#signup-name').val("").blur();
        $('#signup-phone').val("").blur();
        $('#signup-password').val("").blur();
        $('#signup-street').val("").blur();
        $('#signup-city').val("").blur();
        $('#signup-state').val("").blur();
        $('#signup-zip').val("").blur();
        return false;
    });

    $signupForm.on('submit', function (e) {
        if ($(this).find('#signup-password').val() === $(this).find('#signup-password-conf').val()) {
            $signupForm.hide();
            $fbButton.hide();
            $signupButton.hide();
            $loginButton.hide();
            $logoutButton.show();
            $submitButton.show();
            $profileButton.show();

            e.preventDefault();
            e.stopPropagation();
            ll.signup($(this).find('#signup-email').val(),
                $(this).find('#signup-name').val(),
                $(this).find('#signup-phone').val(),
                $(this).find('#signup-password').val(),
                $(this).find('#signup-street').val(),
                $(this).find('#signup-city').val(),
                $(this).find('#signup-state').val(),
                $(this).find('#signup-zip').val());
            //$(this).find('#signup-alias').val());


            $('#signup-email').val("").blur();
            $('#signup-name').val("").blur();
            $('#signup-phone').val("").blur();
            $('#signup-password').val("").blur();
            $('#signup-street').val("").blur();
            $('#signup-city').val("").blur();
            $('#signup-state').val("").blur();
            $('#signup-zip').val("").blur();
            //$('#signup-alias').val("").blur();
        }
        else {
            alert("password confirmation incorrect");
        }
    });
});