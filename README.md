# ISE Online - Pixel Platformer

Game platformer ngang dùng Phaser 3 + Capacitor → Android APK

## Cấu trúc

```
ise-online/
├── game/                        ← Web game (Phaser 3)
│   ├── index.html
│   ├── src/
│   │   ├── main.js              ← Config Phaser
│   │   ├── SplashScene.js       ← Màn chờ + load assets
│   │   ├── MenuScene.js         ← Menu chính
│   │   ├── GameScene.js         ← Game chính
│   │   ├── HUDScene.js          ← HUD tim/coin/nút pause
│   │   ├── GameOverScene.js     ← Thua
│   │   └── LevelCompleteScene.js← Thắng
│   └── assets/
│       ├── images/              ← Tất cả PNG
│       └── tilemap/             ← level1.json + tsx
├── .github/workflows/
│   └── build-apk.yml            ← Auto build APK
├── capacitor.config.json
├── package.json
└── setup-termux.sh              ← Script setup Termux
```

## Cách dùng trên Termux

```bash
# Bước 1: Copy project vào Termux
cp -r /sdcard/Download/ise-online ~/ise-online
cd ~/ise-online

# Bước 2: Giải nén 2 file asset
unzip /sdcard/Download/game.zip -d /tmp/game_ui
unzip /sdcard/Download/kenney_pixel-platformer.zip -d /tmp/kenney

# Copy assets
cp /tmp/game_ui/game/*.png game/assets/images/
# (rename theo đúng tên trong SplashScene.js)

# Bước 3: Install
npm install

# Bước 4: Test local
npx serve game -p 3000
# Mở Chrome: http://localhost:3000

# Bước 5: Push GitHub
git init
git add .
git commit -m "ISE Online v1"
git remote add origin https://github.com/USERNAME/ise-online.git
git push -u origin main

# Bước 6: GitHub Actions tự build APK
# Vào: github.com/USERNAME/ise-online/actions
# Download APK từ Artifacts
```

## Controls

| Bàn phím | Cảm ứng |
|---|---|
| ← → di chuyển | Chạm vùng trái/phải |
| ↑ hoặc W nhảy | Chạm vùng phải cùng |
| ESC pause | Nút pause góc phải trên |

## Assets sử dụng

| File | Dùng cho |
|---|---|
| splash.png | Màn chờ |
| menu-bg.png | Nền menu |
| btn-play.png | Nút PLAY / NEXT |
| btn-hud.png | Nút Pause/Resume/Retry/Home |
| hud-heart.png | Icon tim HP |
| hud-coin.png | Icon coin |
| gameover.png | Màn Game Over |
| levelcomplete.png | Màn Level Clear |
| tilemap_packed.png | Tiles đất/platform |
| tilemap-characters_packed.png | Nhân vật + kẻ địch |
