class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.score = 0;
    this.lives = 3;
    this.coins = 0;
  }

  create() {
    this.score = 0;
    this.lives = 3;
    this.coins = 0;

    // ── Tilemap ─────────────────────────────────────────────────────
    const map = this.make.tilemap({ key: 'level1' });

    // Tên phải khớp với trường "name" trong level1.json tilesets[]
    const tilesTile = map.addTilesetImage('tileset-tiles', 'tiles');
    const tilesChar = map.addTilesetImage('tileset-characters', 'characters');

    if (!tilesTile) {
      console.error('[GameScene] addTilesetImage("tileset-tiles") trả null — kiểm tra level1.json');
    }
    if (!tilesChar) {
      console.error('[GameScene] addTilesetImage("tileset-characters") trả null — kiểm tra level1.json');
    }

    const SCALE = 2.2;

    // Layer nền — dùng để collision
    const layerBg = map.createLayer('Tiles', [tilesTile, tilesChar], 0, 0);
    if (layerBg) {
      layerBg.setScale(SCALE);
      layerBg.setCollisionByExclusion([-1, 0]);
    } else {
      console.error('[GameScene] Không tạo được layer "Tiles"');
    }

    // Layer trang trí A & B (không collision)
    const layerA = map.createLayer('Tiles (layer A)', [tilesTile, tilesChar], 0, 0);
    if (layerA) layerA.setScale(SCALE);

    const layerB = map.createLayer('Tiles (layer B)', [tilesTile, tilesChar], 0, 0);
    if (layerB) layerB.setScale(SCALE);

    const mapWidth  = map.widthInPixels  * SCALE;
    const mapHeight = map.heightInPixels * SCALE;

    // ── Animations ───────────────────────────────────────────────────
    // tilemap-characters_packed.png: 9 cột × 3 hàng = 27 frame (24×24)
    // Hàng 0 (frame 0-8):  idle / walk player
    // Hàng 1 (frame 9-17): enemy / item
    // Hàng 2 (frame 18-26): misc
    if (!this.anims.exists('walk')) {
      this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('characters', { start: 1, end: 2 }),
        frameRate: 8,
        repeat: -1
      });
    }
    if (!this.anims.exists('idle')) {
      this.anims.create({
        key: 'idle',
        frames: [{ key: 'characters', frame: 0 }],
        frameRate: 1
      });
    }
    if (!this.anims.exists('jump')) {
      this.anims.create({
        key: 'jump',
        frames: [{ key: 'characters', frame: 3 }],
        frameRate: 1
      });
    }

    // ── Player ────────────────────────────────────────────────────────
    const spawnY = layerBg ? mapHeight - 100 : 300;
    this.player = this.physics.add.sprite(80, spawnY, 'characters');
    this.player.setFrame(0);
    this.player.setScale(SCALE * 1.2);
    this.player.setCollideWorldBounds(true);
    this.player.body.setGravityY(200);

    if (layerBg) {
      this.physics.add.collider(this.player, layerBg);
    }

    // ── Enemies ───────────────────────────────────────────────────────
    this.enemies = this.physics.add.group();
    const enemyPositions = [
      { x: 300 * SCALE / 2, y: mapHeight - 100 },
      { x: 500 * SCALE / 2, y: mapHeight - 180 },
      { x: 700 * SCALE / 2, y: mapHeight - 100 },
    ];
    enemyPositions.forEach((pos, i) => {
      const en = this.enemies.create(pos.x, pos.y, 'characters');
      en.setFrame(9 + (i % 3));   // hàng 1 = enemy frames
      en.setScale(SCALE);
      en.setVelocityX(i % 2 === 0 ? 80 : -80);
      en.setBounceX(1);
      en.setCollideWorldBounds(true);
      if (layerBg) this.physics.add.collider(en, layerBg);
    });

    // ── Coins ─────────────────────────────────────────────────────────
    this.coinGroup = this.physics.add.staticGroup();
    const coinPositions = [
      { x: 200, y: mapHeight - 160 },
      { x: 350, y: mapHeight - 220 },
      { x: 450, y: mapHeight - 180 },
      { x: 600, y: mapHeight - 200 },
      { x: 750, y: mapHeight - 160 },
    ];
    coinPositions.forEach(pos => {
      const c = this.coinGroup.create(pos.x, pos.y, 'hud-coin');
      c.setScale(0.04);
      c.refreshBody();
    });

    this.physics.add.overlap(this.player, this.coinGroup, (player, coin) => {
      coin.destroy();
      this.coins++;
      this.score += 100;
      this.events.emit('updateScore', this.score);
      this.events.emit('updateCoins', this.coins);
    });

    // ── Enemy collision ───────────────────────────────────────────────
    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      if (player.body.velocity.y > 0 && player.y < enemy.y - 10) {
        enemy.destroy();
        this.score += 200;
        this.events.emit('updateScore', this.score);
        player.setVelocityY(-300);
      } else {
        this.playerHit();
      }
    });

    // ── Camera & world bounds ─────────────────────────────────────────
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // ── Input ─────────────────────────────────────────────────────────
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    this.setupTouchControls();

    this.isInvincible = false;
    this.touchLeft    = false;
    this.touchRight   = false;
    this.touchJump    = false;

    this.goalX = mapWidth - 100;
  }

  setupTouchControls() {
    // Vùng chạy trái (1/4 trái màn hình)
    const zoneL = this.add.zone(0, 0, 240, 540).setOrigin(0, 0).setInteractive();
    zoneL.setScrollFactor(0);
    zoneL.on('pointerdown', () => { this.touchLeft = true; });
    zoneL.on('pointerup',   () => { this.touchLeft = false; });
    zoneL.on('pointerout',  () => { this.touchLeft = false; });

    // Vùng chạy phải (giữa)
    const zoneR = this.add.zone(240, 0, 480, 540).setOrigin(0, 0).setInteractive();
    zoneR.setScrollFactor(0);
    zoneR.on('pointerdown', () => { this.touchRight = true; });
    zoneR.on('pointerup',   () => { this.touchRight = false; });
    zoneR.on('pointerout',  () => { this.touchRight = false; });

    // Vùng nhảy (1/4 phải)
    const zoneJ = this.add.zone(720, 0, 240, 540).setOrigin(0, 0).setInteractive();
    zoneJ.setScrollFactor(0);
    zoneJ.on('pointerdown', () => {
      if (this.player && this.player.body.blocked.down) {
        this.player.setVelocityY(-520);
      }
    });
  }

  playerHit() {
    if (this.isInvincible) return;
    this.lives--;
    this.events.emit('updateLives', this.lives);
    if (this.lives <= 0) {
      this.scene.stop('HUDScene');
      this.scene.start('GameOverScene', { score: this.score });
      return;
    }
    this.isInvincible = true;
    this.player.setAlpha(0.4);
    this.player.setVelocityX(-200);
    this.player.setVelocityY(-300);
    this.time.delayedCall(1500, () => {
      this.isInvincible = false;
      this.player.setAlpha(1);
    });
  }

  update() {
    if (!this.player || !this.player.active) return;

    const onGround = this.player.body.blocked.down;
    const left  = this.cursors.left.isDown  || this.wasd.left.isDown  || this.touchLeft;
    const right = this.cursors.right.isDown || this.wasd.right.isDown || this.touchRight;
    const jump  = Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
                  Phaser.Input.Keyboard.JustDown(this.wasd.up);

    if (left) {
      this.player.setVelocityX(-200);
      this.player.setFlipX(true);
      if (onGround) this.player.play('walk', true);
    } else if (right) {
      this.player.setVelocityX(200);
      this.player.setFlipX(false);
      if (onGround) this.player.play('walk', true);
    } else {
      this.player.setVelocityX(0);
      if (onGround) this.player.play('idle', true);
    }

    if (jump && onGround) {
      this.player.setVelocityY(-520);
    }

    if (!onGround) {
      this.player.play('jump', true);
    }

    // Level complete
    if (this.player.x > this.goalX) {
      this.scene.stop('HUDScene');
      this.scene.start('LevelCompleteScene', { score: this.score, coins: this.coins });
    }

    // Rơi xuống hố
    if (this.player.y > this.physics.world.bounds.height + 100) {
      this.playerHit();
      this.player.setPosition(80, 300);
    }
  }
}
