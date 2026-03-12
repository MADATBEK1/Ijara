// ================================================================
//  IjaraGo — ENHANCEMENTS v2.0
//  Wishlist | Notifications | Scroll Progress | PWA Install | Hot badge
// ================================================================

// ================================================================
// ❤️ WISHLIST (Sevimlilar)
// ================================================================
const WL_KEY = 'ij_wishlist';

function getWishlist() {
    return JSON.parse(localStorage.getItem(WL_KEY) || '[]');
}

function saveWishlist(arr) {
    localStorage.setItem(WL_KEY, JSON.stringify(arr));
}

function toggleWishlist(id, event) {
    if (event) event.stopPropagation();
    let wl = getWishlist();
    const idx = wl.indexOf(id);
    const added = idx === -1;

    if (added) {
        wl.push(id);
        showToast('❤️ Sevimlilarga qo\'shildi!', 'success');
    } else {
        wl.splice(idx, 1);
        showToast('💔 Sevimlidan olib tashlandi', 'info');
    }

    saveWishlist(wl);
    updateAllWishlistButtons();
}

function isWishlisted(id) {
    return getWishlist().includes(id);
}

function updateAllWishlistButtons() {
    document.querySelectorAll('.wishlist-btn[data-id]').forEach(btn => {
        const id = parseInt(btn.dataset.id);
        const active = isWishlisted(id);
        btn.classList.toggle('wishlisted', active);
        btn.title = active ? 'Sevimlidan olib tashlash' : 'Sevimlilarga qo\'shish';
        btn.innerHTML = active ? '❤️' : '🤍';
    });
}

// Inject wishlist button into existing cards
function injectWishlistButtons() {
    if (typeof LISTINGS === 'undefined') return;
    // Add heart buttons to listing cards after render
    document.querySelectorAll('.listing-card').forEach(card => {
        const onclickAttr = card.getAttribute('onclick') || '';
        const match = onclickAttr.match(/openDetailModal\((\d+)\)/);
        if (!match) return;
        const id = parseInt(match[1]);
        if (card.querySelector('.wishlist-btn')) return;

        const wrap = card.querySelector('.card-image-wrap');
        if (wrap) {
            const btn = document.createElement('button');
            btn.className = 'wishlist-btn';
            btn.dataset.id = id;
            btn.onclick = (e) => toggleWishlist(id, e);
            btn.title = isWishlisted(id) ? 'Sevimlidan olib tashlash' : 'Sevimlilarga qo\'shish';
            btn.innerHTML = isWishlisted(id) ? '❤️' : '🤍';
            wrap.appendChild(btn);
        }
    });
}

// ================================================================
// 🔔 NOTIFICATION CENTER
// ================================================================
const NOTIFS_KEY = 'ij_notifs';

const DEMO_NOTIFS = [
    { id: 1, icon: '🎉', title: 'Xush kelibsiz!', body: 'IjaraGo ga xush kelibsiz! Birinchi ijarangizda 10% chegirma.', time: '2 daqiqa oldin', read: false, type: 'promo' },
    { id: 2, icon: '🔥', title: 'Yangi e\'lon qo\'shildi!', body: 'Siz qidirayotgan "Uy" kategoriyasida 5 ta yangi e\'lon paydo bo\'ldi.', time: '15 daqiqa oldin', read: false, type: 'new' },
    { id: 3, icon: '✅', title: 'Bron tasdiqlandi', body: 'Toyota Camry 2022 broningiz tasdiqlandi. 15-mart, soat 10:00 da.', time: '1 soat oldin', read: true, type: 'booking' },
    { id: 4, icon: '⭐', title: 'Baholashni unutmang', body: 'Sony A7III kamerasini ijara qilib oldingiz. Iltimos baholang!', time: '2 soat oldin', read: true, type: 'review' },
    { id: 5, icon: '💬', title: 'Yangi xabar', body: 'Aziz Karimov sizga xabar yubordi: "Holat qanday?"', time: 'Kecha', read: true, type: 'chat' },
];

let notifData = JSON.parse(localStorage.getItem(NOTIFS_KEY) || 'null') || DEMO_NOTIFS;

function saveNotifs() {
    localStorage.setItem(NOTIFS_KEY, JSON.stringify(notifData));
}

