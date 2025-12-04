# Cloudflare Pages Build Configuration

**Build command:** `sh build.sh`  
**Build output directory:** `dist`  
**Node version:** 20

## Why this custom build script?

Cloudflare Pages uses `npm ci` by default, which has a bug with optional dependencies on Linux. Our custom `build.sh` script:
1. Removes `package-lock.json`
2. Uses `npm install` instead (which handles optional deps correctly)
3. Runs the Vite build

This ensures the rollup Linux bindings install properly.
