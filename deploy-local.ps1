# deploy-local.ps1
# Automated CD script: Docker Hub -> Local Docker Engine

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Starting CD Update: Pulling from Docker Hub -> Local" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Pull latest image from Docker Hub
Write-Host "[1/3] Pulling latest nguyendinhhao/product-api:latest..." -ForegroundColor Yellow
docker compose -f docker-compose-prod.yaml pull product-api

# 2. Recreate container with the new image
Write-Host "[2/3] Recreating product-api-prod container with zero-downtime..." -ForegroundColor Yellow
docker compose -f docker-compose-prod.yaml up -d product-api

# 3. Check status
Write-Host "[3/3] Checking container health status..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
docker compose -f docker-compose-prod.yaml ps

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  CD Update to Local Docker Engine Completed Successfully!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
