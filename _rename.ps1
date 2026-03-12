$files = Get-ChildItem 'c:\LOYIHA\' -Filter '*.html' | Select-Object -ExpandProperty FullName
$files += 'c:\LOYIHA\main.js'
$files += 'c:\LOYIHA\widgets.js'
$files += 'c:\LOYIHA\sw.js'
$files += 'c:\LOYIHA\manifest.json'
$files += 'c:\LOYIHA\style.css'
$files += 'c:\LOYIHA\data.js'

$count = 0
foreach ($f in $files) {
    if (Test-Path $f) {
        $content = Get-Content $f -Raw -Encoding UTF8
        $new = $content -replace 'IjaraHub', 'IjaraGo'
        if ($new -ne $content) {
            Set-Content $f $new -Encoding UTF8 -NoNewline
            $count++
            Write-Host "Updated: $(Split-Path $f -Leaf)"
        }
    }
}
Write-Host "--- Total files updated: $count"
