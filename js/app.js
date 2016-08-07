'use strict';

var global = this,
    allEnemies = [];

// The scoring mechanism
var score = {};
score.value = 0;
// Ds could be a negative number to decrease the score, and 0 if the score does not change
score.update = function(ds) {
    score.value += ds;
    document.body.getElementsByClassName('score')[0].textContent = 'Score : ' + score.value.toString();
};
score.update(0);

// The lives mechanism, similar to the scoring mechanism
var lives = {};
lives.value = 3;
lives.update = function(ds) {
    lives.value += ds;
    document.body.getElementsByClassName('lives')[0].textContent = 'Lives: ' + lives.value.toString();
};
lives.update(0);


// Enemies our player must avoid
var Enemy = function() {
    // Boundaries:
    this.leftBound = -101;
    this.rightBound = 505;
    // Randomly output x and y values:
    this.initX = function() {
        return this.leftBound - 101 * Math.floor(Math.random() * 42);
    };
    this.initY = function() {
        return 61.5 + 83 * Math.floor(Math.random() * 3);
    };

    this.x = this.initX();
    this.y = this.initY();

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.initialSpeed = 100 + 100 * Math.random();

    // Generate speed
    this.updateSpeed = function() {
        this.speed = this.initialSpeed;
        for (var i = 0; i < allEnemies.length; i++) {
            var xDistance = allEnemies[i].x - this.x;
            if (this.y == allEnemies[i].y && xDistance >= 0 && xDistance < 101) {
                this.speed = allEnemies[i].speed;
            }
        }
    };
};


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.updateSpeed();

    this.x += this.speed * dt;

    //checkCollapsedBugs();

    // Randomize and assign the new initial positions
    // when an enemy hits the right boundary
    if (this.x >= this.rightBound) {
        this.x = this.initX();
        this.y = this.initY();
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// The player
var Player = function() {
    this.x = 101 * Math.floor(Math.random() * 5);
    this.y = 415;
    this.sprite = 'images/char-boy.png';
};

// Continuously check on collisions and boundary-hitting
Player.prototype.update = function() {
    checkCollisions(this);
    this.checkBoundaries();
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.checkBoundaries = function() {
    if (this.y == -83) {
        // The player reaches the top
        score.update(100);
        this.y = 415;
    }

    if (this.y == 498) {
        this.y = 415;
    }

    if (this.x == -101) {
        this.x = 0;
    }

    if (this.x == 505) {
        this.x = 404;
    }
};

Player.prototype.handleInput = function(key) {
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

// Instantiate all enemies and the player
for (var i = 0; i < 22; i++) {
    var newEnemy = new Enemy();
    allEnemies.push(newEnemy);
}

function checkCollapsedBugs() {
    for (var i = 0; i < allEnemies.length; i++) {
        //console.log('Entering for loop in checkCollaspsedBugs');
        if (allEnemies[i].x <= 0) {
            for (var j = 0; j < allEnemies.length; j++) {
                if (allEnemies[j].x <= 0) {
                    var xDist = allEnemies[j] - allEnemies[i];
                    if (allEnemies[i].y == allEnemies[j].y && xDist >= 0 && xDist <= 101) {
                        allEnemies[i].x = allEnemies[j].x;
                        // console.log('x changed');
                    }
                }
            }
        }
    }
}

var player = new Player();

// Picking vehicle
// document.getElementById('boy').addEventListener('click', function() {
//     player.sprite = 'images/char-boy.png';
//  });

// document.getElementById('pink-girl').addEventListener('click', function() {
//     player.sprite = 'images/char-pink-girl.png';
// });


// All possible gem urls
var gemList = ['images/gem-blue.png'];

// The gems to get rewards
var Gem = function(gemList) {
    // Randomly pick a url from the gemList
    this.gem = gemList[Math.floor(Math.random() * gemList.length)];
    // The location for each gem is randomly set at anywhere on the stone block;
    this.x = 101 * Math.floor(Math.random() * 5);
    this.y = 61.5 + 83 * Math.floor(Math.random() * 3);
    // Duration on screen in milliseconds
    this.duration = 1000 + Math.random() * 3000;
};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.gem), this.x, this.y);
};

// An array of all the gems produced. Empty at the beginning.
var allGems = [];

// Check the play's collisions with the enemies and the gems
function checkCollisions(player) {
    // Drop player to initial position and lose one life once it hits any enemy
    for (var i = 0; i < allEnemies.length; i++) {
        var enemy = allEnemies[i];
        var disToEnemyX = player.x - enemy.x;
        var disToEnemyY = player.y - enemy.y;
        if (disToEnemyX <= 50 && disToEnemyY <= 50 && disToEnemyX >= -50 && disToEnemyY >= -50) {
            lives.update(-1);
            player.y = 415;
        }
    }

    for (var j = 0; j < allGems.length; j++) {
        var gem = allGems[j];
        if (gem.endTime > Date.now()) {
            var disToGemX = player.x - gem.x;
            var disToGemY = player.y - gem.y;
            if (disToGemX <= 50 && disToGemY <= 50 && disToGemX >= -50 && disToGemY >= -50) {
                // Reward for getting a gem
                score.update(10);
                // Set the endTime to now so the gem will disappear at the next frame
                gem.endTime = Date.now();
            }
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