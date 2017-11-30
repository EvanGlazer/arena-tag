var character;
var characterColor;
$("#circle_selected, #square_selected").click(function() {
	if ($(this).hasClass("active")){
		$(this).removeClass("active");
    $(this).css('background-color', 'black');
	} else{
		$(this).addClass("active");
    $(this).css('background-color', 'red');
	}
});

$("#red_selected, #blue_selected, #green_selected, #yellow_selected").click(function() {
	if ($(this).hasClass("active")){
		$(this).removeClass("active");
    $(this).css('background-color', 'black');
	} else{
		$(this).addClass("active");
    $(this).css('background-color', 'red');
	}
});

$("#play_button").click(function(){
  // first check for character

  var circle = $('#circle_selected').hasClass('active');
  var square = $('#square_selected').hasClass('active');
  // check for colors
  var colors = [];
  var red = $('#red_selected').hasClass('active');
  var blue = $('#blue_selected').hasClass('active');
  var green = $('#green_selected').hasClass('active');
  var yellow = $('#yellow_selected').hasClass('active');
  // we need to check for player profile setup or alert them to do it
  if (circle || square) {
    if (circle) {
      character = "circle";
    } else if (square) {
      character = "square";
    }
    if (red) {
      characterColor = "red";
    }else if (blue) {
      characterColor = "blue";
    }else if (green) {
      characterColor = "green";
    }else if (yellow) {
      characterColor = "orange";
    }
    // default
    else{
      character = "square";
      characterColor = "green";
    }

    // add a active class to container to when its active and not
    $("#container").addClass("active");
    // set up game controls
    $("#container").css('display', '');
    $("#menu").css('display','none');

    // Load game
  	firebase.auth().onAuthStateChanged(function( user ) {
  		if ( user ) {
  			// User is signed in
  			playerID = user.uid;

  			fbRef.child( "Players/" + playerID + "/isOnline" ).once( "value" ).then( function( isOnline ) {

  				if ( isOnline.val() === null || isOnline.val() === false ) {
  					loadGame();
  				} else {
  					alert( "You have the game running in another tab!" );
  				}
  			});
  		} else {
  			// User is signed out
  			console.log( "Player is signed out " );

  			firebase.auth().signInAnonymously().catch(function(error) {
  				console.log( error.code + ": " + error.message );
  			})
  		}
  	});
  }
  else {
    alert("You have not selected your character yet :/")
  }
});
