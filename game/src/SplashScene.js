class SplashScene extends Phaser.Scene {
  constructor() { super({ key: 'SplashScene' }); }

  preload() {
    // UI assets
    this.load.image('splash',        'assets/images/splash.png');
    this.load.image('menu-bg',       'assets/images/menu-bg.png');
    this.load.image('btn-play',      'assets/images/btn-play.png');
    this.load.image('btn-hud',       'assets/images/btn-hud.png');
    this.load.image('gameover',      'assets/images/gameover.png');
    this.load.image('levelcomplete', 'assets/images/levelcomplete.png');
    this.load.image('hud-heart',     'assets/images/hud-heart.png');
    this.load.image('hud-coin',      'assets/images/hud-coin.png');

    // Tileset: load là IMAGE để tilemap dùng được
    this.load.image('tiles',      'assets/images/tilemap_packed.png');
    this.load.image('characters', 'assets/images/tilemap-characters_packed.png');

    // Spritesheet riêng cho player/enemy animation (key khác)
    this.load.spritesheet('char-sheet', 'assets/images/tilemap-characters_packed.png', {
      frameWidth: 24, frameHeight: 24
    });

    // Tilemap JSON
    this.load.tilemapTiledJSON('level1', 'assets/tilemap/level1.json');

    // Loading bar
    const bg  = this.add.rectangle(480, 270, 400, 10, 0x1a0a2e);
    const bar = this.add.rectangle(480, 270, 0,   10, 0x4ade80);
    this.load.on('progress', v => { bar.width = 400 * v; });
  }

  create() {
    this.add.image(480, 270, 'splash').setDisplaySize(960, 540);
    this.time.delayedCall(1500, () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('MenuScene');
      });
    });
  }
}
