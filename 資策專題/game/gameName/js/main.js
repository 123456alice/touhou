var music;
var main = {

  preload: function () {
    // 載入圖片
    game.load.image('player1', 'assets/player1.png')
    game.load.image('bg', 'assets/bg.png')
    game.load.image('ero', 'assets/doggie.png')
    game.load.image('rain', 'assets/ero.png')
    game.load.spritesheet('boss', 'assets/boss1.png', 100, 94);
    game.load.spritesheet('player', 'assets/player1.png', 64, 64);
    game.load.spritesheet('explosion', 'assets/ezgif-5-2c17f66a15.png', 500, 500);
    game.load.audio('music', 'assets/NeverGonnaGiveYouUp.mp3')
    game.load.audio('gunshot', 'assets/gunshot.mp3')
  },


  create: function () {
    //一些參數
    this.nextShotAt = 0;
    this.shotDelay = 100;
    this.normal = 0;
    this.health = 100000;
    this.nextEnemyAt = 0;
    this.enemyDelay = 1000;
    this.stop_right_there = 0;

    //音樂
    music = this.sound.add('music');
    music.loop = true;
    music.play();

    game.physics.startSystem(Phaser.Physics.ARCADE); //啟用 ARCADE 碰撞系統
    //加入背景，參數為 （x,y,圖片key）
    this.no1 = this.add.tileSprite(0, 0, 800, 900, 'bg');

    // 設定敵機特性
    this.enemy = game.add.sprite(400, 100, 'boss');
    this.enemy.anchor.setTo(0.5);
    this.enemy.enableBody = true;
    game.physics.arcade.enable(this.enemy);
    this.enemy.outOfBoundsKill = true;
    this.enemy.checkWorldBounds = true;

    // 設定我方戰機特性
    this.player = game.add.sprite(400, 400, 'player');
    this.player.anchor.setTo(0.5);
    game.physics.arcade.enable(this.player);
    this.player.speed = 300;
    this.player.body.collideWorldBounds = true;
    this.player.body.setSize(50, 50, 0, 0);
    this.cursors = game.input.keyboard.createCursorKeys();

    // 設定子彈特性
    this.bulletPool = game.add.group();
    this.bulletPool.enableBody = true;
    this.bulletPool.createMultiple(3000, 'ero');
    this.bulletPool.setAll('anchor.x', 0.5);
    this.bulletPool.setAll('anchor.y', 0.5);
    // 設定彈幕特性
    this.rain = game.add.group();
    this.rain.enableBody = true;
    this.rain.createMultiple(1000, 'rain');
    this.rain.setAll('anchor.x', 0.6);
    this.rain.setAll('anchor.y', 0.5);

    //敵人移動&&彈幕
    game.time.events.add(Phaser.Timer.SECOND * 2, function () {
      this.enemy.body.velocity.y = -200;
    }, this);
    game.time.events.add(Phaser.Timer.SECOND * 5, function () {
      this.health = 1000;
    }, this);

    game.time.events.add(Phaser.Timer.SECOND * 6, function () {
      game.time.events.loop(Phaser.Timer.SECOND * 0.32, function () {
        //死掉及停止
        if (!this.enemy.alive) {
          return;
        }

        var rain = this.rain.getFirstExists(false);
        rain.reset(this.enemy.x, this.enemy.y + 20);
        var angle = Math.atan2(90, 90);
        rain.body.velocity.setToPolar(angle, 250);////////////////////////////////

        var rain2 = this.rain.getFirstExists(false);
        rain2.reset(this.enemy.x, this.enemy.y + 20);
        var angle = Math.atan2(-90, 90);
        rain2.body.velocity.setToPolar(angle, 250);////////////////////////////////

        var rain3 = this.rain.getFirstExists(false);
        rain3.reset(this.enemy.x, this.enemy.y + 20);
        var angle = Math.atan2(90, -90);
        rain3.body.velocity.setToPolar(angle, 250);////////////////////////////////

        var rain4 = this.rain.getFirstExists(false);
        rain4.reset(this.enemy.x, this.enemy.y + 20);
        var angle = Math.atan2(-90, -90);
        rain4.body.velocity.setToPolar(angle, 250);////////////////////////////////

        // var rain6 = this.rain.getFirstExists(false);
        // rain6.reset(this.enemy.x, this.enemy.y + 20);
        // rain6.body.velocity.y = 180;////////////////////////////////



      }, this);
    }, this);

    //move move move 
    game.time.events.loop(Phaser.Timer.SECOND * 4, function () {
      game.time.events.add(Phaser.Timer.SECOND * 2, function () {
        if (this.normal % 2 == 0 && this.health > 0) {
          this.enemy.reset(0, 75);
          this.normal++;
        }
        this.enemy.body.velocity.x = 400;
        this.enemy.body.velocity.y = 250;

      }, this);

      game.time.events.add(Phaser.Timer.SECOND * 4, function () {
        if (this.normal % 2 == 1 && this.health > 0) {
          this.enemy.reset(680, 0);
          this.normal++;
        }
        this.enemy.body.velocity.x = -400;
        this.enemy.body.velocity.y = 500;
      }, this);

    }, this);



   
    this.circle1 = new Phaser.Geom.Circle(200, 300, 100);
    Phaser.Actions.PlaceOnCircle(this.rain.getChildren(), this.circle1);
  },



  update: function () {
    this.no1.tilePosition.y += 5;
    // // 敵機與子彈碰撞，我機與敵機碰撞
    game.physics.arcade.overlap(this.bulletPool, this.enemy,
      this.enemyHit, null, this);

    game.physics.arcade.overlap(this.player, this.enemy,
      this.playerHit, null, this);

    game.physics.arcade.overlap(this.player, this.rain,
      this.IHit, null, this);

    if (this.game.time.totalElapsedSeconds() <= 3) {
      this.health = 1000;
    };


    // 我機控制方式
    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

    if (this.cursors.left.isDown) {

      this.player.body.velocity.x = -this.player.speed;
    }
    else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = this.player.speed;
    }

    if (this.cursors.up.isDown) {
      this.player.body.velocity.y = -this.player.speed;
    }
    else if (this.cursors.down.isDown) {
      this.player.body.velocity.y = this.player.speed;
    }
    // 如果滑鼠 (或手機觸點) 按下，而且按下點和我機距離大於 15 ，則我機移向觸點
    if (game.input.activePointer.isDown &&
      game.physics.arcade.distanceToPointer(this.player) > 15) {
      game.physics.arcade.moveToPointer(this.player, this.player.speed);
    }
    // 按下 z 鍵或者手機觸點，就執行 this.fire() 發射函式
    if (game.input.keyboard.isDown(Phaser.Keyboard.Z) ||
      game.input.activePointer.isDown) {
      this.fire();
    }

    // Phaser.Actions.RotateAroundDistance(this.group1.getChildren(), this.circle1, -0.030, this.circle1.radius);
  },
  // 子彈擊中敵機
  enemyHit: function (bullet, enemy) {
    enemy.kill();

    this.health -= 50;//13

    if (this.health <= 0) {
      var explosion = game.add.sprite(enemy.x, enemy.y, 'explosion');
      explosion.anchor.setTo(0.5);
      explosion.animations.add('boom', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 20, true);
      explosion.play('boom', 20, false, true);
      bullet.kill();
      this.rain.kill();
      enemy.kill();
      game.time.events.add(Phaser.Timer.SECOND * 0.8, function () {
        game.state.start('win');
      }, this);
    }

  },


  // 敵機與我機碰撞
  playerHit: function (player, enemy) {
    enemy.kill();
    var explosion = game.add.sprite(player.x, player.y, 'explosion');
    explosion.anchor.setTo(0.5);
    explosion.animations.add('boom', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 20, true);
    explosion.play('boom', 20, false, true);
    player.kill();

    game.time.events.add(Phaser.Timer.SECOND * 0.8, function () {
      game.state.start('loss');
    }, this);
  },

  // 彈幕與我機碰撞
  IHit: function (player, rain) {
    rain.kill();
    var explosion = game.add.sprite(player.x, player.y, 'explosion');
    explosion.anchor.setTo(0.5);
    explosion.animations.add('boom', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 20, true);
    explosion.play('boom', 20, false, true);
    player.kill();
    game.time.events.add(Phaser.Timer.SECOND * 0.8, function () {
      game.state.start('loss');
    }, this);
  },

  // 發射子彈
  fire: function () {
    if (!this.player.alive || this.nextShotAt > game.time.now) {
      return;
    }
    if (this.bulletPool.countDead() == 0) {
      return;
    }
    this.nextShotAt = game.time.now + this.shotDelay;
    gunshot = this.sound.add('gunshot');
    gunshot.play();
    var bullet = this.bulletPool.getFirstExists(false);
    bullet.reset(this.player.x, this.player.y - 20);
    bullet.body.velocity.y = -1000;
  },

};


