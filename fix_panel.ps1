# user-panel.html da barcha ochiluvchi backtick larni qaytarish
$p = 'c:\LOYIHA\user-panel.html'
$bytes = [System.IO.File]::ReadAllBytes($p)
$t = [System.Text.Encoding]::UTF8.GetString($bytes)

# return dan keyin HTML boshlanadigan template literal lar (return <div... -> return `<div...)
$t = $t -replace 'return (<div class="booking-item">)', 'return `<div class="booking-item">'
$t = $t -replace 'return (<span style="font-size:12px)', 'return `<span style="font-size:12px'

# ternary ichidagi template literal lar (? <a -> ? `<a, ? <button -> ? `<button)
$t = $t -replace '\? (<a href="chat\.html" class="chat-bubble">)', '? `<a href="chat.html" class="chat-bubble">'
$t = $t -replace '\? (<button class="btn btn-outline" style="font-size:11px;padding:5px 10px;border-color)', '? `<button class="btn btn-outline" style="font-size:11px;padding:5px 10px;border-color'
$t = $t -replace '\? (<button class="btn btn-outline" style="font-size:11px;padding:5px 10px;" onclick="openReviewModal)', '? `<button class="btn btn-outline" style="font-size:11px;padding:5px 10px;" onclick="openReviewModal'
$t = $t -replace '\? (<button class="btn btn-primary" style="font-size:11px;padding:5px 10px;" onclick="rebookListing)', '? `<button class="btn btn-primary" style="font-size:11px;padding:5px 10px;" onclick="rebookListing'

# avatar URL - ochiluvchi backtick
$t = $t -replace "(const avatar = user\.avatar \|\|\r\n\s+)(https://ui-avatars\.com)", '$1`https://ui-avatars.com'

# renderPanelMsgs - template literal
$t = $t -replace 'box\.innerHTML = panelMsgs\.map\(m =>[\r\n\s]+(<div class="message)', "box.innerHTML = panelMsgs.map(m =>`r`n            ``<div class=`"message"

$outBytes = [System.Text.Encoding]::UTF8.GetBytes($t)
[System.IO.File]::WriteAllBytes($p, $outBytes)
Write-Host "user-panel.html tuzatildi"
