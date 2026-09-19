class LevelCompleteScene extends Phaser.Scene {
  constructor() { super({ key: 'LevelCompleteScene' }); }

  init(data) {
    this.finalScore = data.score || 0;
    this.finalCoins = data.coins || 0;
  }

  create() {
    const bg = this.add.image(480, 270, 'levelcomplete');
    bg.setDisplaySize(960, 540);

    this.add.text(480, 360, 'SCORE: ' + this.finalScore, {
      fontSize: '28px', fill: '#ffffff',
      fontFamily: 'monospace', stroke: '#000', strokeThickness: 5
    }).setOrigin(0.5);

    this.add.text(480, 400, 'COINS: ' + this.finalCoins, {
      fontSize: '22px', fill: '#ffd700',
      fontFamily: 'monospace', stroke: '#000', strokeThickness: 4
    }).setOrigin(0.5);

    const nextBtn = this.add.image(480, 460, 'btn-play');
    nextBtn.setDisplaySize(200, 80);
    nextBtn.setInteractive({ useHandCursor: true });
    nextBtn.on('pointerover', () => nextBtn.setScale(1.05));
    nextBtn.on('pointerout', () => nextBtn.setScale(1));
    nextBtn.on('pointerdown', () => {
      // Level tiếp theo - hiện tại quay lại menu
      this.scene.start('MenuScene');
    });
    this.add.text(480, 460, 'NEXT', {
      fontSize: '22px', fill: '#fff',
      fontFamily: 'monospace', stroke: '#000', strokeThickness: 3
    }).setOrigin(0.5);

    this.cameras.main.fadeIn(500);
  }
}
