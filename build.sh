#!/bin/sh
# Cloudflare Pages build script
# This fixes the npm ci optional dependencies issue

echo "Cleaning up previous builds..."
rm -rf node_modules package-lock.json

echo "Installing dependencies fresh with npm install..."
npm install

echo "Building the project..."
npm run build