function getUnreadCount() {
    return notifData.filter(n => !n.read).length;
}

function markAllRead() {
    notifData.forEach(n => n.read = true);
    saveNotifs();
    renderNotifList();
    updateNotifBadge();
}

function markOneRead(id) {
    const n = notifData.find(n => n.id === id);
    if (n) n.read = true;
    saveNotifs();
    renderNotifList();
    updateNotifBadge();
}

function updateNotifBadge() {
    const badge = document.getElementById('notifBadge');
    const count = getUnreadCount();
    if (badge) {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

function renderNotifList() {
    const list = document.getElementById('notifList');
    if (!list) return;
    const unreadCount = getUnreadCount();

    list.innerHTML = notifData.map(n => `
        <div class="notif-item ${n.read ? 'read' : 'unread'}" onclick="markOneRead(${n.id})">
            <div class="notif-icon-wrap notif-type-${n.type}">${n.icon}</div>
            <div class="notif-content">
                <div class="notif-title">${n.title}</div>
                <div class="notif-body">${n.body}</div>
                <div class="notif-time">${n.time}</div>
            </div>
            ${!n.read ? '<div class="notif-dot"></div>' : ''}
        </div>
    `).join('');
}

function toggleNotifPanel() {
    const panel = document.getElementById('notifPanel');
    if (!panel) return;
    const isOpen = panel.classList.toggle('open');
    if (isOpen) renderNotifList();
}

function injectNotificationCenter() {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions || document.getElementById('notifBtn')) return;

    const notifHTML = `
        <div class="notif-wrapper" id="notifWrapper">
            <button class="notif-btn" id="notifBtn" onclick="toggleNotifPanel()" title="Bildirishnomalar" aria-label="Bildirishnomalar">
                🔔
                <span class="notif-badge" id="notifBadge" style="display:none;">0</span>
            </button>
            <div class="notif-panel" id="notifPanel">
                <div class="notif-panel-header">
                    <span>🔔 Bildirishnomalar</span>
                    <button class="notif-mark-all" onclick="markAllRead()">Barchasini o'qildi</button>
                </div>
                <div class="notif-list" id="notifList"></div>
                <div class="notif-panel-footer">
                    <a href="#" onclick="showToast('Barcha bildirishnomalar', 'info');return false;">Barchasini ko'rish</a>
                </div>
            </div>
        </div>
    `;

    // Insert before dark toggle
    const darkToggle = navActions.querySelector('.dark-toggle');
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = notifHTML;
    navActions.insertBefore(tempDiv.firstElementChild, darkToggle);

    // Update badge
    updateNotifBadge();

    // Close on outside click
    document.addEventListener('click', (e) => {
        const wrapper = document.getElementById('notifWrapper');
        if (wrapper && !wrapper.contains(e.target)) {
            document.getElementById('notifPanel')?.classList.remove('open');
        }
    });
}

// ================================================================
// 📊 SCROLL PROGRESS BAR
// ================================================================
function injectScrollProgressBar() {
    if (document.getElementById('scrollProgressBar')) return;
    const bar = document.createElement('div');
    bar.id = 'scrollProgressBar';
    bar.className = 'scroll-progress-bar';
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = progress + '%';
    }, { passive: true });
}

// ================================================================
// 📱 PWA INSTALL BANNER
// ================================================================
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showPWABanner();
});

function showPWABanner() {
    const dismissed = localStorage.getItem('ij_pwa_dismissed');
    if (dismissed) return;
    if (document.getElementById('pwaBanner')) return;

    const banner = document.createElement('div');
    banner.className = 'pwa-banner';
    banner.id = 'pwaBanner';
    banner.innerHTML = `
        <div class="pwa-banner-icon">📱</div>
        <div class="pwa-banner-text">
            <strong>IjaraGo Ilovasini o'rnating!</strong>
            <span>Tezroq ishlaydi, offline ham ko'rish mumkin</span>
        </div>
        <button class="pwa-install-btn" onclick="installPWA()">O'rnatish</button>
        <button class="pwa-dismiss-btn" onclick="dismissPWA()">✕</button>
    `;
    document.body.appendChild(banner);

    setTimeout(() => banner.classList.add('show'), 500);
}

