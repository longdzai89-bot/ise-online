class SplashScene extends Phaser.Scene {
  constructor() { super({ key: 'SplashScene' }); }

  preload() {
    this.load.image('splash', 'assets/images/splash.png');
    this.load.image('menu-bg', 'assets/images/menu-bg.png');
    this.load.image('icon', 'assets/images/icon.png');
    this.load.image('btn-play', 'assets/images/btn-play.png');
    this.load.image('btn-hud', 'assets/images/btn-hud.png');
    this.load.image('gameover', 'assets/images/gameover.png');
    this.load.image('levelcomplete', 'assets/images/levelcomplete.png');
    this.load.image('hud-heart', 'assets/images/hud-heart.png');
    this.load.image('hud-coin', 'assets/images/hud-coin.png');
    this.load.image('font-hud', 'assets/images/font-hud.png');

    // Tileset tiles: 18x18, spacing=1 giữa các ô
    this.load.spritesheet('tiles', 'assets/images/tilemap_packed.png', {
      frameWidth: 18,
      frameHeight: 18,
      spacing: 1
    });

    // Tileset characters: 24x24, không spacing
    this.load.spritesheet('characters', 'assets/images/tilemap-characters_packed.png', {
      frameWidth: 24,
      frameHeight: 24
    });

    // Background tileset (nếu dùng)
    this.load.image('backgrounds', 'assets/images/tilemap-backgrounds_packed.png');

    // Tilemap JSON đã fix
    this.load.tilemapTiledJSON('level1', 'assets/tilemap/level1.json');

    // Loading bar
    const bg  = this.add.rectangle(480, 300, 400, 8, 0x1e3a2e).setDepth(0);
    const bar = this.add.rectangle(480, 300, 0,   8, 0x4ade80).setDepth(1);
    this.load.on('progress', (v) => { bar.width = 400 * v; });

    this.load.on('loaderror', (file) => {
      console.error('[SplashScene] Load error:', file.key, file.src);
    });
  }

  create() {
    const splash = this.add.image(480, 270, 'splash').setDisplaySize(960, 540);
    this.time.delayedCall(1800, () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('MenuScene');
      });
    });
  }
}
