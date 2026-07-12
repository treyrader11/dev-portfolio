#!/usr/bin/env bash
# Opens http://localhost:3000 once the dev server is listening. If a browser
# already has a tab open there, that tab is RELOADED instead of opening a new
# one — so restarting `bun run dev` refreshes the page without piling up tabs.
#
# macOS only. Querying/controlling a browser's tabs needs a one-time "Automation"
# permission per browser (macOS prompts the first time). If a browser can't be
# scripted (permission denied, or a non-scriptable browser like Firefox), it
# safely falls back to just opening the URL.

URL="http://localhost:3000"
NEEDLE="localhost:3000"

# Wait until the dev server is actually accepting connections on the port.
until nc -z localhost 3000 2>/dev/null; do sleep 0.5; done

# Reload any existing localhost:3000 tabs in running, scriptable browsers.
# AppleScript prints "true" when at least one tab was reloaded; the function
# returns 0 (success) if any browser reloaded a matching tab.
reload_open_tabs() {
  local app result found=1

  # Chromium-family browsers share the same scripting dictionary (tab `reload`).
  for app in "Google Chrome" "Brave Browser" "Microsoft Edge" "Arc" "Vivaldi"; do
    # Skip apps that aren't running — referencing tabs would otherwise launch them.
    [ "$(osascript -e "application \"$app\" is running" 2>/dev/null)" = "true" ] || continue

    result=$(osascript 2>/dev/null <<APPLESCRIPT
tell application "$app"
  set didReload to false
  try
    repeat with w in windows
      repeat with t in tabs of w
        if (URL of t) contains "$NEEDLE" then
          tell t to reload
          set didReload to true
        end if
      end repeat
    end repeat
  end try
  return didReload
end tell
APPLESCRIPT
)
    [ "$result" = "true" ] && found=0
  done

  # Safari uses a different reload idiom (re-set the tab's URL to itself).
  if [ "$(osascript -e 'application "Safari" is running' 2>/dev/null)" = "true" ]; then
    result=$(osascript 2>/dev/null <<APPLESCRIPT
tell application "Safari"
  set didReload to false
  try
    repeat with w in windows
      repeat with t in tabs of w
        if (URL of t) contains "$NEEDLE" then
          set URL of t to (URL of t)
          set didReload to true
        end if
      end repeat
    end repeat
  end try
  return didReload
end tell
APPLESCRIPT
)
    [ "$result" = "true" ] && found=0
  fi

  return $found
}

if reload_open_tabs; then
  echo "→ Reloaded existing localhost:3000 tab(s)."
else
  echo "→ Opening localhost:3000 in a new tab."
  open "$URL"
fi
