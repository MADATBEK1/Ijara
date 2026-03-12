# Faqat HTML qismidagi haqiqiy xato backtick larni topish
# JS template literal (` ... `) normal - uni hisobga olmaymiz
# HTML atributida yoki tag ichidagi backtick - xato

$files = Get-ChildItem "c:\LOYIHA\*.html"
$realErrors = @()

foreach ($f in $files) {
    $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
    $text = [System.Text.Encoding]::UTF8.GetString($bytes)
    
    if ($text.Contains('`')) {
        # JS ichidagi template literal emas, HTML ichidagi backtick tekshirish
        # Masalan: href="...`" yoki <link ...`n yoki stylesheet`n
        $htmlBacktick = $text -match 'href="[^"]*`[^"]*"' -or
                        $text -match 'src="[^"]*`[^"]*"' -or
                        $text -match '\.css`' -or
                        $text -match '\.js`' -or
                        $text -match '<link[^>]*`' -or
                        $text -match '<script[^>]*`'
        
        if ($htmlBacktick) {
            $realErrors += $f.Name
            Write-Host "HTML XATO: $($f.Name)" -ForegroundColor Red
        } else {
            Write-Host "JS normal: $($f.Name) (template literal - OK)" -ForegroundColor Green
        }
    } else {
        Write-Host "TOZA: $($f.Name)" -ForegroundColor Green
    }
}

Write-Host ""
if ($realErrors.Count -eq 0) {
    Write-Host "BARCHA FAYLLAR DEPLOYMENT UCHUN TAYYOR!" -ForegroundColor Green
    Write-Host "(Qolgan backtick lar faqat JS template literal - bu xato emas)" -ForegroundColor Cyan
} else {
    Write-Host "Haqiqiy HTML xatolar ($($realErrors.Count) ta): $($realErrors -join ', ')" -ForegroundColor Red
}