function installPWA() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(result => {
            if (result.outcome === 'accepted') {
                showToast('🎉 IjaraGo o\'rnatildi!', 'success');
            }
            deferredPrompt = null;
            dismissPWA();
        });
    } else {
        showToast('📱 Brauzer menyusidan "Ilovani o\'rnatish" ni tanlang', 'info');
        dismissPWA();
    }
}

function dismissPWA() {
    const banner = document.getElementById('pwaBanner');
    if (banner) {
        banner.classList.remove('show');
        setTimeout(() => banner.remove(), 400);
    }
    localStorage.setItem('ij_pwa_dismissed', '1');
}

// Demo: show banner after 5 seconds if not installed (simulate)
setTimeout(() => {
    if (!deferredPrompt && !localStorage.getItem('ij_pwa_dismissed')) {
        showPWABanner();
    }
}, 5000);

// ================================================================
// 🔥 HOT / TEZDA BAND BO'LMOQDA BADGE
// ================================================================
function addHotBadges() {
    if (typeof LISTINGS === 'undefined') return;
    const HOT_IDS = [1, 2, 8, 10, 12]; // Premium yoki ko'p reviewli e'lonlar

    document.querySelectorAll('.listing-card').forEach(card => {
        const onclickAttr = card.getAttribute('onclick') || '';
        const match = onclickAttr.match(/openDetailModal\((\d+)\)/);
        if (!match) return;
        const id = parseInt(match[1]);
        if (!HOT_IDS.includes(id)) return;
        if (card.querySelector('.badge-hot')) return;

        const wrap = card.querySelector('.card-image-wrap');
        if (wrap) {
            const badge = document.createElement('span');
            badge.className = 'badge-hot';
            badge.innerHTML = '🔥 Tez band!';
            wrap.appendChild(badge);
        }
    });
}

// ================================================================
// 💎 CARD COUNTER TICKING ANIMATION (Real-time view counter)
// ================================================================
function addViewCounters() {
    document.querySelectorAll('.listing-card').forEach((card, i) => {
        if (card.querySelector('.view-counter')) return;
        const views = Math.floor(Math.random() * 200) + 20;
        const counter = document.createElement('div');
        counter.className = 'view-counter';
        counter.innerHTML = `👁 ${views} kishi ko'rdi`;
        const cardBody = card.querySelector('.card-body');
        if (cardBody) {
            // Insert before card-footer
            const footer = cardBody.querySelector('.card-footer');
            if (footer) cardBody.insertBefore(counter, footer);
        }
    });
}

// ================================================================
// ✨ INTERSECTION OBSERVER — Animate cards on scroll
// ================================================================
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.listing-card, .category-card, .step-card, .owner-top-card, .section-card').forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });
}

// ================================================================
// 🎯 STICKY FILTER TOP BAR (listings page helper)
// ================================================================
function initStickyFilters() {
    const filtersEl = document.querySelector('.listings-filters, .filter-sidebar');
    if (!filtersEl) return;
    // Already handled by CSS sticky, just add class
    filtersEl.classList.add('sticky-filter-bar');
}

// ================================================================
// 📈 ANIMATED NUMBER COUNTER on scroll
// ================================================================
function initAnimatedStats() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target || el.textContent.replace(/[^0-9]/g, ''));
                const suffix = el.dataset.suffix || el.textContent.replace(/[0-9,\.]/g, '');
                let current = 0;
                const duration = 1500;
                const step = target / (duration / 16);
                const timer = setInterval(() => {
                    current = Math.min(current + step, target);
                    el.textContent = Math.floor(current).toLocaleString() + suffix;
                    if (current >= target) clearInterval(timer);
                }, 16);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-item strong').forEach(el => observer.observe(el));
}

