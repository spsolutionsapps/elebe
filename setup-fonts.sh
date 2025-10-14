#!/usr/bin/env sh

set -eu

# Paths
REPO_ROOT="$(dirname "$0")"
SRC_DIR="$REPO_ROOT/fonts para convertir"
PUBLIC_DIR_LOCAL="$REPO_ROOT/frontend/public/fonts"
FRONTEND_CONTAINER="lb-premium-frontend"
PUBLIC_DIR_CONTAINER="/app/public/fonts"

# Expected source filenames (as present in SRC_DIR)
SRC_BOOK="Gotham-Book.otf"
SRC_MEDIUM="Gotham-Medium.otf"
SRC_BLACK_ITALIC="Gotham Black Italic.otf"

# Target filenames (as referenced by CSS)
TGT_BOOK="GothamBook.otf"
TGT_MEDIUM="GothamMedium.otf"
TGT_BLACK_ITALIC="GothamBlackItalic.otf"

echo "==> Setting up Gotham fonts"

# 1) Validate source fonts directory
if [ ! -d "$SRC_DIR" ]; then
  echo "ERROR: Source directory not found: $SRC_DIR" >&2
  exit 1
fi

# 2) Ensure local public/fonts directory exists
mkdir -p "$PUBLIC_DIR_LOCAL"

# 3) Copy/rename fonts locally
set -- \
  "$SRC_BOOK" "$TGT_BOOK" \
  "$SRC_MEDIUM" "$TGT_MEDIUM" \
  "$SRC_BLACK_ITALIC" "$TGT_BLACK_ITALIC"

while [ $# -gt 0 ]; do
  SRC_NAME="$1"
  TGT_NAME="$2"
  shift 2

  SRC_PATH="$SRC_DIR/$SRC_NAME"
  TGT_PATH="$PUBLIC_DIR_LOCAL/$TGT_NAME"

  if [ ! -f "$SRC_PATH" ]; then
    echo "WARNING: Missing source font: $SRC_PATH (skipping)" >&2
    continue
  fi

  cp "$SRC_PATH" "$TGT_PATH"
  echo "Copied: $SRC_NAME -> $TGT_NAME"
done

echo "Local fonts placed in: $PUBLIC_DIR_LOCAL"

# 4) If frontend container is running, copy into container as well
if docker ps --format '{{.Names}}' | grep -qx "$FRONTEND_CONTAINER"; then
  echo "==> Frontend container detected: $FRONTEND_CONTAINER"
  docker exec "$FRONTEND_CONTAINER" mkdir -p "$PUBLIC_DIR_CONTAINER"

  for TGT_NAME in "$TGT_BOOK" "$TGT_MEDIUM" "$TGT_BLACK_ITALIC"; do
    LOCAL_PATH="$PUBLIC_DIR_LOCAL/$TGT_NAME"
    if [ -f "$LOCAL_PATH" ]; then
      docker cp "$LOCAL_PATH" "$FRONTEND_CONTAINER:$PUBLIC_DIR_CONTAINER/"
      echo "Copied into container: $TGT_NAME"
    else
      echo "WARNING: Local font not found to copy into container: $LOCAL_PATH" >&2
    fi
  done

  echo "Container fonts placed in: $FRONTEND_CONTAINER:$PUBLIC_DIR_CONTAINER"
else
  echo "NOTE: Frontend container '$FRONTEND_CONTAINER' not running. Skipping container copy."
fi

echo "==> Done."


