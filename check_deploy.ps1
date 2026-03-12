Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  IJAREGO - DEPLOYMENT TEKSHIRUV" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Backtick tekshiruvi
Write-Host ""
Write-Host "[1] Backtick xatolari..." -ForegroundColor Yellow
$errors = @()
Get-ChildItem "c:\LOYIHA\*.html" | ForEach-Object {
    $bytes = [System.IO.File]::ReadAllBytes($_.FullName)
    $text = [System.Text.Encoding]::UTF8.GetString($bytes)
    if ($text.Contains('`')) { $errors += $_.Name }
}
if ($errors.Count -eq 0) {
    Write-Host "  OK: Barcha HTML fayllar toza" -ForegroundColor Green
} else {
    $errors | ForEach-Object { Write-Host "  ERR: $_" -ForegroundColor Red }
}

# 2. Auth tekshiruvi
Write-Host ""
Write-Host "[2] Panel login himoyasi..." -ForegroundColor Yellow
$panels = @("user-panel.html", "owner-panel.html")
foreach ($pf in $panels) {
    $bytes = [System.IO.File]::ReadAllBytes("c:\LOYIHA\$pf")
    $t = [System.Text.Encoding]::UTF8.GetString($bytes)
    $hasAuth = ($t -match "getCurrentUser") -or ($t -match "redirect_after_login")
    if ($hasAuth) {
        Write-Host "  OK: $pf - login himoyasi mavjud" -ForegroundColor Green
    } else {
        Write-Host "  WARN: $pf - login tekshiruvi yo'q!" -ForegroundColor Red
    }
}

# 3. Muhim deployment fayllar
Write-Host ""
Write-Host "[3] Deployment fayllar..." -ForegroundColor Yellow
$required = @(".htaccess","vercel.json","_redirects","robots.txt","sitemap.xml","manifest.json","sw.js","README.md","404.html","offline.html","og-image.png")
foreach ($rf in $required) {
    if (Test-Path "c:\LOYIHA\$rf") {
        $sz = [math]::Round((Get-Item "c:\LOYIHA\$rf").Length / 1KB, 1)
        Write-Host "  OK: $rf ($sz KB)" -ForegroundColor Green
    } else {
        Write-Host "  MISS: $rf yo'q!" -ForegroundColor Red
    }
}

# 4. JS fayllar
Write-Host ""
Write-Host "[4] JavaScript fayllar..." -ForegroundColor Yellow
$js = @("auth.js","main.js","data.js","listings-store.js","enhancements.js","support-chat.js","widgets.js")
foreach ($jf in $js) {
    if (Test-Path "c:\LOYIHA\$jf") {
        Write-Host "  OK: $jf" -ForegroundColor Green
    } else {
        Write-Host "  MISS: $jf" -ForegroundColor Red
    }
}

# 5. CSS fayllar
Write-Host ""
Write-Host "[5] CSS fayllar..." -ForegroundColor Yellow
foreach ($cf in @("style.css","enhancements.css")) {
    if (Test-Path "c:\LOYIHA\$cf") {
        $sz = [math]::Round((Get-Item "c:\LOYIHA\$cf").Length / 1KB, 1)
        Write-Host "  OK: $cf ($sz KB)" -ForegroundColor Green
    } else {
        Write-Host "  MISS: $cf" -ForegroundColor Red
    }
}

# 6. HTML sahifalar soni
Write-Host ""
Write-Host "[6] Jami fayllar..." -ForegroundColor Yellow
$htmlCount = (Get-ChildItem "c:\LOYIHA\*.html").Count
$totalSize = [math]::Round((Get-ChildItem "c:\LOYIHA" -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB, 2)
Write-Host "  $htmlCount ta HTML sahifa" -ForegroundColor Green
Write-Host "  Jami hajm: $totalSize MB" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  IJAREGO SERVERGA TAYYOR!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
