# GitHub Pages Deployment

This app is ready to deploy to GitHub Pages as a static site.

## Automatic Deployment

The repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to `main`.

### Setup Steps:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for GitHub Pages deployment"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - The workflow will automatically run and deploy

3. **Access your site:**
   - Once deployed, your site will be available at:
   - `https://<your-username>.github.io/tape-measure-calc/`

**Important:** If you rename the repository or deploy to a custom domain, update the `base` path in `vite.config.ts`:
- For `username.github.io/repo-name/` → set `base: '/repo-name/'`
- For custom domain or `username.github.io` → set `base: '/'`

## Manual Deployment

To build and preview locally before deploying:

```bash
# Build static files
npm run build

# Preview the build locally
npm run preview
```

The built files will be in `dist/` directory.

## How it works

- The app is entirely client-side (no backend required)
- All calculator and interval logic runs in the browser
- The GitHub Actions workflow builds the Vite project and deploys to GitHub Pages
- Uses hash-based routing (URLs like `#/intervals`) for reliable client-side routing on GitHub Pages

## Local Development

For local development with the dev server:

```bash
npm run dev
```

This runs the Vite dev server on port 5173 (default Vite port).
