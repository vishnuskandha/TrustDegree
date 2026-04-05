@echo off
setlocal EnableDelayedExpansion

set "ROOT=%~dp0.."
set "CHAIN_URL=http://127.0.0.1:8545"

if "%ROOT:~-1%"=="\" set "ROOT=%ROOT:~0,-1%"

echo ==========================================
echo TrustDegree Full System Starter
echo ==========================================
echo Root: %ROOT%
echo.

echo [1/4] Starting local blockchain node...
start "TrustDegree - Hardhat Node" cmd /k cd /d "%ROOT%" ^&^& npx hardhat node

echo [2/4] Waiting for blockchain RPC on %CHAIN_URL% ...
set "READY=0"
for /L %%i in (1,1,30) do (
  powershell -NoProfile -Command "$body = @{ jsonrpc = '2.0'; method = 'eth_blockNumber'; params = @(); id = 1 } ^| ConvertTo-Json -Compress; try { $r = Invoke-RestMethod -Uri '%CHAIN_URL%' -Method Post -ContentType 'application/json' -Body $body -TimeoutSec 2; if ($null -ne $r.result) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>nul
  if !errorlevel! EQU 0 (
    set "READY=1"
    goto :CHAIN_READY
  )
  timeout /t 1 /nobreak >nul
)

:CHAIN_READY
if "%READY%"=="0" (
  echo ERROR: Hardhat node did not become ready in time.
  echo Keep the node terminal open and try again.
  exit /b 1
)

echo [3/4] Deploying contract to localhost...
cd /d "%ROOT%"
call npm run deploy:localhost
if errorlevel 1 (
  echo ERROR: Deployment failed. Fix deployment issues and rerun start.bat.
  exit /b 1
)

echo [4/4] Starting backend and frontend...
start "TrustDegree - Backend" cmd /k cd /d "%ROOT%\backend" ^&^& npm run dev
start "TrustDegree - Frontend" cmd /k cd /d "%ROOT%\frontend" ^&^& npm run dev

echo [5/5] Verifying backend and frontend startup...
set "BACKEND_READY=0"
for /L %%i in (1,1,40) do (
  powershell -NoProfile -Command "try { Invoke-WebRequest -UseBasicParsing 'http://localhost:3000/health' -TimeoutSec 2 ^| Out-Null; exit 0 } catch { exit 1 }" >nul 2>nul
  if !errorlevel! EQU 0 (
    set "BACKEND_READY=1"
    goto :BACKEND_READY
  )
  timeout /t 1 /nobreak >nul
)

:BACKEND_READY
set "FRONTEND_READY=0"
for /L %%i in (1,1,40) do (
  powershell -NoProfile -Command "try { Invoke-WebRequest -UseBasicParsing 'http://localhost:5173' -TimeoutSec 2 ^| Out-Null; exit 0 } catch { exit 1 }" >nul 2>nul
  if !errorlevel! EQU 0 (
    set "FRONTEND_READY=1"
    goto :FRONTEND_READY
  )
  timeout /t 1 /nobreak >nul
)

:FRONTEND_READY
echo.
echo ==========================================
if "%BACKEND_READY%"=="1" (
  echo Backend status : Ready
) else (
  echo Backend status : Not confirmed yet
)
if "%FRONTEND_READY%"=="1" (
  echo Frontend status: Ready
) else (
  echo Frontend status: Not confirmed yet
)
echo Frontend: http://localhost:5173
echo Backend : http://localhost:3000/health
echo ==========================================

if "%BACKEND_READY%"=="0" (
  echo ERROR: Backend did not become ready. Check backend terminal logs.
  exit /b 1
)

if "%FRONTEND_READY%"=="0" (
  echo ERROR: Frontend did not become ready. Check frontend terminal logs.
  exit /b 1
)

echo.
echo Press any key to close this launcher...
pause >nul

endlocal
