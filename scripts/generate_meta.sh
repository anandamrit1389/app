APP_VERSION=$1

mkdir -p dist

echo "{\"version\": \"$APP_VERSION\"}" > dist/meta.json

echo "meta.json created with version: $APP_VERSION"s