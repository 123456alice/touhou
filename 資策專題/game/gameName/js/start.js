
var begin = {

  preload: function () {
    game.load.audio('gooo', 'assets/Here we goooo sound effect.mp3')
    // game.load.audio('Thomas', 'assets/Thomas.mp3')
    game.load.image('ready', 'assets/ready.jpg')
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.refresh();
    game.stage.backgroundColor = '#FFD306';
  },
  create: function () {
    this.bg = this.add.tileSprite(0, 400, 800, 500, 'ready');
    // 加入標題與控制說明
    this.add.text(180, 180, "不可以色色", { fontSize: "100px", fill: "#00DB00", align: "center" });
    this.add.text(290, 400, "Click Z to start", { fill: '	#ffffff' });
    // 透過點擊進入遊戲場景

    this.cursors = game.input.keyboard.createCursorKeys();
    // Thomas = this.sound.add('Thomas');
    // Thomas.play();
  },
  update: function () {

    if (game.input.keyboard.isDown(Phaser.Keyboard.Z) ||
      game.input.activePointer.isDown) {
      // Thomas.pause();
      gooo = this.sound.add('gooo');
      gooo.play();
      game.time.events.add(Phaser.Timer.SECOND * 2, function () {
        game.state.start('main');
      }, this);


    }
  }
};



var win = {

  preload: function () {
    this.load.image("win", "./assets/win.jpg");
    game.load.audio('jellyfish', 'assets/jellyfish jam.mp3')
  },

  create: function () {
    music.pause(0);
    jellyfish = this.sound.add('jellyfish');
    jellyfish.play();
    game.state.pause('main');
    this.win = this.add.tileSprite(0, 0, 800, 900, 'win');

    this.add.text(100, 200, "禁尻十一月也\n只是小菜一碟", { fontSize: "100px", fill: "#0584f2" });

    this.cursors = game.input.keyboard.createCursorKeys();
  },
  update: function () {
    this.win.tilePosition.y += 5;
    this.win.tilePosition.x += 5;
    if (game.input.keyboard.isDown(Phaser.Keyboard.Z) ||
      game.input.activePointer.isDown) {
      jellyfish.pause();
      game.state.start('main', true, false);
    }
  }
};

var loss = {

  preload: function () {
    this.load.image("loss", "./assets/loss.png");
    game.load.audio('shit', 'assets/Ah shit, here we go again.mp3')
  },

  create: function () {
    music.pause(0);
    shit = this.sound.add('shit');
    shit.play();
    this.loss = this.add.tileSprite(0, 0, 800, 900, 'loss');
    this.add.text(170, 200, "大...大爆射", { fontSize: "100px", fill: "#0584f2" });
    this.cursors = game.input.keyboard.createCursorKeys();
  },
  update: function () {
    this.loss.tilePosition.y += 5;
    this.loss.tilePosition.x += -5;
    if (game.input.keyboard.isDown(Phaser.Keyboard.Z) ||
      game.input.activePointer.isDown) {
      shit.pause();
      game.state.start('main');
    }
  }
};



var game = new Phaser.Game(800, 900, Phaser.AUTO, 'gameDiv',);
game.state.add('main', main);
game.state.add('begin', begin);
game.state.add('win', win);
game.state.add('loss', loss);
game.state.start('begin');

