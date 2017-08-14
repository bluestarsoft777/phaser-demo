const SPRITES = {
    BADDIE: 'baddie',
    SKY: 'sky',
    DIAMOND: 'diamond',
    DUDE: 'dude',
    FIRST_AID: 'first_aid',
    GROUND: 'platform',
    SKY: 'sky',
    STAR: 'star'
}

function spritePath(spriteName) {
    return `assets/${spriteName}.png`;
}

window.onload = function() {
    const game = new Phaser.Game(
        800,
        600,
        Phaser.AUTO,
        '',
        {
            preload,
            create,
            update
        }
    );

    let player;
    let platforms;
    let ground;
    let cursors;
    let stars;
    let score = 0;
    let scoreText;

    function preload () {
        game.load.image(SPRITES.SKY, spritePath(SPRITES.SKY));
        game.load.image(SPRITES.GROUND, spritePath(SPRITES.GROUND));
        game.load.image(SPRITES.STAR, spritePath(SPRITES.STAR));
        game.load.spritesheet(SPRITES.DUDE, spritePath(SPRITES.DUDE), 32, 48);
    }

    function create () {
        // PHYSICS
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // BACKGROUND
        game.add.sprite(0, 0, SPRITES.SKY);

        // GROUND AND PLATFORMS
        platforms = game.add.group();
        platforms.enableBody = true;

        ground = platforms.create(0, game.world.height - 60, SPRITES.GROUND);
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;

        let ledge = platforms.create(400, 400, SPRITES.GROUND);
        ledge.body.immovable = true;

        ledge = platforms.create(-150, 200, SPRITES.GROUND);
        ledge.body.immovable = true;

        // PLAYER
        player = game.add.sprite(32, game.world.height - 150, SPRITES.DUDE);
        game.physics.arcade.enable(player);

        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.body.collideWorldBounds = true;
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);

        // PICKABLE OBJECTS
        stars = game.add.group();
        stars.enableBody = true;

        for (var i = 0; i < 12; i++) {
            const star = stars.create(i*70, 0, SPRITES.STAR);
            star.body.gravity.y = 6;
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }

        // score
        scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        // CONTROLS
        cursors = game.input.keyboard.createCursorKeys();
    }

    function update() {
        //  Collide the player and the stars with the platforms
        //game.physics.arcade.collide(player, platforms);

        var hitPlatform = game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(stars, platforms);

        game.physics.arcade.overlap(player, stars, collectStar, null, this);

        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;

        if (cursors.left.isDown)
        {
            //  Move to the left
            player.body.velocity.x = -150;
            player.animations.play('left');
        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
            player.body.velocity.x = 150;
            player.animations.play('right');
        }
        else
        {
            //  Stand still
            player.animations.stop();
            player.frame = 4;
        }

        //  Allow the player to jump if they are touching the ground.
        if (cursors.up.isDown && player.body.touching.down && hitPlatform)
        {
            player.body.velocity.y = -350;
        }
    }

    function collectStar (player, star) {
        // Removes the star from the screen
        star.kill();

        //  Add and update the score
        score += 10;
        scoreText.text = 'Score: ' + score;
    }
};
