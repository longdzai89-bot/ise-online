class LevelCompleteScene extends Phaser.Scene {
  constructor() { super({ key: 'LevelCompleteScene' }); }
  init(data) { this.finalScore = data.score || 0; this.finalCoins = data.coins || 0; }

  create() {
    this.add.image(480, 270, 'levelcomplete').setDisplaySize(960, 540);

    this.add.text(480, 340, 'ĐIỂM: ' + this.finalScore, {
      fontSize: '32px', fill: '#fff', fontFamily: 'monospace',
      stroke: '#000', strokeThickness: 5
    }).setOrigin(0.5);

    this.add.text(480, 385, 'COINS: ' + this.finalCoins, {
      fontSize: '24px', fill: '#ffd700', fontFamily: 'monospace',
      stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);

    const nextBtn = this.add.image(480, 455, 'btn-play').setDisplaySize(200, 80).setInteractive();
    nextBtn.on('pointerover', () => nextBtn.setScale(1.07));
    nextBtn.on('pointerout',  () => nextBtn.setScale(1));
    nextBtn.on('pointerdown', () => {
      this.scene.stop('LevelCompleteScene');
      this.scene.start('MenuScene');
    });
    this.add.text(480, 455, 'TIẾP', {
      fontSize: '22px', fill: '#fff', fontFamily: 'monospace', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5);

    this.cameras.main.fadeIn(500);
  }
}
