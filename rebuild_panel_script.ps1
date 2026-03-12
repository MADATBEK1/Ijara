# user-panel.html - faqat script qismini tozalab qayta yozish
$p = 'c:\LOYIHA\user-panel.html'
$bytes = [System.IO.File]::ReadAllBytes($p)
$fullText = [System.Text.Encoding]::UTF8.GetString($bytes)

# Script boshlanish nuqtasini topish
$scriptStart = $fullText.IndexOf('<script src="data.js">')
if ($scriptStart -lt 0) {
    Write-Host "ERROR: script boshlangich nuqta topilmadi"; exit 1
}

$htmlPart = $fullText.Substring(0, $scriptStart)

$newScript = @'
    <script src="data.js"></script>
    <script src="main.js"></script>
    <script src="auth.js"></script>
    <script src="listings-store.js"></script>
    <script>
        // =====================================================
        //  LOGIN TEKSHIRUVI — Sahifa yuklanishida BIRINCHI ishlaydi
        // =====================================================
        (function () {
            var user = AUTH.getCurrentUser();
            if (!user) {
                sessionStorage.setItem('redirect_after_login', 'user-panel.html');
                window.location.replace('login.html');
                return;
            }

            var fullName = (user.firstName || '') + ' ' + (user.lastName || '');
            var avatar = user.avatar ||
                ('https://ui-avatars.com/api/?name=' + encodeURIComponent(fullName.trim()) + '&background=6366f1&color=fff&bold=true&size=128');
            var roleName = user.role === 'owner' ? "E'lon Egasi" : (user.role === 'admin' ? 'Admin' : 'Ijarachi');

            var sa = document.getElementById('sidebarAvatar');
            var sn = document.getElementById('sidebarName');
            var sr = document.getElementById('sidebarRole');
            if (sa) sa.src = avatar;
            if (sn) sn.textContent = fullName.trim() || user.email;
            if (sr) sr.textContent = roleName;

            var dw = document.getElementById('dashWelcome');
            if (dw) dw.textContent = 'Xush kelibsiz, ' + (user.firstName || 'Foydalanuvchi') + '! 👋';

            var pa = document.getElementById('profileAvatar');
            if (pa) pa.src = avatar;
            var pf = document.getElementById('profFirstName');
            var pl = document.getElementById('profLastName');
            var pp = document.getElementById('profPhone');
            var pe = document.getElementById('profEmail');
            var pb = document.getElementById('profBio');
            if (pf) pf.value = user.firstName || '';
            if (pl) pl.value = user.lastName  || '';
            if (pp) pp.value = user.phone     || '';
            if (pe) pe.value = user.email     || '';
            if (pb) pb.value = user.bio       || '';
        })();

        // ===== SECTION SWITCH =====
        function showSection(name, btn) {
            document.querySelectorAll('.page-section').forEach(function(s) { s.classList.remove('active'); });
            document.querySelectorAll('.panel-nav-item').forEach(function(b) { b.classList.remove('active'); });
            document.getElementById('sec-' + name).classList.add('active');
            if (btn) btn.classList.add('active');
            if (name === 'wishlist') renderWishlist();
            if (name === 'chats') initPanelChat();
            if (name === 'reviews') renderReviews();
            if (name === 'notifications') renderNotifications();
            if (name === 'bookings') renderBookings('all');
            if (name === 'dashboard') renderDashBookings();
        }

        // ===== BOOKINGS =====
        var BOOKINGS = [
            { id:1, title:'Zamonaviy 2 xonali kvartira', dates:'1-5 Mart 2026', days:5, img:'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&q=80', price:1250000, status:'active', location:'Toshkent, Chilonzor' },
            { id:2, title:'Toyota Camry 2022', dates:'8 Mart 2026', days:1, img:'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=200&q=80', price:350000, status:'pending', location:'Toshkent, Yunusobod' },
            { id:3, title:'Samarqandda 3 xonali uy', dates:'14-16 Fevral 2026', days:2, img:'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&q=80', price:360000, status:'done', location:'Samarqand, Markaz' },
            { id:4, title:'Sony A7III Kamera', dates:'20 Fevral 2026', days:1, img:'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&q=80', price:150000, status:'done', location:'Toshkent' },
            { id:5, title:'Buxoro — Tarixiy Uy', dates:'5-7 Yanvar 2026', days:2, img:'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=200&q=80', price:440000, status:'done', location:'Buxoro' },
            { id:6, title:'DJI Mavic Pro 3 Drone', dates:'10 Dekabr 2025', days:1, img:'https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=200&q=80', price:200000, status:'cancelled', location:'Toshkent' },
            { id:7, title:'Chevrolet Equinox 2023', dates:'15-16 Mart 2026', days:2, img:'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=200&q=80', price:800000, status:'active', location:'Toshkent, Uchtepa' },
        ];

        var STATUS_MAP = {
            active:    { label:'Faol',        bg:'#d1fae5', color:'#065f46' },
            pending:   { label:'Kutilmoqda',  bg:'#fef9c3', color:'#854d0e' },
            done:      { label:'Yakunlandi',  bg:'#e2e8f0', color:'#475569' },
            cancelled: { label:'Bekor',       bg:'#fee2e2', color:'#991b1b' },
        };

        function statusBadge(s) {
            var st = STATUS_MAP[s] || STATUS_MAP.done;
            return '<span style="font-size:12px;font-weight:700;padding:4px 10px;border-radius:100px;background:' + st.bg + ';color:' + st.color + ';">' + st.label + '</span>';
        }

        function renderBookingItem(b) {
            var canCancel = b.status === 'active' || b.status === 'pending';
            var canReview = b.status === 'done';
            var canRebook = b.status === 'done' || b.status === 'cancelled';
            var price = (b.price).toLocaleString('uz-UZ') + ' so\'m';
            var html = '<div class="booking-item">';
            html += '<img src="' + b.img + '" class="booking-img" alt="' + b.title + '" onerror="this.src=\'https://via.placeholder.com/80x62\'" />';
            html += '<div class="booking-info"><h4>' + b.title + '</h4>';
            html += '<p>📍 ' + b.location + ' &nbsp;|&nbsp; 📅 ' + b.dates + ' &nbsp;|&nbsp; ' + b.days + ' kun</p>';
            html += '<div style="display:flex;gap:8px;margin-top:6px;flex-wrap:wrap;">' + statusBadge(b.status);
            if (canCancel) html += '<a href="chat.html" class="chat-bubble">💬 Chat</a>';
            html += '</div></div>';
            html += '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">';
            html += '<div class="booking-price">' + price + '</div>';
            if (canCancel) html += '<button class="btn btn-outline" style="font-size:11px;padding:5px 10px;border-color:var(--danger);color:var(--danger);" onclick="cancelBooking(' + b.id + ')">Bekor qilish</button>';
            if (canReview) html += '<button class="btn btn-outline" style="font-size:11px;padding:5px 10px;" onclick="openReviewModal(\'' + b.title + '\')">⭐ Sharh</button>';
            if (canRebook) html += '<button class="btn btn-primary" style="font-size:11px;padding:5px 10px;" onclick="rebookListing(' + b.id + ')">🔄 Qayta bron</button>';
            html += '</div></div>';
            return html;
        }

        function renderBookings(filter) {
            var list = filter === 'all' ? BOOKINGS : BOOKINGS.filter(function(b) { return b.status === filter; });
            var el = document.getElementById('bookingsList');
            if (el) el.innerHTML = list.length ? list.map(renderBookingItem).join('') : '<p style="text-align:center;color:var(--gray);padding:40px 0;">Bu bo\'limda buyurtmalar yo\'q.</p>';
        }

        function filterBookings(filter, btn) {
            document.querySelectorAll('.booking-tab').forEach(function(t) { t.classList.remove('active'); });
            btn.classList.add('active');
            renderBookings(filter);
        }

        function cancelBooking(id) { showToast('Bekor qilish so\'rovi yuborildi.', 'info'); }

        function rebookListing(id) {
            var b = BOOKINGS.find(function(x) { return x.id === id; });
            showToast('"' + b.title + '" qayta bron qilish...', 'success');
            setTimeout(function() { window.location.href = 'listing-detail.html?id=' + id; }, 1200);
        }

        function renderDashBookings() {
            var el = document.getElementById('dashBookings');
            if (el) el.innerHTML = BOOKINGS.slice(0, 3).map(renderBookingItem).join('');
        }
        renderDashBookings();

        // ===== WISHLIST =====
        function renderWishlist() {
            var grid = document.getElementById('wishlistGrid');
            if (!grid) return;
            if (typeof LISTINGS !== 'undefined' && LISTINGS && LISTINGS.length) {
                grid.innerHTML = LISTINGS.slice(0, 4).map(function(item) { return createCard(item); }).join('');
            } else {
                grid.innerHTML = '<p style="text-align:center;color:var(--gray);padding:40px 0;">Hozircha saqlangan e\'lonlar yo\'q.</p>';
            }
        }

        // ===== CHAT =====
        var panelMsgs = [
            { text: "Salom! Kvartira hali bo'shmi?", sent: false, time: "10:30" },
            { text: "Ha, bo'sh! Qaysi sana uchun?", sent: true, time: "10:32" },
            { text: "1-5 Mart uchun", sent: false, time: "10:33" },
        ];

        function initPanelChat() {
            var chatList = document.getElementById('chatPanelList');
            if (!chatList) return;
            var contacts = [
                { name: 'Aziz Karimov', preview: "Ha, bo'sh!", unread: 2 },
                { name: 'Bobur Yusupov', preview: 'Mashina tayyor', unread: 1 },
                { name: 'Malika Rahimova', preview: 'Rahmat!', unread: 0 },
            ];
            chatList.innerHTML = contacts.map(function(c, i) {
                var initials = c.name.split(' ').map(function(w) { return w[0]; }).join('');
                var unreads = c.unread ? '<span style="background:var(--danger);color:white;font-size:10px;padding:2px 7px;border-radius:100px;">' + c.unread + '</span>' : '';
                return '<div class="chat-list-item ' + (i === 0 ? 'active' : '') + '" onclick="document.querySelectorAll(\'.chat-list-item\').forEach(function(x){x.classList.remove(\'active\')});this.classList.add(\'active\')">'
                    + '<div style="width:40px;height:40px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:14px;flex-shrink:0;">' + initials + '</div>'
                    + '<div style="flex:1;min-width:0;"><div class="chat-name">' + c.name + '</div>'
                    + '<div class="chat-preview" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + c.preview + '</div></div>'
                    + unreads + '</div>';
            }).join('');
            renderPanelMsgs();
        }

        function renderPanelMsgs() {
            var box = document.getElementById('chatMessages');
            if (!box) return;
            box.innerHTML = panelMsgs.map(function(m) {
                return '<div class="message ' + (m.sent ? 'sent' : 'received') + '">' + m.text + '<div class="message-time">' + m.time + '</div></div>';
            }).join('');
            box.scrollTop = box.scrollHeight;
        }

        function sendPanelMsg() {
            var inp = document.getElementById('panelChatInput');
            var text = inp.value.trim();
            if (!text) return;
            var t = new Date().toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit' });
            panelMsgs.push({ text: text, sent: true, time: t });
            inp.value = '';
            renderPanelMsgs();
            setTimeout(function() {
                var replies = ["Tushundim, tez orada javob beraman!", "Xizmatdan foydalanganingiz uchun rahmat!", "Ha, albatta! Kuting."];
                panelMsgs.push({ text: replies[Math.floor(Math.random() * replies.length)], sent: false, time: new Date().toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit' }) });
                renderPanelMsgs();
            }, 1800);
        }

        // ===== REVIEWS =====
        function renderReviews() {
            var reviews = [
                { item: 'Zamonaviy kvartira', rating: 5, text: 'Juda qulay va toza edi. Egasi ham mehribon. Tavsiya qilaman!', date: '1 Mart 2026' },
                { item: 'Sony A7III Kamera', rating: 4, text: 'Kamera yaxshi ishladi, hamma zaruriy narsalar bor edi.', date: '20 Fevral 2026' },
                { item: 'Samarqand uy', rating: 5, text: 'Ajoyib joy! Tarixiy muhit, qulay, rahmat!', date: '16 Fevral 2026' },
            ];
            var el = document.getElementById('reviewsList');
            if (!el) return;
            el.innerHTML = reviews.map(function(r) {
                var stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
                return '<div style="padding:20px;border:1px solid var(--border);border-radius:14px;background:var(--white);">'
                    + '<div style="display:flex;justify-content:space-between;margin-bottom:10px;align-items:center;">'
                    + '<strong style="font-size:15px;">' + r.item + '</strong>'
                    + '<span style="color:#f59e0b;font-size:18px;">' + stars + '</span></div>'
                    + '<p style="color:var(--dark-3);font-size:14px;line-height:1.6;">' + r.text + '</p>'
                    + '<div style="font-size:12px;color:var(--gray);margin-top:8px;">📅 ' + r.date + '</div></div>';
            }).join('');
        }

        // ===== NOTIFICATIONS =====
        var NOTIFICATIONS = [
            { id:1, icon:'✅', title:'Buyurtmangiz tasdiqlandi!', msg:'Zamonaviy kvartira — 1-5 Mart uchun bron qabul qilindi.', time:'2 daqiqa oldin', color:'var(--success)', unread:true },
            { id:2, icon:'🔔', title:"Yangi bron so'rovi!", msg:'Chevrolet Equinox uchun bron tasdiqlashni kuting.', time:'1 soat oldin', color:'var(--primary)', unread:true },
            { id:3, icon:'💬', title:'Yangi xabar', msg:'Aziz Karimov sizga xabar qoldirdi.', time:'3 soat oldin', color:'var(--secondary)', unread:true },
            { id:4, icon:'⚠️', title:"To'lov eslatmasi", msg:"Toyota Camry uchun depozit to'lovini amalga oshiring.", time:'Kecha', color:'var(--danger)', unread:false },
            { id:5, icon:'🎉', title:"IjaraGo'da xush kelibsiz!", msg:'Hisobingiz muvaffaqiyatli yaratildi.', time:'2 oy oldin', color:'var(--success)', unread:false },
        ];

        function renderNotifications() {
            var el = document.getElementById('notifList');
            if (!el) return;
            el.innerHTML = NOTIFICATIONS.map(function(n) {
                var newBadge = n.unread ? '<span style="font-size:9px;background:var(--danger);color:white;padding:2px 7px;border-radius:100px;margin-left:4px;">YANGI</span>' : '';
                return '<div class="notif-item ' + (n.unread ? 'unread' : '') + '" style="border-left-color:' + n.color + ';" onclick="markRead(' + n.id + ', this)">'
                    + '<div class="notif-icon">' + n.icon + '</div>'
                    + '<div class="notif-text" style="flex:1;"><h4>' + n.title + newBadge + '</h4>'
                    + '<p>' + n.msg + '</p>'
                    + '<span style="font-size:11px;color:var(--gray-light);">🕐 ' + n.time + '</span></div></div>';
            }).join('');
        }

        function markRead(id, el) {
            var n = NOTIFICATIONS.find(function(x) { return x.id === id; });
            if (n) n.unread = false;
            el.classList.remove('unread');
            var span = el.querySelector('h4 span');
            if (span) span.remove();
            updateUnreadCount();
        }

        function updateUnreadCount() {
            var cnt = NOTIFICATIONS.filter(function(n) { return n.unread; }).length;
            var badge = document.getElementById('unreadBadge');
            if (badge) { badge.textContent = cnt; badge.style.display = cnt > 0 ? 'inline' : 'none'; }
        }

        setTimeout(function() {
            NOTIFICATIONS.unshift({ id:99, icon:'📬', title:'Yangi bildirishnoma!', msg:"Egangiz sizning so'rovingizga javob berdi.", time:'Hozirgina', color:'var(--primary)', unread:true });
            updateUnreadCount();
            showToast('🔔 Yangi bildirishnoma keldi!', 'success');
            var secNotif = document.getElementById('sec-notifications');
            if (secNotif && secNotif.classList.contains('active')) renderNotifications();
        }, 6000);

        // ===== REVIEW MODAL =====
        var modalRating = 0;
        var currentReviewTitle = '';

        function openReviewModal(title) {
            currentReviewTitle = title;
            var t = document.getElementById('reviewModalTitle');
            if (t) t.textContent = title;
            modalRating = 0;
            document.querySelectorAll('#modalStars span').forEach(function(s) { s.classList.remove('lit'); });
            var reviewText = document.getElementById('modalReviewText');
            if (reviewText) reviewText.value = '';
            var modal = document.getElementById('reviewModal');
            if (modal) modal.classList.add('open');
        }

        function closeReviewModal(e) {
            var modal = document.getElementById('reviewModal');
            if (e.target === modal) modal.classList.remove('open');
        }

        function setModalRating(val) {
            modalRating = val;
            document.querySelectorAll('#modalStars span').forEach(function(s, i) { s.classList.toggle('lit', i < val); });
        }

        function submitModalReview() {
            var text = document.getElementById('modalReviewText').value.trim();
            if (!modalRating) return showToast('Yulduz tanlang!', 'info');
            if (!text) return showToast('Sharh yozing!', 'info');
            document.getElementById('reviewModal').classList.remove('open');
            showToast('Sharhingiz qabul qilindi ⭐ Rahmat!', 'success');
            setTimeout(function() { showToast('📧 Egaga email bildirishnoma yuborildi!', 'info'); }, 1500);
        }

        // ===== PROFILE =====
        function saveProfile(e) {
            e.preventDefault();
            var user = AUTH.getCurrentUser();
            if (!user) return;
            var fn = document.getElementById('profFirstName');
            var ln = document.getElementById('profLastName');
            var ph = document.getElementById('profPhone');
            var bi = document.getElementById('profBio');
            if (fn && fn.value.trim()) user.firstName = fn.value.trim();
            if (ln && ln.value.trim()) user.lastName  = ln.value.trim();
            if (ph && ph.value.trim()) user.phone     = ph.value.trim();
            if (bi) user.bio = bi.value.trim();
            user.avatar = 'https://ui-avatars.com/api/?name=' + encodeURIComponent((user.firstName || '') + ' ' + (user.lastName || '')) + '&background=6366f1&color=fff&bold=true&size=128';
            AUTH.setSession(user);
            var sa = document.getElementById('sidebarAvatar'); if (sa) sa.src = user.avatar;
            var sn = document.getElementById('sidebarName');   if (sn) sn.textContent = (user.firstName || '') + ' ' + (user.lastName || '');
            var pa = document.getElementById('profileAvatar'); if (pa) pa.src = user.avatar;
            showToast('Profil muvaffaqiyatli saqlandi! ✅', 'success');
        }

        function changePassword() { showToast("Parol o'zgartirish oynasi ochilmoqda...", 'info'); }

        function changeAvatar(event) {
            var file = event.target.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.onload = function(e) {
                var pa = document.getElementById('profileAvatar'); if (pa) pa.src = e.target.result;
                var sa = document.getElementById('sidebarAvatar'); if (sa) sa.src = e.target.result;
                showToast('Profil rasmi yangilandi ✅', 'success');
            };
            reader.readAsDataURL(file);
        }
    </script>
    <script src="enhancements.js"></script>
    <script src="support-chat.js"></script>
</body>
</html>
'@

# Yangi faylni yozish: HTML + yangi script
$finalText = $htmlPart + $newScript
$outBytes = [System.Text.Encoding]::UTF8.GetBytes($finalText)
[System.IO.File]::WriteAllBytes($p, $outBytes)
Write-Host "OK: user-panel.html to'liq tuzatildi" -ForegroundColor Green
Write-Host "Yangi hajm: $([math]::Round($outBytes.Length/1KB,1)) KB" -ForegroundColor Cyan
