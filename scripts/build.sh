#!/usr/bin/env sh
set -eu

UPSTREAM_SHA="4e758db17e10715aafcdfb98e6741b292631c300"
WORK_DIR=".build"
ARCHIVE="$WORK_DIR/excalidraw.tar.gz"
SRC_DIR="$WORK_DIR/excalidraw-$UPSTREAM_SHA"

rm -rf "$WORK_DIR" dist
mkdir -p "$WORK_DIR" dist

echo "[ITJK Draw] Downloading Excalidraw $UPSTREAM_SHA..."
curl -fsSL --retry 3 --retry-delay 2 \
  "https://github.com/excalidraw/excalidraw/archive/$UPSTREAM_SHA.tar.gz" \
  -o "$ARCHIVE"

tar -xzf "$ARCHIVE" -C "$WORK_DIR"

node scripts/apply-branding.mjs "$SRC_DIR"

cp overrides/AppMainMenu.tsx "$SRC_DIR/excalidraw-app/components/AppMainMenu.tsx"
cp overrides/AppWelcomeScreen.tsx "$SRC_DIR/excalidraw-app/components/AppWelcomeScreen.tsx"
cp overrides/ExcalidrawPlusPromoBanner.tsx "$SRC_DIR/excalidraw-app/components/ExcalidrawPlusPromoBanner.tsx"

cd "$SRC_DIR"
export HUSKY=0
export VITE_APP_DISABLE_SENTRY=true
export VITE_APP_ENABLE_TRACKING=false

echo "[ITJK Draw] Installing dependencies..."
npx --yes yarn@1.22.22 install --frozen-lockfile --non-interactive

echo "[ITJK Draw] Building static app..."
npx --yes yarn@1.22.22 --cwd ./excalidraw-app build:app:docker

cd - >/dev/null
cp -R "$SRC_DIR/excalidraw-app/build/." dist/
cp LICENSE dist/LICENSE.txt

echo "[ITJK Draw] Build completed: dist/"
