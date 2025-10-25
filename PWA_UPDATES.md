# PWA Update Mechanism

This document explains how the Tape Measure Calculator handles updates when you deploy new versions via GitHub Actions.

## How It Works

### 1. Detection
When you push changes and GitHub Actions deploys them:
- Users who have the app open will have their service worker check for updates
- The service worker automatically checks every **60 minutes**
- When a new version is detected, the update flow begins

### 2. User Notification
A notification card appears in the **bottom-right corner** with:
- **"New version available!"** heading
- Description: "Click reload to update to the latest version"
- **Reload button** (with refresh icon)
- **Close button** to dismiss

### 3. Update Process
When user clicks "Reload":
- New service worker activates
- Page automatically refreshes
- User sees the latest version
- All cached assets are updated

### 4. Offline Support
First-time notification also appears when app becomes ready for offline use:
- **"App ready to work offline"** heading
- Confirms the app can now work without internet

## Configuration Details

### Service Worker Settings (`vite.config.ts`)
```typescript
VitePWA({
  registerType: 'prompt',  // Show update prompt instead of auto-updating
  devOptions: {
    enabled: true,          // Enable PWA in development for testing
    type: 'module',
  },
  workbox: {
    cleanupOutdatedCaches: true,  // Clean old caches on update
    skipWaiting: false,            // Don't force update without user consent
    clientsClaim: true,            // Take control of clients immediately
  }
})
```

### Update Check Interval
The service worker checks for updates every **60 minutes** (3600000ms).

This is configured in `client/src/hooks/useRegisterSW.ts`:
```typescript
onRegistered(r) {
  r && setInterval(() => {
    r.update();
  }, 60 * 60 * 1000); // 60 minutes
}
```

You can adjust this interval as needed:
- **30 minutes**: `30 * 60 * 1000`
- **2 hours**: `2 * 60 * 60 * 1000`
- **Daily**: `24 * 60 * 60 * 1000`

## Testing Updates

### In Development
1. Start dev server: `npm run dev`
2. Make changes to the code
3. Save and rebuild
4. The update prompt should appear

### In Production
1. Deploy changes via GitHub Actions
2. Wait up to 60 minutes (or reload page to check immediately)
3. Update notification will appear for users who have the app open

### Manual Testing
To force an update check:
1. Open DevTools → Application → Service Workers
2. Click "Update" next to your service worker
3. The update prompt should appear if a new version exists

## User Experience

### Good UX Features
✓ Non-intrusive notification in corner
✓ User controls when to update
✓ One-click update process
✓ Clear messaging about what's happening
✓ Can dismiss and update later

### What Happens If User Ignores Update?
- Notification stays visible until dismissed
- User can continue using current version
- Next time they reload the page naturally, they'll get the update
- No forced interruptions to their work

## Troubleshooting

### Users Not Seeing Updates
1. Check that service worker is registered (DevTools → Application → Service Workers)
2. Verify new version deployed successfully on GitHub Pages
3. Try hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
4. Clear cache and reload

### Update Prompt Not Appearing
1. Verify `registerType: 'prompt'` in `vite.config.ts`
2. Check browser console for errors
3. Ensure `ReloadPrompt` component is rendered in `App.tsx`
4. Verify virtual module types are loaded (`vite-env.d.ts`)

### Service Worker Issues
1. Unregister old service workers in DevTools
2. Clear all site data
3. Rebuild and redeploy: `npm run build`
4. Check workbox configuration in `vite.config.ts`

## File Reference

- **Configuration**: `vite.config.ts`
- **Update Hook**: `client/src/hooks/useRegisterSW.ts`
- **UI Component**: `client/src/components/ReloadPrompt.tsx`
- **Integration**: `client/src/App.tsx`
- **Type Definitions**: `client/src/vite-env.d.ts`
