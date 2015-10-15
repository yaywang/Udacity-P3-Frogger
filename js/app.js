'use strict';
//TODO: refactor all the canvas size based code
//TODO: get new Enemy
// new Enemy should come out at different speeds at different time points
//TODO: collisions
//TODO: the matrix, helps pin Player's only possible locations
/*
   var matrix = {
}*/

// Enemies our player must avoid
var Enemy = function() {
    // initial positions are randomized, to a few enemies always appear new
    this.x = -1000 * Math.random();
    // randomly assign the three possible y values: 61.5, 144.5, 227.5
    this.y = 61.5 + 83 * Math.floor(Math.random() * 3);
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var speed = 100 + Math.random() * 300;
    this.x += speed * dt;
    // randomize and assign the new initial positions
    // when an enemy hits the right boundary
    if (this.x >= 550) {
        this.x = -1000 * Math.random();
        // randomly assign the three possible values: 61.5, 144.5, 227.5
        this.y = 61.5 + 83 * Math.floor(Math.random() * 3);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// the player
var Player = function() {
    this.x = 101 * Math.floor(Math.random() * 5);
    this.y = 415;
    this.sprite = 'images/char-boy.png';
};

// continuously check on collisions and hitting boundaries
Player.prototype.update = function() {
    checkCollisions(this);
    this.checkBoundaries();
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.checkBoundaries = function() {
    if (this.y == -83) {
        this.y = 415;
    } else if (this.y == 498) {
        this.y = 415;
    } else if (this.x == -101) {
        this.x = 0;
    } else if (this.x == 505) {
        this.x = 404;
    }
};

Player.prototype.handleInput = function(key) {
    // TODO: simplify with if statements
    switch (key) {
        case 'left':
            this.x -= 101;
            break;
        case 'up':
            this.y -= 83;
            break;
        case 'right':
            this.x += 101;
            break;
        case 'down':
            this.y += 83;
            break;
    }
};

//instantiate all enemies and the player
var allEnemies = [];
allEnemies[0] = new Enemy();
allEnemies[1] = new Enemy();
allEnemies[2] = new Enemy();
allEnemies[3] = new Enemy();
allEnemies[4] = new Enemy();
allEnemies[5] = new Enemy();
allEnemies[6] = new Enemy();
allEnemies[7] = new Enemy();
allEnemies[8] = new Enemy();
allEnemies[9] = new Enemy();

var player = new Player();

// drops player to initial position once it hits any enemy
function checkCollisions(player) {
    for (var i = 0; i < allEnemies.length; i++) {
        var enemy = allEnemies[i];
        var disX = player.x - enemy.x;
        var disY = player.y - enemy.y;
        if (disX <= 50 && disY <= 50 && disX >= -50 && disY >= -50) {
            player.y = 415;
        }
    }
}

// This listens for key presses and sends the keys to
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});