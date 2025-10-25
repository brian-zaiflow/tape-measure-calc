# PWA Icons Setup

The app needs two icon sizes for PWA functionality:
- `pwa-192x192.png` (192×192 pixels)
- `pwa-512x512.png` (512×512 pixels)

## Option 1: Use an Online PWA Icon Generator

1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload your logo or design
3. Download the generated icons
4. Place `pwa-192x192.png` and `pwa-512x512.png` in `client/public/`

## Option 2: Create from Existing Favicon

If you have image editing software:

1. Open `client/public/favicon.png`
2. Resize to 192×192 pixels
3. Save as `client/public/pwa-192x192.png`
4. Resize to 512×512 pixels
5. Save as `client/public/pwa-512x512.png`

## Option 3: Quick Placeholder Icons

For testing, you can create simple colored square icons:
- Background: A solid color (e.g., blue #2563eb)
- Text/Icon: White ruler or measuring tape icon
- Or just white text "TAPE" or "📏"

Place the icons in `client/public/` and they'll be automatically included in the build.

## Recommended Design

For a tape measure calculator app, consider:
- Icon showing a measuring tape or ruler
- Professional tool aesthetic (not playful)
- High contrast for visibility
- Simple design that works at small sizes
