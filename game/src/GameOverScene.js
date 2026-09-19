class GameOverScene extends Phaser.Scene {
  constructor() { super({ key: 'GameOverScene' }); }
  init(data) { this.finalScore = data.score || 0; }

  create() {
    this.add.image(480, 270, 'gameover').setDisplaySize(960, 540);

    this.add.text(480, 340, 'ĐIỂM: ' + this.finalScore, {
      fontSize: '32px', fill: '#fff', fontFamily: 'monospace',
      stroke: '#000', strokeThickness: 5
    }).setOrigin(0.5);

    // Retry
    const retry = this.add.image(340, 440, 'btn-hud').setDisplaySize(180, 72).setInteractive();
    retry.on('pointerover', () => retry.setTint(0xddffdd));
    retry.on('pointerout',  () => retry.clearTint());
    retry.on('pointerdown', () => {
      this.scene.stop('GameOverScene');
      this.scene.start('GameScene');
      this.scene.launch('HUDScene');
    });
    this.add.text(340, 440, 'THỬ LẠI', {
      fontSize: '18px', fill: '#fff', fontFamily: 'monospace', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5);

    // Menu
    const menu = this.add.image(620, 440, 'btn-play').setDisplaySize(180, 72).setInteractive();
    menu.on('pointerover', () => menu.setTint(0xddffdd));
    menu.on('pointerout',  () => menu.clearTint());
    menu.on('pointerdown', () => {
      this.scene.stop('GameOverScene');
      this.scene.start('MenuScene');
    });
    this.add.text(620, 440, 'MENU', {
      fontSize: '18px', fill: '#fff', fontFamily: 'monospace', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5);

    this.cameras.main.fadeIn(400);
  }
}
