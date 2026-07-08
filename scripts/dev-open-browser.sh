#!/usr/bin/env bash
# Opens http://localhost:3000 once the dev server is listening — but only if no
# browser already has a tab open there, so restarting `bun run dev` doesn't pile
# up duplicate tabs.
#
# macOS only. Querying a browser's tabs needs a one-time "Automation" permission
# per browser (macOS will prompt the first time). If a browser can't be queried
# (permission denied, or a non-scriptable browser like Firefox), it safely falls
# back to just opening the URL.

URL="http://localhost:3000"
NEEDLE="localhost:3000"

# Wait until the dev server is actually accepting connections on the port.
until nc -z localhost 3000 2>/dev/null; do sleep 0.5; done

# True (0) when any running, scriptable browser already has a localhost:3000 tab.
is_open_in_browsers() {
  local app urls
  for app in "Google Chrome" "Brave Browser" "Microsoft Edge" "Arc" "Vivaldi" "Safari"; do
    # Skip apps that aren't running — referencing tabs would otherwise launch them.
    [ "$(osascript -e "application \"$app\" is running" 2>/dev/null)" = "true" ] || continue

    urls=$(osascript 2>/dev/null <<APPLESCRIPT
tell application "$app"
  set out to ""
  try
    repeat with w in windows
      repeat with t in tabs of w
        set out to out & (URL of t) & linefeed
      end repeat
    end repeat
  end try
  return out
end tell
APPLESCRIPT
)
    if printf '%s' "$urls" | grep -q "$NEEDLE"; then
      return 0
    fi
  done
  return 1
}

if is_open_in_browsers; then
  echo "→ localhost:3000 already open in a browser; not opening a new tab."
else
  open "$URL"
fi
