---
description: How to deploy the Next.js application to Cloudflare Pages
---

# Deploying to Cloudflare Pages

This guide explains how to deploy your Watch Footy application to Cloudflare Pages using the `@cloudflare/next-on-pages` adapter.

## Prerequisites

1.  A Cloudflare account.
2.  A GitHub account (to connect the repository).

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

### 4. Environment Variables (Optional)

If you have any environment variables (e.g., API keys), add them in the **Environment variables** section.
For this project, the API URL is hardcoded in `src/lib/api.ts`, so no variables are strictly needed unless you added some.

### 5. Deploy

Click **Save and Deploy**. Cloudflare will clone your repo, install dependencies, build the project using the adapter, and deploy it to the edge.

## Troubleshooting

-   **Dependency Conflicts**: If you see errors like `ERESOLVE could not resolve` or peer dependency issues, you can try setting an environment variable in Cloudflare Pages:
    -   **Variable name**: `NPM_FLAGS`
    -   **Value**: `--legacy-peer-deps`
    This forces the installer to ignore peer dependency conflicts.

-   **Node.js Compatibility**: If you encounter errors related to Node.js APIs, ensure you are not using server-only modules that are unsupported on the Edge. The `next-on-pages` adapter handles most standard cases.
-   **Image Optimization**: Next.js Image Optimization (`<Image />`) works differently on Cloudflare. You might need to disable it or use a custom loader if images fail to load. In this project, we used standard `<img>` tags for simplicity, so it should work fine.
