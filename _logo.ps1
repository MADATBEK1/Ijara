# Rename script: IjaraGo brand final polish
# Logo emoji: 🏠 -> 🚀 (zamonaviyroq ko'rinish)
# tagline: O'zbekiston ijara platformasi

$logoFix = @{
    'logo-icon">🏠</span><span class="logo-text">IjaraGo' = 'logo-icon">🚀</span><span class="logo-text">IjaraGo'
}

$files = Get-ChildItem 'c:\LOYIHA\' -Filter '*.html' | Select-Object -ExpandProperty FullName

$count = 0
foreach ($f in $files) {
    if (Test-Path $f) {
        $content = Get-Content $f -Raw -Encoding UTF8
        $new = $content -replace [regex]::Escape('logo-icon">🏠</span><span class="logo-text">IjaraGo'), 'logo-icon">🚀</span><span class="logo-text">IjaraGo'
        if ($new -ne $content) {
            Set-Content $f $new -Encoding UTF8 -NoNewline
            $count++
            Write-Host "Logo updated: $(Split-Path $f -Leaf)"
        }
    }
}
Write-Host "--- Logo updated in $count files"
