#!/usr/bin/env bash

set -euo pipefail

IMAGE="pet-shop-frontend:latest"
ARCHIVE="pet-shop-frontend.tar.gz"

SERVER="root@109.122.247.171"
REMOTE_DIR="/opt/pet-shop-frontend"

echo "1. Building production image..."

docker buildx build \
  --platform linux/amd64 \
  --tag "$IMAGE" \
  --load \
  .

echo "2. Exporting image..."

docker save "$IMAGE" | gzip > "$ARCHIVE"

echo "3. Uploading image and Compose configuration..."

scp "$ARCHIVE" "$SERVER:/opt/$ARCHIVE"
scp compose.yml "$SERVER:$REMOTE_DIR/compose.yml"

echo "4. Deploying frontend..."

ssh "$SERVER" "
  set -e

  docker load -i /opt/$ARCHIVE

  cd $REMOTE_DIR

  docker compose config --quiet
  docker compose up -d --force-recreate --no-deps frontend

  docker compose ps

  echo 'Checking Docker networks...'
  docker inspect pet-shop-frontend \
    --format '{{range \$name, \$_ := .NetworkSettings.Networks}}{{println \$name}}{{end}}'

  echo 'Checking backend connectivity...'
  docker exec pet-shop-frontend node -e \"
    fetch('http://app:3000/api/landing/pet-types')
      .then(r => {
        console.log('Backend HTTP status:', r.status);
        if (!r.ok) process.exitCode = 1;
      })
      .catch(e => {
        console.error(e);
        process.exitCode = 1;
      })
  \"
"

echo "5. Cleaning up..."

rm -f "$ARCHIVE"

echo "Deployment completed successfully!"