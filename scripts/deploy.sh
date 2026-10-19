#!/usr/bin/env bash

set -euo pipefail

IMAGE="pet-shop-frontend:latest"
ARCHIVE="pet-shop-frontend.tar.gz"
SERVER="root@109.122.247.171"
REMOTE_DIR="/opt/pet-shop-frontend"

echo "1. Building production Docker image..."

docker buildx build \
  --platform linux/amd64 \
  --tag "$IMAGE" \
  --load \
  .

echo "2. Exporting Docker image..."

docker save "$IMAGE" | gzip > "$ARCHIVE"

echo "3. Uploading image to VPS..."

scp "$ARCHIVE" "$SERVER:/opt/$ARCHIVE"

echo "4. Deploying on VPS..."

ssh "$SERVER" "
  set -e
  docker load -i /opt/$ARCHIVE
  cd $REMOTE_DIR
  docker compose up -d --force-recreate --no-deps frontend
  docker compose ps
"

echo "5. Cleaning up local archive..."

rm -f "$ARCHIVE"

echo "Deployment finished!"