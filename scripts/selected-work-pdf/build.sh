#!/bin/sh
# Rebuilds public/pooya-selected-work.pdf from selected-work.html with headless Chrome.
# Slides are 1280x720 (see @page in the HTML). Fonts and JPEG images are local (fonts/, img/), paths relative.
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
"$CHROME" --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$DIR/../../public/pooya-selected-work.pdf" \
  "file://$DIR/selected-work.html" 2>&1 | grep -v CVDisplayLink || true
ls -l "$DIR/../../public/pooya-selected-work.pdf"
