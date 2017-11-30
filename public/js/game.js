var otherPlayers = {};

var playerID;
var player;
var score = 0;
function loadGame() {
	// load the environment
	loadEnvironment();
	// load the player
	initMainPlayer();
	// listen for other Players
	listenToOtherPlayers();
	// check for detection
	listenForPlayerTaggingOthers();

	window.onunload = function() {
		fbRef.child( "Players/" + playerID ).remove();
	};

	window.onbeforeunload = function() {
		fbRef.child( "Players/" + playerID ).remove();
	};
}

function listenToPlayer( playerData ) {
	// get score count on player
	getScoureCount();
	if ( playerData.val() ) {
		otherPlayers[playerData.key].character = (playerData.val().character);
		otherPlayers[playerData.key].setOrientation( playerData.val().orientation.position, playerData.val().orientation.rotation );
		// check here if the players are making contact
		var x = player.mesh.position.x
		var otherX = playerData.val().orientation.position.x
		var z = player.mesh.position.z
		var otherZ = playerData.val().orientation.position.z
		console.log(Math.round(x)+"//"+Math.round(otherX));
		if(Math.round(x) == Math.round(otherX) && Math.round(z) == Math.round(otherZ)){
			// update other player score
			score = otherPlayers[playerData.key].score + 1;
			fbRef.child( "Players/" + playerData.key ).set({
				score: score
			});
		}
	}
}

function listenToOtherPlayers() {
	// when a player is added, do something
	fbRef.child( "Players" ).on( "child_added", function( playerData ) {
		if ( playerData.val() ) {
			if ( playerID != playerData.key && !otherPlayers[playerData.key] ) {
				otherPlayers[playerData.key] = new Player( playerData.key );
				otherPlayers[playerData.key].character = (playerData.val().character);
				console.log((playerData.val().character));
				otherPlayers[playerData.key].init();
				fbRef.child( "Players/" + playerData.key ).on( "value", listenToPlayer );
			}
		}
	});
	// get active player counter
	getActivePlayerCount();
	// check to see who is tagged
	checkToSeeWhoIsTagged();

	// when a player is removed, do something
	fbRef.child( "Players" ).on( "child_removed", function( playerData ) {
		if ( playerData.val() ) {
			fbRef.child( "Players/" + playerData.key ).off( "value", listenToPlayer );
			scene.remove( otherPlayers[playerData.key].mesh );
			delete otherPlayers[playerData.key];
		}
	});
}

function checkToSeeWhoIsTagged(){
	// check if anyone has the attr tagged
	var recents = fbRef.child('Players').orderByKey().limitToLast(100);
	recents.on('child_added', function(snapshot) {
	  var key = snapshot.key;
		console.log(snapshot.key)
	  // load the song by its key
		fbRef.child( "Players/" + key + "/tagged" ).once( "value" ).then( function( tagged ) {
			// check to change status
			if (playerID == key) {
				if ( tagged.val() === null || tagged.val() === false ) {
					$("#player_game_status").text("You're the tagger");
					player.tagged = true
				}else{
					$("#player_game_status").text("You're the runner");
				}
			}
		});

	});

	// if not then return 0
}

function getActivePlayerCount(){
	var counter = 0;
	var recents = fbRef.child('Players').orderByKey().limitToLast(100);
	recents.on('child_added', function(snapshot) {
	  var key = snapshot.key;
			counter = counter + 1;
			$("#playersCount").text(""+counter);
		});
}

function getScoureCount(){
	var counter = 0;
	fbRef.child( "Players/" + playerID + "/score" ).once( "value" ).then( function( score ) {

		if ( score.val() >= 0 ) {
			$("#score").text(""+score.val());
		}
	});
}

function listenForPlayerTagging(){
	// this works off the rotation orientation when the data is in range of .4
	// then it will be considered as the user has been tagged

	// check to see who is currently tag if thats the player id that hits then
	// set player as tag and lose points and trade points ..

	// if nobody is tagged then the first collision will choose who is tagged
	// set player as tag and lose points and trade points ..


}

function initMainPlayer() {

	fbRef.child( "Players/" + playerID ).set({
		isOnline: true,
		tagged: false,
		score: 0,
		character: character,
		color: characterColor,
		orientation: {
			position: {x: 0, y:0, z:0},
			rotation: {x: 0, y:0, z:0}
		}
	});

	player = new Player( playerID );
	player.isMainPlayer = true;
	console.log("char " + character);
	player.character = "square";
	console.log("char " + characterColor);
	player.color = characterColor;
	player.init();
}

function loadEnvironment() {
	// this is here so you know where you're from the base
	var sphere_geometry = new THREE.SphereGeometry( 4	 );
	var sphere_material = new THREE.MeshNormalMaterial({color: 0x000000, wireframe: false});
	var sphere = new THREE.Mesh( sphere_geometry, sphere_material );

	scene.add( sphere );
}
