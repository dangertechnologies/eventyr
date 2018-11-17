#!/usr/bin/env bash

# patch-drawer-with-push.sh

DRAWERLAYOUT=../node_modules/react-native-drawer-layout/dist/DrawerLayout.js
DRAWERVIEW=../node_modules/react-navigation-drawer/dist/views/DrawerView.js

echo "Replacing node_modules/react-native-drawer-layout/dist/DrawerLayout.js"
curl -o $DRAWERLAYOUT https://raw.githubusercontent.com/blackneck/react-native-drawer-layout/master/src/DrawerLayout.js

if [[ $(cat $DRAWERLAYOUT | grep 'opacity: push') ]]; then
  echo "Enabling overlay on push"
  sed -i '' 's/opacity: push ? 0/opacity/g' $DRAWERLAYOUT
fi

echo "Patching $DRAWERVIEW"
if [[ ! $(cat $DRAWERVIEW | grep drawerType) ]]; then
  # If you want to use this on e.g Linux, you may want to remove the '' after -i
  sed -i '' 's/<DrawerLayout/<DrawerLayout drawerType=\{this.props.navigationConfig.drawerType\}/g' $DRAWERVIEW
else
  echo "Already patched"
fi