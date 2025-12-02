---
description: How to deploy the Next.js application to Cloudflare Pages
---

# Deploying to Cloudflare Pages

This guide explains how to deploy your Watch Footy application to Cloudflare Pages using the `@cloudflare/next-on-pages` adapter.

## Prerequisites

1.  A Cloudflare account.
2.  A GitHub account (to connect the repository).

## Important: Version Compatibility

This project uses **Next.js 15.0.3** (downgraded from 16.x) to ensure compatibility with `@cloudflare/next-on-pages`. The lock file has been updated and committed.

## Steps

### 1. Push Code to GitHub

Ensure your code is pushed to a GitHub repository.

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Create a Project in Cloudflare Pages

1.  Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2.  Go to **Workers & Pages** > **Create Application** > **Pages** > **Connect to Git**.
3.  Select your GitHub repository (`evaulthub`).
4.  Click **Begin setup**.

### 3. Configure Build Settings

In the "Set up builds and deployments" section, configure the following:

-   **Framework preset**: `Next.js`
-   **Build command**: `npx @cloudflare/next-on-pages`
-   **Build output directory**: `.vercel/output/static`

> **Note**: Do NOT use the default `next build` command. We must use `npx @cloudflare/next-on-pages` to adapt the App Router for Cloudflare.

### 4. Add Environment Variable (Required)

Add this environment variable to handle the legacy peer dependencies:

-   **Variable name**: `NPM_FLAGS`
-   **Value**: `--legacy-peer-deps`

This is required because `@cloudflare/next-on-pages` has peer dependency requirements.

### 5. Deploy

Click **Save and Deploy**. Cloudflare will clone your repo, install dependencies, build the project using the adapter, and deploy it to the edge.

## Troubleshooting

-   **Package Lock Sync Errors**: If you see `npm ci` errors about missing packages, ensure your `package-lock.json` is committed and up to date. Run `npm install` locally and commit the updated lock file.

-   **Node.js Compatibility**: If you encounter errors related to Node.js APIs, ensure you are not using server-only modules that are unsupported on the Edge. The `next-on-pages` adapter handles most standard cases.
-   **Image Optimization**: Next.js Image Optimization (`<Image />`) works differently on Cloudflare. You might need to disable it or use a custom loader if images fail to load. In this project, we used standard `<img>` tags for simplicity, so it should work fine.
