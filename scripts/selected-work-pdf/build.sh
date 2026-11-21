#!/bin/sh
# Rebuilds public/pooya-selected-work.pdf from selected-work.html with headless Chrome.
# Slides are 1280x720 (see @page in the HTML). Images come from public/work and public/people;
# they are recompressed to JPEG first (Chrome would embed the WebP files losslessly, about 9 MB).
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
cp "$DIR/selected-work.html" "$TMP/selected-work.html"
grep -o '\.\./\.\./public/[a-z/0-9-]*\.webp' "$DIR/selected-work.html" | sort -u | while read -r p; do
  jpg="img/$(basename "$p" .webp).jpg"
  mkdir -p "$TMP/img"
  sips -s format jpeg -s formatOptions "${JPEG_QUALITY:-55}" "$DIR/$p" --out "$TMP/$jpg" >/dev/null
  sed -i '' "s#$p#$jpg#g" "$TMP/selected-work.html"
done
"$CHROME" --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$DIR/../../public/pooya-selected-work.pdf" \
  "file://$TMP/selected-work.html" 2>&1 | grep -v CVDisplayLink
ls -l "$DIR/../../public/pooya-selected-work.pdf"
