class HUDScene extends Phaser.Scene {
  constructor() { super({ key: 'HUDScene' }); }

  create() {
    const game = this.scene.get('GameScene');

    // ── Lives ─────────────────────────────────────────────────────────
    this.hearts = [];
    for (let i = 0; i < 3; i++) {
      const h = this.add.image(28 + i * 40, 28, 'hud-heart')
        .setDisplaySize(32, 32).setScrollFactor(0).setDepth(5);
      this.hearts.push(h);
    }

    // ── Coin icon + count ─────────────────────────────────────────────
    this.add.image(28, 64, 'hud-coin')
      .setDisplaySize(28, 28).setScrollFactor(0).setDepth(5);
    this.coinText = this.add.text(48, 52, 'x 0', {
      fontSize: '18px', fill: '#ffd700', fontFamily: 'monospace',
      stroke: '#000', strokeThickness: 3
    }).setScrollFactor(0).setDepth(5);

    // ── Score ─────────────────────────────────────────────────────────
    this.scoreText = this.add.text(480, 12, 'SCORE: 0', {
      fontSize: '20px', fill: '#fff', fontFamily: 'monospace',
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(5);

    // ── Pause button ──────────────────────────────────────────────────
    const pauseBtn = this.add.text(940, 12, '⏸', {
      fontSize: '28px', fill: '#fff', stroke: '#000', strokeThickness: 3
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(5).setInteractive();
    pauseBtn.on('pointerdown', () => this.togglePause());

    // ── Pause overlay ─────────────────────────────────────────────────
    this.isPaused = false;
    this.pauseOverlay = this.add.rectangle(480, 270, 960, 540, 0x000000, 0.65)
      .setScrollFactor(0).setDepth(10).setVisible(false);
    this.pauseLabel = this.add.text(480, 200, 'PAUSED', {
      fontSize: '52px', fill: '#fff', fontFamily: 'monospace',
      stroke: '#000', strokeThickness: 6
    }).setOrigin(0.5).setScrollFactor(0).setDepth(11).setVisible(false);

    this.resumeBtn = this.add.image(480, 300, 'btn-play')
      .setDisplaySize(220, 88).setScrollFactor(0).setDepth(11)
      .setVisible(false).setInteractive();
    this.resumeBtn.on('pointerdown', () => this.togglePause());

    this.homeBtn = this.add.text(480, 390, '[ MENU ]', {
      fontSize: '24px', fill: '#ffd700', fontFamily: 'monospace',
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5).setScrollFactor(0).setDepth(11).setVisible(false).setInteractive();
    this.homeBtn.on('pointerdown', () => {
      this.scene.stop('GameScene');
      this.scene.stop('HUDScene');
      this.scene.start('MenuScene');
    });

    // ── Events từ GameScene ───────────────────────────────────────────
    game.events.on('updateScore', s  => this.scoreText.setText('SCORE: ' + s));
    game.events.on('updateCoins', c  => this.coinText.setText('x ' + c));
    game.events.on('updateLives', lv => {
      this.hearts.forEach((h, i) => h.setAlpha(i < lv ? 1 : 0.2));
    });
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    const gs = this.scene.get('GameScene');
    if (this.isPaused) {
      gs.scene.pause();
      [this.pauseOverlay, this.pauseLabel, this.resumeBtn, this.homeBtn]
        .forEach(o => o.setVisible(true));
    } else {
      gs.scene.resume();
      [this.pauseOverlay, this.pauseLabel, this.resumeBtn, this.homeBtn]
        .forEach(o => o.setVisible(false));
    }
  }
}
