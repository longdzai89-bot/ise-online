class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.score = 0;
    this.lives = 3;
    this.coins = 0;
    this.isInvincible = false;
    this.touchLeft  = false;
    this.touchRight = false;

    // ── Tilemap ──────────────────────────────────────────────────────
    const map = this.make.tilemap({ key: 'level1' });

    // Dùng key IMAGE (không phải spritesheet) cho tilemap
    const tilesTile = map.addTilesetImage('tileset-tiles',      'tiles');
    const tilesChar = map.addTilesetImage('tileset-characters',  'characters');

    const SCALE = 2.2;

    // Layer collision
    const layerBg = map.createLayer('Tiles', [tilesTile, tilesChar], 0, 0);
    if (layerBg) {
      layerBg.setScale(SCALE);
      layerBg.setCollisionByExclusion([-1, 0]);
    }

    // Layer trang trí
    ['Tiles (layer A)', 'Tiles (layer B)'].forEach(name => {
      const l = map.createLayer(name, [tilesTile, tilesChar], 0, 0);
      if (l) l.setScale(SCALE);
    });

    const mapW = map.widthInPixels  * SCALE;
    const mapH = map.heightInPixels * SCALE;

    this.physics.world.setBounds(0, 0, mapW, mapH);

    // ── Animations (dùng char-sheet spritesheet) ─────────────────────
    if (!this.anims.exists('p-idle')) {
      this.anims.create({ key: 'p-idle', frames: [{ key: 'char-sheet', frame: 0 }], frameRate: 1 });
    }
    if (!this.anims.exists('p-walk')) {
      this.anims.create({ key: 'p-walk', frames: this.anims.generateFrameNumbers('char-sheet', { start: 1, end: 2 }), frameRate: 8, repeat: -1 });
    }
    if (!this.anims.exists('p-jump')) {
      this.anims.create({ key: 'p-jump', frames: [{ key: 'char-sheet', frame: 3 }], frameRate: 1 });
    }

    // ── Player ───────────────────────────────────────────────────────
    this.player = this.physics.add.sprite(60, mapH - 120, 'char-sheet');
    this.player.setFrame(0);
    this.player.setScale(SCALE);
    this.player.setCollideWorldBounds(true);
    this.player.body.setGravityY(300);
    this.player.body.setSize(18, 22);

    if (layerBg) this.physics.add.collider(this.player, layerBg);

    // ── Enemies ──────────────────────────────────────────────────────
    this.enemies = this.physics.add.group();
    [
      { x: mapW * 0.25, y: mapH - 120 },
      { x: mapW * 0.45, y: mapH - 120 },
      { x: mapW * 0.65, y: mapH - 120 },
    ].forEach((pos, i) => {
      const e = this.enemies.create(pos.x, pos.y, 'char-sheet');
      e.setFrame(9 + (i % 3));
      e.setScale(SCALE * 0.9);
      e.setVelocityX(i % 2 === 0 ? 70 : -70);
      e.setBounceX(1);
      e.setCollideWorldBounds(true);
      if (layerBg) this.physics.add.collider(e, layerBg);
    });

    // ── Coins ────────────────────────────────────────────────────────
    this.coinGroup = this.physics.add.staticGroup();
    [
      { x: mapW * 0.2,  y: mapH - 200 },
      { x: mapW * 0.35, y: mapH - 260 },
      { x: mapW * 0.5,  y: mapH - 220 },
      { x: mapW * 0.65, y: mapH - 240 },
      { x: mapW * 0.8,  y: mapH - 200 },
    ].forEach(pos => {
      const c = this.coinGroup.create(pos.x, pos.y, 'hud-coin');
      c.setScale(0.04);
      c.refreshBody();
    });

    this.physics.add.overlap(this.player, this.coinGroup, (_, coin) => {
      coin.destroy();
      this.coins++;
      this.score += 100;
      this.events.emit('updateScore', this.score);
      this.events.emit('updateCoins', this.coins);
    });

    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      if (player.body.velocity.y > 0 && player.y < enemy.y - 10) {
        enemy.destroy();
        player.setVelocityY(-400);
        this.score += 200;
        this.events.emit('updateScore', this.score);
      } else {
        this.playerHit();
      }
    });

    // ── Camera ───────────────────────────────────────────────────────
    this.cameras.main.setBounds(0, 0, mapW, mapH);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.fadeIn(300);

    // ── Input ────────────────────────────────────────────────────────
    this.cursors = this.input.keyboard?.createCursorKeys() ?? {};
    this.wasd = this.input.keyboard?.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this._setupTouch();
    this.goalX = mapW - 80;
  }

  _setupTouch() {
    // Nửa trái: di chuyển | Nửa phải: nhảy
    this.input.on('pointerdown', ptr => {
      if (ptr.x < 480) {
        if (ptr.x < 240) this.touchLeft  = true;
        else             this.touchRight = true;
      } else {
        if (this.player && this.player.body.blocked.down) {
          this.player.setVelocityY(-560);
        }
      }
    });
    this.input.on('pointerup', () => {
      this.touchLeft  = false;
      this.touchRight = false;
    });
    this.input.on('pointerout', () => {
      this.touchLeft  = false;
      this.touchRight = false;
    });
  }

  playerHit() {
    if (this.isInvincible) return;
    this.lives--;
    this.events.emit('updateLives', this.lives);
    if (this.lives <= 0) {
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.stop('HUDScene');
        this.scene.start('GameOverScene', { score: this.score });
      });
      return;
    }
    this.isInvincible = true;
    this.tweens.add({
      targets: this.player,
      alpha: 0,
      duration: 120,
      yoyo: true,
      repeat: 6,
      onComplete: () => {
        if (this.player) this.player.setAlpha(1);
        this.isInvincible = false;
      }
    });
    this.player.setVelocityY(-300);
  }

  update() {
    if (!this.player?.active) return;

    const onGround = this.player.body.blocked.down;
    const left  = this.cursors?.left?.isDown  || this.wasd?.left?.isDown  || this.touchLeft;
    const right = this.cursors?.right?.isDown || this.wasd?.right?.isDown || this.touchRight;
    const jump  = this.cursors?.up && Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
                  this.wasd?.up && Phaser.Input.Keyboard.JustDown(this.wasd.up);

    const SPEED = 210;

    if (left) {
      this.player.setVelocityX(-SPEED);
      this.player.setFlipX(true);
      if (onGround) this.player.play('p-walk', true);
    } else if (right) {
      this.player.setVelocityX(SPEED);
      this.player.setFlipX(false);
      if (onGround) this.player.play('p-walk', true);
    } else {
      this.player.setVelocityX(0);
      if (onGround) this.player.play('p-idle', true);
    }

    if (jump && onGround) this.player.setVelocityY(-560);
    if (!onGround)        this.player.play('p-jump', true);

    // Level complete
    if (this.player.x > this.goalX) {
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.stop('HUDScene');
        this.scene.start('LevelCompleteScene', { score: this.score, coins: this.coins });
      });
    }

    // Rơi hố
    if (this.player.y > this.physics.world.bounds.height + 50) {
      this.playerHit();
      this.player.setPosition(60, 100);
    }
  }
}
