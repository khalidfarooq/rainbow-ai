#!/usr/bin/env bash

# Clean
rm -rf build/

# Build site_integrations
cd site_integrations
yarn
yarn build
yarn link

# Build background_page
cd ..
cd background_page
yarn link dual-captions-site-integrations
yarn
yarn build


# Build browser_action
cd ..
cd browser_action
yarn link dual-captions-site-integrations
yarn
yarn build
yarn link

# Build content_script
cd ..
cd content_script
yarn link dual-captions-browser-action
yarn link dual-captions-site-integrations
yarn
yarn build


# Create extension
cd ..
mkdir build
cp -r browser_action/build/* build/
cp content_script/build/static/js/main.js build/bundle.js
cp background_page/dist/index.js build/background.js