// ================================================================
// 🎨 RIPPLE EFFECT on buttons
// ================================================================
function initRipple() {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn, .search-btn, .mob-nav-item');
        if (!btn) return;
        const ripple = document.createElement('span');
        const rect = btn.getBoundingClientRect();
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            left: ${e.clientX - rect.left}px;
            top: ${e.clientY - rect.top}px;
        `;
        btn.style.position = btn.style.position || 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
    });
}

// ================================================================
// 🌐 BACK TO TOP BUTTON
// ================================================================
function injectBackToTop() {
    if (document.getElementById('backToTopBtn')) return;
    const btn = document.createElement('button');
    btn.id = 'backToTopBtn';
    btn.className = 'back-to-top';
    btn.title = 'Yuqoriga';
    btn.innerHTML = '↑';
    btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        btn.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
}

// ================================================================
// AUTO INIT
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Core features
    injectScrollProgressBar();
    injectNotificationCenter();
    injectBackToTop();
    initRipple();

    // After slight delay (wait for cards to render)
    setTimeout(() => {
        injectWishlistButtons();
        addHotBadges();
        addViewCounters();
        initScrollReveal();
        initStickyFilters();
        updateAllWishlistButtons();
    }, 300);

    // Animated stats
    setTimeout(initAnimatedStats, 500);
});

/* ================================================================
   ADDITIONAL AUTH PAGE — Floating orbs inject
   ================================================================ */

// Auth sahifalariga floating orb qo'shish
(function injectAuthOrbs() {
    if (!document.body.classList.contains('auth-bg')) {
        // Login va Register sahifalarini aniqlash
        const isAuth = document.querySelector('.auth-card');
        if (!isAuth) return;
    }
    const isAuth = document.querySelector('.auth-card');
    if (!isAuth) return;

    document.body.classList.add('auth-bg');

    // 3 ta orb qo'shish
    [1, 2, 3].forEach(i => {
        const orb = document.createElement('div');
        orb.className = `auth-orb auth-orb-${i}`;
        document.body.insertBefore(orb, document.body.firstChild);
    });
})();

// Add-listing sahifasiga floating particles
(function injectParticles() {
    const hero = document.querySelector('.add-listing-hero');
    if (!hero) return;

    const sizes = [20, 35, 50, 28, 40, 25, 45, 30];
    const durations = [8, 12, 15, 10, 18, 9, 14, 11];
    const positions = [10, 20, 35, 50, 65, 75, 85, 95];

    sizes.forEach((size, i) => {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${positions[i]}%;
            animation-duration: ${durations[i]}s;
            animation-delay: ${-i * 1.5}s;
        `;
        hero.appendChild(p);
    });
})();


// ================================================================
//  WOW FEATURES JS — Premium Pack v4.0
//  Custom Cursor | 3D Tilt | Typewriter | Confetti | Parallax
//  Magnetic Buttons | Spotlight | Particles | Count-up
// ================================================================



