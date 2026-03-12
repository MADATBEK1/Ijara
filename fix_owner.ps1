$p = 'c:\LOYIHA\owner-panel.html'
$bytes = [System.IO.File]::ReadAllBytes($p)
$t = [System.Text.Encoding]::UTF8.GetString($bytes)

# 1) Sidebar avatar - id qo'shish
$t = $t.Replace(
    'src="https://i.pravatar.cc/80?img=11" class="panel-avatar" alt="Ega"',
    'src="" class="panel-avatar" alt="Ega" id="ownerSidebarAvatar"'
)

# 2) Sidebar name dynamic
$t = $t.Replace(
    '<div class="uname">Aziz Karimov</div>',
    '<div class="uname" id="ownerSidebarName">...</div>'
)

# 3) Sidebar role dynamic  
$searchRole = [char]0x45 + 'ga ' + [char]0xD83C + [char]0xDFE2  # "Ega 🏢"
$t = $t.Replace(
    '<div class="urole">' + $searchRole + '</div>',
    '<div class="urole" id="ownerSidebarRole">' + $searchRole + '</div>'
)

# 4) Profile avatar - id qo'shish
$t = $t.Replace(
    'src="https://i.pravatar.cc/160?img=11"',
    'src="" id="ownerProfileAvatar"'
)

# 5) Profil form - id lar qo'shish (Aziz va Karimov)
$t = $t.Replace(
    'value="Aziz" />',
    'id="ownerProfFirst" value="" placeholder="Ism" />'
)
$t = $t.Replace(
    'value="Karimov" />',
    'id="ownerProfLast" value="" placeholder="Familiya" />'
)
$t = $t.Replace(
    'value="+998 90 111 22 33"',
    'id="ownerProfPhone" value=""'
)
$t = $t.Replace(
    'value="aziz@email.com"',
    'id="ownerProfEmail" value="" readonly style="opacity:.7;"'
)

# 6) Profil saqlash formini yangilash
$t = $t.Replace(
    'onsubmit="e=>{ e.preventDefault(); showToast(''Profil saqlandi ✅'',''success''); }"',
    'onsubmit="saveOwnerProfile(event)"'
)

# 7) auth.js dan keyin login tekshiruvi qo'shish
$authScript = '<script src="auth.js"></script>'
$loginCheck = @'
<script src="auth.js"></script>
<script>
// ===== LOGIN TEKSHIRUVI =====
(function() {
    var user = AUTH.getCurrentUser();
    if (!user) {
        sessionStorage.setItem('redirect_after_login', 'owner-panel.html');
        window.location.replace('login.html');
        return;
    }
    var fullName = (user.firstName||'') + ' ' + (user.lastName||'');
    var avatar = user.avatar || ('https://ui-avatars.com/api/?name=' + encodeURIComponent(fullName.trim()) + '&background=6366f1&color=fff&bold=true&size=128');
    var roleName = user.role === 'admin' ? 'Admin' : "E'lon Egasi";

    var sa = document.getElementById('ownerSidebarAvatar');
    var sn = document.getElementById('ownerSidebarName');
    var sr = document.getElementById('ownerSidebarRole');
    if (sa) sa.src = avatar;
    if (sn) sn.textContent = fullName.trim() || user.email;
    if (sr) sr.textContent = roleName;

    var pa = document.getElementById('ownerProfileAvatar');
    if (pa) pa.src = avatar;
    var pf = document.getElementById('ownerProfFirst');
    var pl = document.getElementById('ownerProfLast');
    var pp = document.getElementById('ownerProfPhone');
    var pe = document.getElementById('ownerProfEmail');
    var pb = document.getElementById('ownerProfBio');
    if (pf) pf.value = user.firstName || '';
    if (pl) pl.value = user.lastName  || '';
    if (pp) pp.value = user.phone     || '';
    if (pe) pe.value = user.email     || '';
    if (pb) pb.value = user.bio       || '';
})();

function saveOwnerProfile(e) {
    e.preventDefault();
    var user = AUTH.getCurrentUser();
    if (!user) return;
    var fn = document.getElementById('ownerProfFirst'); if (fn && fn.value.trim()) user.firstName = fn.value.trim();
    var ln = document.getElementById('ownerProfLast');  if (ln && ln.value.trim()) user.lastName  = ln.value.trim();
    var ph = document.getElementById('ownerProfPhone'); if (ph && ph.value.trim()) user.phone     = ph.value.trim();
    var bi = document.getElementById('ownerProfBio');   if (bi) user.bio = bi.value.trim();
    user.avatar = 'https://ui-avatars.com/api/?name=' + encodeURIComponent((user.firstName||'') + ' ' + (user.lastName||'')) + '&background=6366f1&color=fff&bold=true&size=128';
    AUTH.setSession(user);
    var sa = document.getElementById('ownerSidebarAvatar'); if (sa) sa.src = user.avatar;
    var sn = document.getElementById('ownerSidebarName');   if (sn) sn.textContent = (user.firstName||'') + ' ' + (user.lastName||'');
    var pa = document.getElementById('ownerProfileAvatar'); if (pa) pa.src = user.avatar;
    showToast('Profil saqlandi OK', 'success');
}
</script>
'@

# Faqat bitta marta almashtiramiz
if ($t -notmatch 'ownerSidebarAvatar' -or $t -notmatch 'LOGIN TEKSHIRUVI') {
    $t = $t.Replace($authScript + "`r`n    { name:", $loginCheck + "`r`n    <script>`r`n    const REQUESTS_DATA = [`r`n    { name:")
}

$outBytes = [System.Text.Encoding]::UTF8.GetBytes($t)
[System.IO.File]::WriteAllBytes($p, $outBytes)
Write-Host "DONE - owner-panel.html yangilandi"
