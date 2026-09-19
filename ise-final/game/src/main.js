const config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  backgroundColor: '#1a0a2e',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 600 }, debug: false }
  },
  scene: [SplashScene, MenuScene, GameScene, HUDScene, GameOverScene, LevelCompleteScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    orientation: Phaser.Scale.LANDSCAPE
  },
  input: { activePointers: 3 }
};
const game = new Phaser.Game(config);
