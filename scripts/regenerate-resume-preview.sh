#!/bin/bash
# Regenerates assets/img/resume-preview.jpg from assets/Cesar Vaca Resume.pdf.
#
# Run this by hand any time after editing the résumé PDF, or just let the
# pre-commit hook (.githooks/pre-commit) call it automatically when the PDF
# is part of a commit.
#
# macOS-only: relies on qlmanage (Quick Look) and sips, both built in.
set -euo pipefail

cd "$(dirname "$0")/.."

PDF="assets/Cesar Vaca Resume.pdf"
OUT="assets/img/resume-preview.jpg"

if [ ! -f "$PDF" ]; then
  echo "error: \"$PDF\" not found" >&2
  exit 1
fi

if ! command -v /usr/bin/qlmanage >/dev/null || ! command -v /usr/bin/sips >/dev/null; then
  echo "error: this script needs qlmanage and sips, which only exist on macOS" >&2
  exit 1
fi

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

echo "Rendering \"$PDF\"..."
/usr/bin/qlmanage -t -s 6000 -o "$TMP_DIR" "$PDF" >/dev/null

RENDERED="$TMP_DIR/$(basename "$PDF").png"
if [ ! -f "$RENDERED" ]; then
  echo "error: qlmanage did not produce a thumbnail" >&2
  exit 1
fi

# 4139px on the long edge (~376 DPI for an 8.5in-wide US Letter page),
# JPEG quality 96 -- see CLAUDE.md for the history: 1600px/q65 was
# visibly blurry, 2400px/q92 was clean at normal viewing but still
# short of matching the PDF at native resolution under close
# inspection; 4139px/q96 was confirmed indistinguishable from a
# lossless PNG at the same resolution via pixel-level crop comparison.
/usr/bin/sips -Z 4139 -s format jpeg -s formatOptions 96 "$RENDERED" --out "$OUT" >/dev/null

WIDTH=$(/usr/bin/sips -g pixelWidth "$OUT" | awk '/pixelWidth/ {print $2}')
HEIGHT=$(/usr/bin/sips -g pixelHeight "$OUT" | awk '/pixelHeight/ {print $2}')

echo "Wrote $OUT (${WIDTH}x${HEIGHT})"

# resume.html hardcodes width/height attributes on .resume-embed for
# layout stability. Flag it if the page's proportions changed enough to
# throw those off (e.g. the résumé grew a second page or changed paper
# size) -- this script has no way to edit that HTML for you.
EXPECTED_WIDTH=3198
EXPECTED_HEIGHT=4139
if [ "$WIDTH" != "$EXPECTED_WIDTH" ] || [ "$HEIGHT" != "$EXPECTED_HEIGHT" ]; then
  echo "note: dimensions changed from ${EXPECTED_WIDTH}x${EXPECTED_HEIGHT} to ${WIDTH}x${HEIGHT} -- update the width/height attributes on .resume-embed in resume.html to match" >&2
fi
