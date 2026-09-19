class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }); }

  create() {
    const bg = this.add.image(480, 270, 'menu-bg');
    bg.setDisplaySize(960, 540);

    // Nút PLAY - dùng ảnh btn-play, đặt giữa màn hình
    const btn = this.add.image(480, 320, 'btn-play');
    btn.setDisplaySize(280, 112);
    btn.setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setScale(1.05));
    btn.on('pointerout', () => btn.setScale(1.0));
    btn.on('pointerdown', () => {
      this.cameras.main.fadeOut(300, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('GameScene');
        this.scene.start('HUDScene');
      });
    });

    this.cameras.main.fadeIn(400);
  }
}
