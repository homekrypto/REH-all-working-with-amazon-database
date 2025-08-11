#!/bin/bash

# Theme Switcher for Real Estate Website
# Usage: ./switch-theme.sh [restored|modern|premium]

WORKSPACE_PATH="/Users/michalbabula/Documents/global real estate downoldad project from z.ai/workspace-e1b36331-74d3-4ab3-89fd-7d4b4f18ed53"
GLOBALS_CSS="$WORKSPACE_PATH/src/app/globals.css"
RESTORED_THEME="$WORKSPACE_PATH/src/app/globals-restored.css"
MODERN_THEME="$WORKSPACE_PATH/src/app/globals-modern-theme.css"
PREMIUM_THEME="$WORKSPACE_PATH/src/app/globals-premium-backup.css"

if [ "$1" = "modern" ]; then
    echo "🎨 Switching to Modern Theme..."
    cp "$MODERN_THEME" "$GLOBALS_CSS"
    echo "✅ Modern theme applied!"
    echo "🌟 Features: Warm orange/amber colors, enhanced animations, glass effects"
elif [ "$1" = "restored" ]; then
    echo "🎨 Switching to Restored Theme..."
    cp "$RESTORED_THEME" "$GLOBALS_CSS"
    echo "✅ Restored theme applied!"
    echo "🎯 Features: Blue/gray color scheme, complete real estate components"
elif [ "$1" = "premium" ]; then
    echo "🎨 Switching to Premium Theme..."
    cp "$PREMIUM_THEME" "$GLOBALS_CSS"
    echo "✅ Premium theme applied!"
    echo "💎 Features: Luxury design, deep blue & gold accents, premium animations, glass effects"
else
    echo "🎨 Real Estate Website Theme Switcher"
    echo ""
    echo "Available themes:"
    echo "  premium  - Luxury premium theme with deep blue & gold (CURRENT)"
    echo "  restored - Complete blue/gray theme with all components"
    echo "  modern   - Modern warm orange theme with enhanced effects"
    echo ""
    echo "Usage: ./switch-theme.sh [premium|restored|modern]"
    echo ""
    echo "Current theme: Premium (luxury design inspired by high-end real estate sites)"
fi
