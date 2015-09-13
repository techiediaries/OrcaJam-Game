var player;

function createPlayer() {
  desiredXPosition = windowW/3;

  // The player and its settings
  player = game.add.sprite(desiredXPosition, game.world.height - 150, 'dude');

  //  We need to enable physics on the player
  game.physics.arcade.enable(player);

  //  Player physics properties. Give the little guy a slight bounce.
  player.body.bounce.y = 0;
  player.body.gravity.y = 2000;
  player.body.collideWorldBounds = false;
  player.body.velocity.x = scrollSpeed;

  player.animations.add('running', [5, 6, 7, 8], 10, true);
  player.animations.play('running');
}

function enablePlayerJump() {
  var jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  var jumpCheatKey = game.input.keyboard.addKey(Phaser.Keyboard.C);

  var midJump = true;
  var jumpSpeed = -750;

  if (!player.body.touching.down) {
    player.body.velocity.x = 0;
    midJump = true;
  }

  if (player.body.touching.down) {
    midJump = false;
    player.body.velocity.x = scrollSpeed;
    accelerateToRunningPosition();
  }

  if ( jumpKey.isDown  ) {
    if ( !midJump ) {
      player.body.velocity.y = jumpSpeed;
    }
  }
  else if ( midJump ) {
    if( player.body.velocity.y < 0 ) {
      player.body.velocity.y = 1;
    }
  }

  if( jumpCheatKey.isDown ) {
    player.body.velocity.y = -700;
  }
}

function accelerateToRunningPosition() {
  platformsGroup.forEach(function(platform) {
    platform.bringToTop();
  });

  if (player.x < desiredXPosition) {
    player.body.velocity.x = scrollSpeed * 1.1;
  } else {
    player.body.velocity.x = scrollSpeed * 0.9;
  }
}

function enablePlayerDeathByLeftBoundary() {
  if (player.x < 0) {
    restartGame();
  }
}

function enableZoneChange() {
  if (player.y > windowH) {
    if(groundLevel) {
      toHell();
    }
    else if (inHell) {
      // do nothing
    }
    else if (inHeaven) {
      toGround();
    }
  }
  if (player.y < 0) {
    if(groundLevel) {
      toHeaven();
    }
    else if (inHell) {
      toGround()
    }
    else if (inHeaven) {
      // do nothing
    }
  }
}

function toHeaven() {
  inHeaven = true;
  groundLevel = false;
  inHell = false;

  //change future created platform sprites
  platformSprite = 'ground-heaven';
  groundSprite = 'ground-heaven';

  // update timer speed for enviroment generation and score
  ScoreTimer.delay = 10;
  platformGenDelay = DELAY_CONSTANT * 0.75;
  groundGenDelay = 0;

  //destroy all platforms
  platformsGroup.forEach(function(obj) {
    obj.kill();
  });

  platformCeilingOffset = ( windowH * 0.10 ); //this is the distance between the height of the game and the tallest platform
  platformFloorOffset = ( windowH * 0.33 ); //this is the distance between the bottom of the game and the lowest platform
  biasTowardsBottomMultiplier = 4;
  biasTowardsTopMultiplier = 8;

  platformWidth = 300;

  player.gravity /= 3;
  scrollSpeed *= 2;

  createPits = false;
  
  createInitalGround((windowH - ( windowH / 3 ) - 10), 'ground-heaven', 1);

  player.y = 0;

  background.loadTexture('background-heaven');

  //change existing ground to be hell sprite
  platformsGroup.forEach(function(platform) {
    platform.loadTexture('ground-heaven');
  });

  groundGroup.forEach(function(ground) {
    ground.kill();
  });
}

function toGround() {
  inHeaven = false;
  groundLevel = true;
  inHell = false;

  scrollSpeed = 700;

  background.loadTexture('background');
  groundSprite = 'ground';
  platformSprite = 'ground';

  ScoreTimer.delay = 10;

  platformCeilingOffset = ( windowH * 0.05 ); //this is the distance between the height of the game and the tallest platform
  platformFloorOffset = ( windowH * 0.12 ); //this is the distance between the bottom of the game and the lowest platform
  biasTowardsBottomMultiplier = 3;
  biasTowardsTopMultiplier = 15;

  platformWidth = 200;
  platformGenDelay = DELAY_CONSTANT * 0.43;   //platforms are created closed horizontally as this value decreases

  createPits = true;
  groundGenDelay = DELAY_CONSTANT * 0.5;

  player.y = ( windowH * 0.75);

  createInitalGround(windowH - platformHeight, 'ground', 1);

  platformsGroup.forEach(function(platform) {
    platform.loadTexture('ground');
  });

  groundGroup.forEach(function(ground) {
    ground.loadTexture('ground');
  });
}

function toHell() {

  inHeaven = false;
  groundLevel = false;
  inHell = true;

  scrollSpeed = 500;

  //change future created platform sprites
  platformSprite = 'ground-hell';
  groundSprite = 'lava';

  // update timer speed for enviroment generation and score
  ScoreTimer.delay = 100;
  platformGenDelay = DELAY_CONSTANT * 0.3;
  groundGenDelay = 0;

  //destroy all platforms
  platformsGroup.forEach(function(obj) {
    obj.kill();
  });

  platformCeilingOffset = ( windowH * 0.10 ); //this is the distance between the height of the game and the tallest platform
  platformFloorOffset = ( windowH * 0.33 ); //this is the distance between the bottom of the game and the lowest platform
  biasTowardsBottomMultiplier = 4;
  biasTowardsTopMultiplier = 8;

  platformWidth = 150;

  createPits = false;
  
  createInitalGround((windowH - ( windowH / 3 ) - 10), 'ground-hell', 1);
  createInitalGround((windowH - platformHeight), 'lava', 1.2);

  player.y = 0;

  background.loadTexture('background-hell');

  //change existing ground to be hell sprite
  platformsGroup.forEach(function(platform) {
    platform.loadTexture('ground-hell');
  });

  groundGroup.forEach(function(ground) {
    ground.loadTexture('lava');
  });
}