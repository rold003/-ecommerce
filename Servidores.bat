@echo off
setlocal
cd /d "%~dp0"

if "%~1"=="start" goto iniciar
if "%~1"=="stop" goto apagar
if "%~1"=="check" goto verificar

:menu
cls
echo ==========================================
echo   Servidores del proyecto Ecommerce
echo ==========================================
echo.
echo   1. Iniciar servidores
echo   2. Apagar servidores
echo   3. Verificar que funcionen
echo   4. Salir
echo.
set /p opcion="Elige una opcion (1-4): "
if "%opcion%"=="1" goto iniciar
if "%opcion%"=="2" goto apagar
if "%opcion%"=="3" goto verificar
if "%opcion%"=="4" exit /b 0
goto menu

:iniciar
echo.
echo Levantando PostgreSQL (Docker)...
docker compose up -d
if errorlevel 1 (
    echo.
    echo No se pudo levantar Docker. Verifica que Docker Desktop este abierto.
    pause
    goto fin
)
echo.
echo Iniciando backend ^(http://localhost:4000^)...
start "Ecommerce-Backend" cmd /k "cd /d %~dp0backend && npm run dev"
echo Iniciando frontend ^(http://localhost:5173^)...
start "Ecommerce-Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
echo.
echo Esperando ~20 segundos a que arranquen, antes de verificar...
"%SystemRoot%\System32\ping.exe" -n 21 127.0.0.1 >nul
call :hacer_verificacion
echo.
echo Si algo dice [FALLA], puede que solo necesite mas tiempo en arrancar.
echo Espera unos segundos y elige la opcion 3 (Verificar) para revisar de nuevo.
echo.
echo   Backend:  http://localhost:4000  (docs en /api-docs)
echo   Frontend: http://localhost:5173
echo.
pause
goto fin

:apagar
echo.
echo Apagando backend y frontend...
taskkill /FI "WINDOWTITLE eq Ecommerce-Backend*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Ecommerce-Frontend*" /T /F >nul 2>&1
REM Respaldo: por si el cierre por titulo de ventana no los alcanzo, se busca
REM cualquier proceso node.exe que pertenezca a la carpeta de este proyecto.
powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { $_.CommandLine -like '*ecommerce\backend*' -or $_.CommandLine -like '*ecommerce\frontend*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }" >nul 2>&1
echo Apagando PostgreSQL (Docker)...
docker compose stop
echo.
echo Todo apagado.
echo.
pause
goto fin

:verificar
echo.
call :hacer_verificacion
echo.
pause
goto fin

:hacer_verificacion
echo Verificando PostgreSQL...
set PG_STATUS=
for /f "delims=" %%i in ('docker inspect -f "{{.State.Running}}" ecommerce-postgres 2^>nul') do set PG_STATUS=%%i
if "%PG_STATUS%"=="true" (
    echo   [OK] Postgres esta corriendo.
) else (
    echo   [FALLA] El contenedor de Postgres no esta corriendo.
)

echo Verificando backend...
set BACKEND_CODE=
for /f %%i in ('"%SystemRoot%\System32\curl.exe" -s -o nul -w "%%{http_code}" --max-time 4 http://localhost:4000/api-docs.json 2^>nul') do set BACKEND_CODE=%%i
if "%BACKEND_CODE%"=="200" (
    echo   [OK] Backend responde en http://localhost:4000
) else (
    echo   [FALLA] Backend no responde ^(codigo: %BACKEND_CODE%^)
)

echo Verificando frontend...
set FRONTEND_CODE=
for /f %%i in ('"%SystemRoot%\System32\curl.exe" -s -o nul -w "%%{http_code}" --max-time 4 http://localhost:5173 2^>nul') do set FRONTEND_CODE=%%i
if "%FRONTEND_CODE%"=="200" (
    echo   [OK] Frontend responde en http://localhost:5173
) else (
    echo   [FALLA] Frontend no responde ^(codigo: %FRONTEND_CODE%^)
)
exit /b 0

:fin
if "%~1"=="" goto menu
exit /b 0
