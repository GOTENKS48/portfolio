@echo off
echo Cleaning node_modules and lockfile...
rmdir /s /q node_modules
del package-lock.json
echo Fresh installing...
npm install --legacy-peer-deps
echo Done!