// ----------------------------------------------------------------
//  🎭 3D CARD TILT
// ----------------------------------------------------------------
function initTilt() {
    document.querySelectorAll('.listing-card').forEach(card => {
        card.classList.add('tilt-card', 'spotlight-card');

        // Add shine layer
        if (!card.querySelector('.card-shine')) {
            const shine = document.createElement('div');
            shine.className = 'card-shine';
            card.style.position = 'relative';
            card.appendChild(shine);
        }

        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = e.clientX - r.left;
            const y = e.clientY - r.top;
            const cx = r.width / 2;
            const cy = r.height / 2;
            const rotX = ((y - cy) / cy) * -8;
            const rotY = ((x - cx) / cx) * 8;

            card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(6px) scale3d(1.02,1.02,1.02)`;
            card.style.transition = 'transform 0.1s ease';

            // Spotlight
            card.style.setProperty('--mx', x + 'px');
            card.style.setProperty('--my', y + 'px');
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0) scale3d(1,1,1)';
            card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.2,0.64,1)';
        });
    });
}

// ----------------------------------------------------------------
//  🌊 PARALLAX Hero
// ----------------------------------------------------------------
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    window.addEventListener('scroll', () => {
        const offset = window.scrollY;
        hero.style.backgroundPositionY = `calc(50% + ${offset * 0.4}px)`;
    }, { passive: true });
}

// ----------------------------------------------------------------
//  🧲 MAGNETIC BUTTONS
// ----------------------------------------------------------------
function initMagnetic() {
    document.querySelectorAll('.btn-primary, .btn-outline').forEach(btn => {
        btn.classList.add('magnetic-btn');
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px) scale(1.04)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0,0) scale(1)';
        });
    });
}

// ----------------------------------------------------------------
//  🔡 TYPEWRITER hero animation
// ----------------------------------------------------------------
function initTypewriter() {
    const el = document.querySelector('.hero-title .gradient-text, .hero h1 em, .hero h1 span');
    if (!el) return;

    const texts = [
        el.textContent.trim(),
        "Arzon va Qulay Ijaralar",
        "Ishonchli Mulkdorlar",
        "Toshkentdagi Eng Yaxshi",
    ];
    let ti = 0, ci = 0, deleting = false;

    // Add cursor
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    el.parentNode.insertBefore(cursor, el.nextSibling);

    function type() {
        const current = texts[ti];
        if (!deleting) {
            el.textContent = current.substring(0, ci + 1);
            ci++;
            if (ci === current.length) { deleting = true; setTimeout(type, 2000); return; }
        } else {
            el.textContent = current.substring(0, ci - 1);
            ci--;
            if (ci === 0) { deleting = false; ti = (ti + 1) % texts.length; }
        }
        setTimeout(type, deleting ? 50 : 90);
    }
    setTimeout(type, 2000); // 2 sekund kechikish
}

// ----------------------------------------------------------------
//  🔢 COUNT-UP animation for stats
// ----------------------------------------------------------------
function countUp(el, target, duration = 2000) {
    const start = 0;
    const step = target / (duration / 16);
    let cur = start;
    const timer = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(timer); }
        el.textContent = Math.floor(cur).toLocaleString();
    }, 16);
}

function initCountUp() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const val = parseInt(el.textContent.replace(/\D/g, ''));
            if (val > 0) countUp(el, val);
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-val, .hero-stat-val, .admin-stat-val').forEach(el => {
        observer.observe(el);
    });
}

// ----------------------------------------------------------------
//  🎉 CONFETTI burst
// ----------------------------------------------------------------
function launchConfetti(x, y) {
    const colors = ['#6366f1', '#f43f5e', '#f59e0b', '#10b981', '#8b5cf6', '#06b6d4', '#ec4899'];
    for (let i = 0; i < 80; i++) {
        const el = document.createElement('div');
        el.className = 'confetti-piece';
        el.style.cssText = `
            left: ${x || Math.random() * 100}%;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            width: ${6 + Math.random() * 8}px;
            height: ${8 + Math.random() * 10}px;
            animation-duration: ${1.5 + Math.random() * 2}s;
            animation-delay: ${Math.random() * 0.5}s;
            transform-origin: center;
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 4000);
    }
}

// E'lon submit da confetti
document.addEventListener('listing-submitted', () => launchConfetti(50, 0));

// Override submitListing function to trigger confetti
const _origSubmit = window.submitListing;
if (typeof window.submitListing === 'function') {
    window.submitListing = function () {
        _origSubmit && _origSubmit.apply(this, arguments);
        setTimeout(() => launchConfetti(50, 0), 300);
    };
}

// ----------------------------------------------------------------
//  🎨 HERO CANVAS PARTICLES
// ----------------------------------------------------------------
function initHeroParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'heroCanvas';
    hero.style.position = 'relative';
    hero.insertBefore(canvas, hero.firstChild);

    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
        W = canvas.width = hero.offsetWidth;
        H = canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < 60; i++) {
        particles.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: 1 + Math.random() * 2.5,
            dx: (Math.random() - 0.5) * 0.6,
            dy: (Math.random() - 0.5) * 0.6,
            alpha: 0.3 + Math.random() * 0.5
        });
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(165,180,252,${p.alpha})`;
            ctx.fill();

            p.x += p.dx;
            p.y += p.dy;
            if (p.x < 0 || p.x > W) p.dx *= -1;
            if (p.y < 0 || p.y > H) p.dy *= -1;
        });

        // Connect nearby particles
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
                if (d < 100) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(165,180,252,${0.15 * (1 - d / 100)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(draw);
    }
    draw();
}

// ----------------------------------------------------------------
//  🌟 WOW REVEAL (scroll trigger)
// ----------------------------------------------------------------
function initWowReveal() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section-card, .category-card, .stat-card, .feature-card').forEach(el => {
        el.classList.add('wow-reveal');
        obs.observe(el);
    });
}

// ----------------------------------------------------------------
//  🔔 NOTIFICATION BELL SHAKE
// ----------------------------------------------------------------
function initBellShake() {
    const bell = document.querySelector('.notif-btn');
    if (!bell) return;
    const unread = parseInt(document.querySelector('.notif-badge')?.textContent || '0');
    if (unread > 0) bell.classList.add('has-unread');
}

// ----------------------------------------------------------------
//  ✨ SMOOTH PAGE TRANSITIONS
// ----------------------------------------------------------------
(function initPageTransition() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position:fixed; inset:0; background:linear-gradient(135deg,#6366f1,#8b5cf6);
        z-index:999999; opacity:0; pointer-events:none;
        transition: opacity 0.35s ease;
    `;
    document.body.appendChild(overlay);

    // Fade IN on load
    window.addEventListener('load', () => {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
    });

    // Fade OUT before navigate
    document.addEventListener('click', e => {
        const link = e.target.closest('a[href]');
        if (!link) return;
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel') || link.target === '_blank') return;
        if (href.startsWith('http')) return;

        e.preventDefault();
        overlay.style.opacity = '0.85';
        overlay.style.pointerEvents = 'all';
        setTimeout(() => { window.location.href = href; }, 350);
    });
})();

