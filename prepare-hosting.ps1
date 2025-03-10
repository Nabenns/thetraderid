# Create dist directory
New-Item -ItemType Directory -Force -Path dist

# Build the project
npm run build

# Copy necessary files
Copy-Item -Path "out/*" -Destination "dist/" -Recurse -Force
Copy-Item -Path ".htaccess" -Destination "dist/.htaccess" -Force
Copy-Item -Path ".env.production" -Destination "dist/.env" -Force
Copy-Item -Path "api.php" -Destination "dist/api.php" -Force
Copy-Item -Path "composer.json" -Destination "dist/composer.json" -Force

# Create zip file
Compress-Archive -Path "dist/*" -DestinationPath "thetrader-static.zip" -Force

# Clean up
Remove-Item -Path "dist" -Recurse -Force
Remove-Item -Path "out" -Recurse -Force

Write-Host "Files have been prepared and zipped to thetrader-static.zip"
Write-Host "After uploading to hosting:"
Write-Host "1. Extract thetrader-static.zip"
Write-Host "2. Install Composer if not installed"
Write-Host "3. Run 'composer install' to install Midtrans PHP library"
Write-Host "4. Make sure PHP mail() function is enabled"
Write-Host "5. Update Midtrans dashboard with new webhook URL" 