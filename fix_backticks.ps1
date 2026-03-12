# Barcha HTML fayllardan backtick belgisini tozalash
$files = Get-ChildItem "c:\LOYIHA\*.html"
$fixed = 0
$clean = 0

foreach ($f in $files) {
    $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
    $text = [System.Text.Encoding]::UTF8.GetString($bytes)
    
    if ($text.Contains('`')) {
        $original = $text
        
        # Backtick patterns - eng keng tarqalgan xatolar
        # 1. `n    <link ... /> -> newline + <link
        $text = $text -replace '`n(\s+)<link', "`r`n`$1<link"
        # 2. `n    <script -> newline + <script
        $text = $text -replace '`n(\s+)<script', "`r`n`$1<script"
        # 3. `n</ -> newline + </
        $text = $text -replace '`n(\s+)</', "`r`n`$1</"
        # 4. style.css`n -> style.css yoki style.css\n
        $text = $text -replace 'style\.css`n', "style.css`r`n"
        $text = $text -replace 'enhancements\.css`n', "enhancements.css`r`n"
        # 5. Qolgan barcha `n -> \r\n
        $text = $text -replace '`n', "`r`n"
        # 6. Qolgan backtick larni olib tashlash (JS template literals ichida bo'lmaganlar)
        # Faqat HTML attribute va link ichidagi backtick lar
        $text = $text -replace '(\s)`([^{])', '$1$2'
        # 7. href="...` -> href="..."
        $text = $text -replace '"`([^"]*)"', '"$1"'
        
        if ($text -ne $original) {
            $outBytes = [System.Text.Encoding]::UTF8.GetBytes($text)
            [System.IO.File]::WriteAllBytes($f.FullName, $outBytes)
            Write-Host "FIXED: $($f.Name)" -ForegroundColor Green
            $fixed++
        } else {
            Write-Host "SKIP (o'zgarmadi): $($f.Name)" -ForegroundColor Yellow
        }
    } else {
        $clean++
    }
}

Write-Host ""
Write-Host "Tuzatildi: $fixed ta fayl" -ForegroundColor Cyan
Write-Host "Toza edi: $clean ta fayl" -ForegroundColor Cyan

# Qayta tekshiruv
Write-Host ""
Write-Host "--- Qayta tekshiruv ---" -ForegroundColor Yellow
$remaining = @()
Get-ChildItem "c:\LOYIHA\*.html" | ForEach-Object {
    $bytes = [System.IO.File]::ReadAllBytes($_.FullName)
    $t = [System.Text.Encoding]::UTF8.GetString($bytes)
    if ($t.Contains('`')) { $remaining += $_.Name }
}
if ($remaining.Count -eq 0) {
    Write-Host "BARCHA FAYLLAR TOZA!" -ForegroundColor Green
} else {
    Write-Host "Hali backtick bor ($($remaining.Count) ta):" -ForegroundColor Red
    $remaining | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
}
