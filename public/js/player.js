var Player = function( playerID ) {
	this.playerID = playerID;
	this.isMainPlayer = false;
	this.tagged = false;
	this.character;
	this.color;
	this.mesh;
	
	var player_geometry;
	var player_material;
	console.log(character);
	var hex;
		// logic for finding color
		if (this.color == "red"){
			hex = 0xFF0000;
		}
		else if (this.color == "blue") {
			hex = 0x0027FF;
		}
		else if (this.color == "green") {
			hex = 0x026300;
		}
		else if (this.color == "orange") {
			hex = 0xEEBC00;
		}
		console.log("hex= "+ hex);
		if (character == "square"){
			player_geometry = new THREE.BoxGeometry( 1, 1, 1 );
			player_material = new THREE.MeshBasicMaterial( {color: 0x0027FF, wireframe: false} );
		} else {
			// circle
			player_geometry = new THREE.SphereGeometry( 2	 );
			player_material = new THREE.MeshBasicMaterial( {color: 0x0027FF, wireframe: false} );
		}

	var scope = this;

	this.init = function() {
		scope.mesh = new THREE.Mesh( player_geometry, player_material );
		scene.add( scope.mesh );

		if ( scope.isMainPlayer ) {
			// Give player control of this mesh
			controls = new THREE.PlayerControls( camera , scope.mesh );
			controls.init();
		}
	};
	// this.setCharacter = function( char ) {
	// 	if (char.character == "square"){
	// 		player_geometry = new THREE.BoxGeometry( 1, 1, 1 );
	// 		player_material = new THREE.MeshBasicMaterial( {color: 0x0027FF, wireframe: false} );
	// 	} else {
	// 		// circle
	// 		player_geometry = new THREE.SphereGeometry( 2	 );
	// 		player_material = new THREE.MeshBasicMaterial( {color: 0x0027FF, wireframe: false} );
	// 	}
	// 	scope.mesh = new THREE.Mesh( player_geometry, player_material );
	// };
	this.setOrientation = function( position, rotation ) {
		if ( scope.mesh ) {
			scope.mesh.position.copy( position );
			scope.mesh.rotation.x = rotation.x;
			scope.mesh.rotation.y = rotation.y;
			scope.mesh.rotation.z = rotation.z;

		}
	};
};
