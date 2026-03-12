$p = 'c:\LOYIHA\user-panel.html'
$bytes = [System.IO.File]::ReadAllBytes($p)
$t = [System.Text.Encoding]::UTF8.GetString($bytes)
$lines = $t.Split("`n")
Write-Host ("Jami qatorlar: " + $lines.Count)
Write-Host ("Auth check: " + $t.Contains('getCurrentUser'))
Write-Host ("Redirect: " + $t.Contains('redirect_after_login'))
$bc = 0
foreach ($c in $t.ToCharArray()) { if ([int]$c -eq 96) { $bc++ } }
Write-Host ("Backtick soni: " + $bc)
if ($bc -eq 0) {
    Write-Host "IDEAL: Template literal yo'q - xato bo'lmaydi!" -ForegroundColor Green
} else {
    # Qaysi satrlarda backtick bor ko'rsatish
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i].Contains('`')) {
            Write-Host ("  Satr " + ($i+1) + ": " + $lines[$i].Trim().Substring(0, [Math]::Min(80, $lines[$i].Trim().Length)))
        }
    }
}
