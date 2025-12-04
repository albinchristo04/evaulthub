#!/bin/sh
# Cloudflare Pages build script
# This fixes the npm ci optional dependencies issue

echo "Removing package-lock.json to force npm install..."
rm -f package-lock.json

echo "Installing dependencies with npm install..."
npm install

echo "Building the project..."
npm run build
