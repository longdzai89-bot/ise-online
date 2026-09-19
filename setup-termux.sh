#!/bin/bash
# ==================================================
# ISE Online - Setup script cho Termux
# Chạy: bash setup-termux.sh
# ==================================================

echo "=== ISE Online Setup ==="

# 1. Cài packages cần thiết
echo "[1/5] Cài packages..."
pkg update -y -q
pkg install -y git nodejs unzip zip 2>/dev/null

# 2. Clone hoặc setup repo
echo "[2/5] Setup project..."
PROJECT_DIR="$HOME/ise-online"

if [ ! -d "$PROJECT_DIR" ]; then
  echo "Tạo thư mục project..."
  mkdir -p "$PROJECT_DIR"
fi

cd "$PROJECT_DIR"

# 3. Copy file zip vào project (giả sử bạn đã download game.zip và kenney.zip)
echo "[3/5] Giải nén assets..."
echo "Đặt 2 file zip vào: $PROJECT_DIR/"
echo "  - game.zip"
echo "  - kenney_pixel-platformer.zip"
echo ""
read -p "Đã đặt 2 file zip chưa? (y/n): " ans
if [ "$ans" = "y" ]; then
  unzip -o game.zip -d /tmp/game_ui 2>/dev/null
  unzip -o kenney_pixel-platformer.zip -d /tmp/kenney 2>/dev/null
  echo "Giải nén xong!"
fi

# 4. Install npm packages
echo "[4/5] Install npm..."
npm install

# 5. Git setup
echo "[5/5] Git setup..."
read -p "Nhập GitHub username: " GH_USER
read -p "Nhập tên repo (vd: ise-online): " REPO_NAME

git init
git add .
git commit -m "Initial: ISE Online game"
git branch -M main
git remote add origin "https://github.com/$GH_USER/$REPO_NAME.git"

echo ""
echo "=== Setup xong! ==="
echo ""
echo "Bước tiếp theo:"
echo "  1. Tạo repo '$REPO_NAME' trên GitHub (public)"
echo "  2. Chạy: git push -u origin main"
echo "  3. Vào GitHub Actions -> chọn 'Build APK' -> Run workflow"
echo "  4. Download APK từ Artifacts khi build xong"
echo ""
echo "HOẶC chạy local:"
echo "  npx serve game -p 3000"
echo "  Mở browser: http://localhost:3000"