// ----------------------------------------------------------------
//  🚀 AUTO-INIT all WOW features
// ----------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // Delayed init for better performance
    setTimeout(() => {
        initTilt();
        initMagnetic();
        initWowReveal();
        initCountUp();
        initBellShake();
    }, 400);

    setTimeout(() => {
        initHeroParticles();
        initParallax();
        // initTypewriter();
    }, 600);
});

// Override konfetti uchun — add-listing submit
(function patchSubmit() {
    const orig = window.submitListing;
    if (typeof orig === 'function' && !orig._patched) {
        window.submitListing = function (...args) {
            const result = orig.apply(this, args);
            setTimeout(() => launchConfetti(50, 0), 500);
            return result;
        };
        window.submitListing._patched = true;
    }
    // Agar keyinroq yuklanasa, ko'rsatamiz
    window.launchConfetti = launchConfetti;
})();

// ================================================================
//  WOW REVEAL FIX — Faqat text/card elementlarga animation
// ================================================================
(function fixWowReveal() {
    // Kartochkalar ha animator bo'lmasin — faqat section headings va info boxes
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

    // Fakaqt section headers va tips boxes
    document.querySelectorAll('.section-header, .wow-box, .tips-box, .auth-card, .add-listing-hero').forEach(el => {
        el.classList.add('wow-reveal');
        obs.observe(el);
    });

    // Listing va category kartlari — stagger bilan
    const cardObs = new IntersectionObserver(entries => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                const delay = (e.target.dataset.stagger || 0) * 80;
                setTimeout(() => {
                    e.target.style.opacity = '1';
                    e.target.style.transform = 'translateY(0) scale(1)';
                }, delay);
                cardObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });

    let staggerIdx = 0;
    document.querySelectorAll('.listing-card, .category-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px) scale(0.96)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)';
        el.dataset.stagger = staggerIdx % 6;
        staggerIdx++;
        cardObs.observe(el);
    });
})();

// ================================================================
// 🎆 MAGIC CURSOR EFFECT (Premium Feel)
// ================================================================
function initMagicCursor() {
    if (window.innerWidth < 768) return; // Only desktop
    
    const cursor = document.createElement('div');
    cursor.className = 'magic-cursor';
    document.body.appendChild(cursor);
    
    let isMoving = false;
    let cursorTimeout = null;
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = "translate(\px, \px)";
        cursor.classList.add('moving');
        
        clearTimeout(cursorTimeout);
        cursorTimeout = setTimeout(() => {
            cursor.classList.remove('moving');
        }, 150);
        
        const target = e.target;
        if (target.closest('a, button, .btn, .listing-card, input, select') && !target.closest('.no-cursor')) {
           cursor.classList.add('hover');
        } else {
           cursor.classList.remove('hover');
        }
    });

	document.addEventListener('mousedown', () => cursor.classList.add('click'));
	document.addEventListener('mouseup', () => cursor.classList.remove('click'));
}

document.addEventListener('DOMContentLoaded', initMagicCursor);
