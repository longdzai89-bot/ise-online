class GameOverScene extends Phaser.Scene {
  constructor() { super({ key: 'GameOverScene' }); }

  init(data) { this.finalScore = data.score || 0; }

  create() {
    const bg = this.add.image(480, 270, 'gameover');
    bg.setDisplaySize(960, 540);

    this.add.text(480, 360, 'SCORE: ' + this.finalScore, {
      fontSize: '28px', fill: '#ffffff',
      fontFamily: 'monospace', stroke: '#000', strokeThickness: 5
    }).setOrigin(0.5);

    // Nút Retry
    const retry = this.add.image(360, 440, 'btn-hud');
    retry.setDisplaySize(180, 72);
    retry.setInteractive({ useHandCursor: true });
    retry.on('pointerover', () => retry.setScale(1.05));
    retry.on('pointerout', () => retry.setScale(1));
    retry.on('pointerdown', () => {
      this.scene.start('GameScene');
      this.scene.start('HUDScene');
      this.scene.stop('GameOverScene');
    });
    this.add.text(360, 440, 'RETRY', {
      fontSize: '20px', fill: '#fff',
      fontFamily: 'monospace', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5);

    // Nút Menu
    const menu = this.add.image(600, 440, 'btn-play');
    menu.setDisplaySize(180, 72);
    menu.setInteractive({ useHandCursor: true });
    menu.on('pointerover', () => menu.setScale(1.05));
    menu.on('pointerout', () => menu.setScale(1));
    menu.on('pointerdown', () => {
      this.scene.start('MenuScene');
      this.scene.stop('GameOverScene');
    });
    this.add.text(600, 440, 'MENU', {
      fontSize: '20px', fill: '#fff',
      fontFamily: 'monospace', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5);

    this.cameras.main.fadeIn(400);
  }
}
