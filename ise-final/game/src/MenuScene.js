class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }); }

  create() {
    // Background
    this.add.image(480, 270, 'menu-bg').setDisplaySize(960, 540);

    // Title
    this.add.text(480, 160, 'ISE ONLINE', {
      fontSize: '52px',
      fill: '#ffd700',
      fontFamily: 'monospace',
      stroke: '#000',
      strokeThickness: 8
    }).setOrigin(0.5);

    // Nút PLAY
    const btn = this.add.image(480, 340, 'btn-play').setDisplaySize(260, 104);
    btn.setInteractive({ useHandCursor: true });
    btn.on('pointerover', () => btn.setScale(1.08));
    btn.on('pointerout',  () => btn.setScale(1.0));
    btn.on('pointerdown', () => {
      btn.setScale(0.95);
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.stop('MenuScene');
        this.scene.start('GameScene');
        this.scene.launch('HUDScene');
      });
    });

    this.cameras.main.fadeIn(400);
  }
}
