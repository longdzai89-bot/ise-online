class HUDScene extends Phaser.Scene {
  constructor() { super({ key: 'HUDScene' }); }

  create() {
    // Lấy scene game để nghe event
    const game = this.scene.get('GameScene');

    // --- HUD buttons (pause strip từ btn-hud.png) ---
    // btn-hud.png là 1983x793 chứa 4 nút ngang
    // Hiển thị nút pause ở góc phải trên
    const btnHud = this.add.image(920, 30, 'btn-hud');
    btnHud.setDisplaySize(160, 64);
    btnHud.setScrollFactor(0);
    btnHud.setInteractive({ useHandCursor: true });
    btnHud.on('pointerdown', () => this.togglePause());

    this.isPaused = false;

    // --- Tim (lives) ---
    this.hearts = [];
    for (let i = 0; i < 3; i++) {
      const h = this.add.image(30 + i * 44, 30, 'hud-heart');
      h.setDisplaySize(36, 36);
      h.setScrollFactor(0);
      this.hearts.push(h);
    }

    // --- Coin icon ---
    const coinIcon = this.add.image(30, 72, 'hud-coin');
    coinIcon.setDisplaySize(30, 30);
    coinIcon.setScrollFactor(0);

    // --- Score text ---
    this.scoreText = this.add.text(170, 16, 'SCORE: 0', {
      fontSize: '20px',
      fill: '#ffffff',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 4
    });
    this.scoreText.setScrollFactor(0);

    // --- Coin count text ---
    this.coinText = this.add.text(52, 60, 'x 0', {
      fontSize: '18px',
      fill: '#ffd700',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 3
    });
    this.coinText.setScrollFactor(0);

    // Nghe event từ GameScene
    game.events.on('updateScore', (score) => {
      this.scoreText.setText('SCORE: ' + score);
    });
    game.events.on('updateCoins', (coins) => {
      this.coinText.setText('x ' + coins);
    });
    game.events.on('updateLives', (lives) => {
      this.hearts.forEach((h, i) => {
        h.setAlpha(i < lives ? 1 : 0.2);
      });
    });

    // Pause overlay
    this.pauseOverlay = this.add.rectangle(480, 270, 960, 540, 0x000000, 0.6);
    this.pauseOverlay.setScrollFactor(0);
    this.pauseOverlay.setVisible(false);
    this.pauseOverlay.setDepth(10);

    this.pauseText = this.add.text(480, 220, 'PAUSED', {
      fontSize: '48px',
      fill: '#ffffff',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5).setScrollFactor(0).setDepth(11).setVisible(false);

    // Resume button trong pause
    this.resumeBtn = this.add.image(480, 310, 'btn-play');
    this.resumeBtn.setDisplaySize(200, 80);
    this.resumeBtn.setScrollFactor(0);
    this.resumeBtn.setDepth(11);
    this.resumeBtn.setVisible(false);
    this.resumeBtn.setInteractive({ useHandCursor: true });
    this.resumeBtn.on('pointerdown', () => this.togglePause());

    // Home button trong pause
    this.homeBtn = this.add.text(480, 390, '[ MENU ]', {
      fontSize: '22px',
      fill: '#ffd700',
      fontFamily: 'monospace',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setScrollFactor(0).setDepth(11).setVisible(false);
    this.homeBtn.setInteractive({ useHandCursor: true });
    this.homeBtn.on('pointerdown', () => {
      this.scene.stop('GameScene');
      this.scene.stop('HUDScene');
      this.scene.start('MenuScene');
    });
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    const gameScene = this.scene.get('GameScene');
    if (this.isPaused) {
      gameScene.scene.pause();
      this.pauseOverlay.setVisible(true);
      this.pauseText.setVisible(true);
      this.resumeBtn.setVisible(true);
      this.homeBtn.setVisible(true);
    } else {
      gameScene.scene.resume();
      this.pauseOverlay.setVisible(false);
      this.pauseText.setVisible(false);
      this.resumeBtn.setVisible(false);
      this.homeBtn.setVisible(false);
    }
  }
}
