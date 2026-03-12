// ================================================================
//  IjaraGo — GLOBAL WIDGETS
//  Inject into every page that includes this script after main.js
// ================================================================

// ================================================================
// 📱 MOBILE BOTTOM NAVIGATION
// ================================================================
(function injectMobileBottomNav() {
    const page = location.pathname.split('/').pop() || 'index.html';
    const nav = document.createElement('nav');
    nav.className = 'mobile-bottom-nav';
    nav.setAttribute('aria-label', 'Mobile navigation');
    nav.innerHTML = `
        <div class="mob-nav-items">
            <a href="index.html" class="mob-nav-item ${page === 'index.html' ? 'active' : ''}">
                <span class="mob-icon">🏠</span>
                <span class="mob-label">Bosh sahifa</span>
            </a>
            <a href="listings.html" class="mob-nav-item ${page === 'listings.html' ? 'active' : ''}">
                <span class="mob-icon">🔍</span>
                <span class="mob-label">E'lonlar</span>
            </a>
            <a href="compare.html" class="mob-nav-item ${page === 'compare.html' ? 'active' : ''}">
                <span class="mob-icon">⚖️</span>
                <span class="mob-label">Solishtir</span>
            </a>
            <a href="chat.html" class="mob-nav-item ${page === 'chat.html' ? 'active' : ''}" style="position:relative;">
                <span class="mob-icon">💬</span>
                <span class="mob-label">Chatlar</span>
                <span class="mob-nav-badge">3</span>
            </a>
            <a href="user-panel.html" class="mob-nav-item ${page === 'user-panel.html' ? 'active' : ''}">
                <span class="mob-icon">👤</span>
                <span class="mob-label">Panel</span>
            </a>
        </div>
    `;
    document.body.appendChild(nav);
})();

// ================================================================
// 🤖 FLOATING CHAT WIDGET (AI Yordam boti)
// ================================================================
const CW_BOTS = [
    "Salom! Men IjaraGo yordamchisiman. Qanday yordam bera olaman? 😊",
];

const CW_REPLIES = {
    default: ["Tushundim! Batafsil ma'lumot uchun operator bilan bog'laning.", "Savol bo'lsa yozing, yordam beramiz!", "Rahmat! Boshqa savolingiz bormi?"],
    uy: ["🏠 Uylar bo'limi bo'yicha ko'plab variantlarimiz bor. Listings sahifasiga tashrif buyuring!", "Toshkentda 200+ uy mavjud. Narzi 150k dan boshlanadi."],
    mashina: ["🚗 Mashinalar ijarasida 50+ variant bor. Toyota, Chevrolet, Hyundai va boshqalar.", "Haydovchi bilan yoki haydovchisiz variantlar mavjud."],
    payment: ["💳 Payme, Click, naqd pul va bank kartasi orqali to'lov qabul qilinadi.", "To'lov 100% xavfsiz. Depozit ijara tugagandan keyin qaytariladi."],
    cancel: ["❌ Bekor qilish: 48 soat oldindan buyurtmani bekor qilsangiz, to'liq pul qaytariladi.", "Kechroq bekor qilishda xizmat haqidan ushlab qolinadi."],
    reyting: ["⭐ To'liq tasdiqlangan egalar va 4.8+ reytingdagi e'lonlarni tanlashingizni maslahat beramiz.", "Har bir sharh haqiqiy ijarachilardan olinadi."],
};

(function injectChatWidget() {
    const skipPages = ['chat.html', 'admin.html', 'admin-login.html'];
    if (skipPages.includes(location.pathname.split('/').pop())) return;

    const widgetHTML = `
        <button class="chat-widget-btn" id="cwBtn" onclick="toggleChatWidget()" title="Yordam chatboti" aria-label="Yordam chatini ochish">
            🤖
            <span class="chat-widget-unread" id="cwUnread">1</span>
        </button>
        <div class="chat-widget-popup" id="cwPopup">
            <div class="cwp-header">
                <div class="cwp-avatar">🤖</div>
                <div>
                    <div class="cwp-name">IjaraBot — Yordam</div>
                    <div class="cwp-status">● Online · Odatda 1 daqiqada javob beradi</div>
                </div>
                <button class="cwp-close" onclick="toggleChatWidget()">✕</button>
            </div>
            <div class="cwp-messages" id="cwMessages"></div>
            <div class="cwp-quick-replies" id="cwQR">
                <button class="cwp-qr" onclick="cwSendQuick('Uylar haqida')">🏠 Uylar</button>
                <button class="cwp-qr" onclick="cwSendQuick('Mashinalar haqida')">🚗 Mashinalar</button>
                <button class="cwp-qr" onclick="cwSendQuick('To\'lov usullari')">💳 To'lov</button>
                <button class="cwp-qr" onclick="cwSendQuick('Bekor qilish')">❌ Bekor qilish</button>
                <button class="cwp-qr" onclick="cwSendQuick('Reyting va ishonch')">⭐ Reyting</button>
            </div>
            <div class="cwp-input-row">
                <input type="text" class="cwp-input" id="cwInput" placeholder="Savol yozing..." onkeydown="if(event.key==='Enter')cwSend()" />
                <button class="cwp-send" onclick="cwSend()">➤</button>
            </div>
        </div>
    `;

    const div = document.createElement('div');
    div.id = 'chatWidgetRoot';
    div.innerHTML = widgetHTML;
    document.body.appendChild(div);

    // Initial bot message after 2s
    setTimeout(() => {
        cwAddMessage(CW_BOTS[0], 'bot');
    }, 2000);
})();

let cwOpen = false;

function toggleChatWidget() {
    cwOpen = !cwOpen;
    document.getElementById('cwPopup').classList.toggle('open', cwOpen);
    document.getElementById('cwBtn').textContent = cwOpen ? '✕' : '🤖';
    if (cwOpen) {
        document.getElementById('cwUnread').style.display = 'none';
        document.getElementById('cwInput').focus();
    } else {
        document.getElementById('cwBtn').textContent = '🤖';
    }
}

function cwAddMessage(text, from) {
    const box = document.getElementById('cwMessages');
    const msg = document.createElement('div');
    msg.className = `cwp-msg ${from}`;
    msg.textContent = text;
    box.appendChild(msg);
    box.scrollTop = box.scrollHeight;
}

function cwSend() {
    const inp = document.getElementById('cwInput');
    const text = inp.value.trim();
    if (!text) return;
    cwAddMessage(text, 'user');
    inp.value = '';

    // Typing indicator
    const box = document.getElementById('cwMessages');
    const typing = document.createElement('div');
    typing.className = 'cwp-msg bot';
    typing.id = 'cwTyping';
    typing.style.color = 'var(--gray)';
    typing.style.fontStyle = 'italic';
    typing.textContent = 'Yozmoqda...';
    box.appendChild(typing);
    box.scrollTop = box.scrollHeight;

    setTimeout(() => {
        typing.remove();
        const reply = cwGetReply(text);
        cwAddMessage(reply, 'bot');
    }, 1000 + Math.random() * 800);
}

function cwSendQuick(text) {
    document.getElementById('cwInput').value = text;
    cwSend();
}

function cwGetReply(q) {
    q = q.toLowerCase();
    if (q.includes('uy') || q.includes('kvartira') || q.includes('xona')) return cwRand(CW_REPLIES.uy);
    if (q.includes('mashina') || q.includes('avto')) return cwRand(CW_REPLIES.mashina);
    if (q.includes("to'lov") || q.includes('payme') || q.includes('click') || q.includes('karta')) return cwRand(CW_REPLIES.payment);
    if (q.includes('bekor') || q.includes('cancel') || q.includes('qaytarish')) return cwRand(CW_REPLIES.cancel);
    if (q.includes('reyting') || q.includes('ishonch') || q.includes('tasdiq')) return cwRand(CW_REPLIES.reyting);
    return cwRand(CW_REPLIES.default);
}

function cwRand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }


// ================================================================
// 🌐 LANGUAGE SWITCHER
// ================================================================
const LANGS = {
    uz: {
        code: 'uz', flag: '🇺🇿', label: 'UZ',
        t: {
            search: "Qidirish",
            listings: "E'lonlar",
            categories: "Kategoriyalar",
            login: "Kirish",
            register: "Ro'yxatdan o'tish",
            home: "Bosh sahifa",
        }
    },
    ru: {
        code: 'ru', flag: '🇷🇺', label: 'RU',
        t: {
            search: "Поиск",
            listings: "Объявления",
            categories: "Категории",
            login: "Войти",
            register: "Регистрация",
            home: "Главная",
        }
    },
    en: {
        code: 'en', flag: '🇬🇧', label: 'EN',
        t: {
            search: "Search",
            listings: "Listings",
            categories: "Categories",
            login: "Sign In",
            register: "Sign Up",
            home: "Home",
        }
    },
};

let currentLang = localStorage.getItem('ij-lang') || 'uz';

function injectLangSwitcher() {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;
    const sw = document.createElement('div');
    sw.className = 'lang-switcher';
    sw.id = 'langSwitcher';
    Object.values(LANGS).forEach(lang => {
        const btn = document.createElement('button');
        btn.className = 'lang-btn' + (lang.code === currentLang ? ' active' : '');
        btn.textContent = lang.label;
        btn.title = lang.flag + ' ' + lang.label;
        btn.onclick = () => setLang(lang.code);
        sw.appendChild(btn);
    });
    navActions.insertBefore(sw, navActions.firstChild);
}

function setLang(code) {
    currentLang = code;
    localStorage.setItem('ij-lang', code);
    document.querySelectorAll('.lang-btn').forEach(b => {
        b.classList.toggle('active', b.textContent === LANGS[code].label);
    });
    // Demo: show toast
    const lang = LANGS[code];
    if (typeof showToast === 'function') showToast(`${lang.flag} Til o'zgartirildi: ${lang.label}`, 'success');
    // Update html lang attr
    document.documentElement.lang = code;
}

// ================================================================
// 🕓 RECENTLY VIEWED
// ================================================================
const RV_KEY = 'ij_rv';
const RV_MAX = 10;

function trackRecentlyViewed(id) {
    if (!id) return;
    let rv = JSON.parse(localStorage.getItem(RV_KEY) || '[]');
    rv = rv.filter(x => x !== id);
    rv.unshift(id);
    if (rv.length > RV_MAX) rv = rv.slice(0, RV_MAX);
    localStorage.setItem(RV_KEY, JSON.stringify(rv));
}

function getRecentlyViewed() {
    return JSON.parse(localStorage.getItem(RV_KEY) || '[]');
}

function clearRecentlyViewed() {
    localStorage.removeItem(RV_KEY);
    const section = document.getElementById('recentlyViewedSection');
    if (section) section.remove();
}

function renderRecentlyViewedSection(containerId) {
    const ids = getRecentlyViewed();
    if (ids.length === 0 || typeof LISTINGS === 'undefined') return;
    const page = location.pathname.split('/').pop();
    // Only show items not being viewed right now
    const urlId = parseInt(new URLSearchParams(location.search).get('id'));
    const items = ids.map(id => LISTINGS.find(l => l.id === id)).filter(l => l && l.id !== urlId).slice(0, 8);
    if (items.length === 0) return;

    const container = document.getElementById(containerId);
    if (!container) return;

    const section = document.createElement('section');
    section.className = 'recently-viewed';
    section.id = 'recentlyViewedSection';
    section.innerHTML = `
        <div class="container">
            <div class="rv-header">
                <h3>🕓 So'nggi ko'rilgan e'lonlar</h3>
                <button class="rv-clear" onclick="clearRecentlyViewed()">✕ Tozalash</button>
            </div>
            <div class="rv-grid">
                ${items.map(l => `
                    <a class="rv-card" href="listing-detail.html?id=${l.id}">
                        <img src="${l.image}" alt="${l.title}" loading="lazy"
                             onerror="this.src='https://via.placeholder.com/180x100'" />
                        <div class="rv-card-body">
                            <h5>${l.title}</h5>
                            <p>${typeof formatPrice === 'function' ? formatPrice(l.price) : l.price}/${l.priceType}</p>
                        </div>
                    </a>
                `).join('')}
            </div>
        </div>
    `;
    container.appendChild(section);
}

// ================================================================
// ✨ SKELETON LOADER HELPER
// ================================================================
function renderSkeletons(containerId, count = 6) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = Array(count).fill(`
        <div class="skeleton-card">
            <div class="skeleton skeleton-img"></div>
            <div class="skeleton-body">
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-sub"></div>
                <div class="skeleton skeleton-price"></div>
                <div style="display:flex;align-items:center;gap:10px;margin-top:6px;">
                    <div class="skeleton skeleton-avatar"></div>
                    <div class="skeleton skeleton-row"></div>
                </div>
            </div>
        </div>
    `).join('');
}

// ================================================================
// ⚖️ COMPARE FLOAT BAR
// ================================================================
let compareIds = JSON.parse(sessionStorage.getItem('ij_compare') || '[]');

(function injectCompareBar() {
    const bar = document.createElement('div');
    bar.className = 'compare-float-bar';
    bar.id = 'compareBar';
    bar.innerHTML = `
        <span>⚖️ Solishtirish:</span>
        <span class="compare-float-count" id="compareCount">0</span>
        <span style="font-size:13px;opacity:.7;" id="compareNames"></span>
        <button class="compare-float-go" onclick="goCompare()">Solishtirish →</button>
        <button class="compare-float-clear" onclick="clearCompare()">✕</button>
    `;
    document.body.appendChild(bar);
    updateCompareBar();
})();

function addToCompare(id) {
    if (compareIds.includes(id)) {
        compareIds = compareIds.filter(x => x !== id);
        showToast('Solishtirishdan olib tashlandi', 'info');
    } else if (compareIds.length >= 3) {
        showToast('Maksimum 3 ta e\'lon solishtirish mumkin!', 'info');
        return;
    } else {
        compareIds.push(id);
        showToast('⚖️ Solishtirishga qo\'shildi!', 'success');
    }
    sessionStorage.setItem('ij_compare', JSON.stringify(compareIds));
    updateCompareBar();

    // Toggle button state
    document.querySelectorAll(`.compare-add-btn[data-id="${id}"]`).forEach(btn => {
        btn.classList.toggle('added', compareIds.includes(id));
        btn.textContent = compareIds.includes(id) ? '✔ Solishtir' : '⚖️ Solishtir';
    });
}

function updateCompareBar() {
    const bar = document.getElementById('compareBar');
    if (!bar) return;
    bar.classList.toggle('show', compareIds.length >= 2);
    document.getElementById('compareCount').textContent = compareIds.length;
    if (typeof LISTINGS !== 'undefined') {
        const names = compareIds.map(id => {
            const l = LISTINGS.find(x => x.id === id);
            return l ? l.title.split(' ').slice(0, 2).join(' ') : '';
        }).filter(Boolean);
        document.getElementById('compareNames').textContent = names.join(' vs ');
    }
}

function goCompare() {
    if (compareIds.length < 2) {
        showToast('Solishtirish uchun kamida 2 ta e\'lon tanlang', 'info');
        return;
    }
    location.href = `compare.html?ids=${compareIds.join(',')}`;
}

function clearCompare() {
    compareIds = [];
    sessionStorage.removeItem('ij_compare');
    updateCompareBar();
    document.querySelectorAll('.compare-add-btn').forEach(btn => {
        btn.classList.remove('added');
        btn.textContent = '⚖️ Solishtir';
    });
    showToast('Solishtirish ro\'yxati tozalandi', 'info');
}

// ================================================================
// 🏆 TOP OWNERS section helper
// ================================================================
function renderTopOwners(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    const owners = [
        { name: 'Aziz Karimov', img: 'https://i.pravatar.cc/80?img=11', listings: 12, rating: 4.9, earnings: '42M', rank: '🥇', cls: 'gold' },
        { name: 'Malika Rahimova', img: 'https://i.pravatar.cc/80?img=44', listings: 9, rating: 4.8, earnings: '28M', rank: '🥈', cls: 'silver' },
        { name: 'Bobur Yusupov', img: 'https://i.pravatar.cc/80?img=22', listings: 7, rating: 4.7, earnings: '19M', rank: '🥉', cls: 'bronze' },
        { name: 'Dilnoza Hasanova', img: 'https://i.pravatar.cc/80?img=47', listings: 6, rating: 4.8, earnings: '15M', rank: '4️⃣', cls: '' },
        { name: 'Kamol Eshmatov', img: 'https://i.pravatar.cc/80?img=33', listings: 5, rating: 4.6, earnings: '12M', rank: '5️⃣', cls: '' },
    ];

    el.innerHTML = `
        <section class="top-owners-section">
            <div class="container">
                <div class="section-header">
                    <h2>🏆 Eng Yaxshi Egalar</h2>
                    <p>Reyting, ishonch va mamnun mijozlar bo'yicha</p>
                </div>
                <div class="owners-grid">
                    ${owners.map(o => `
                        <div class="owner-top-card ${o.cls}" onclick="showToast('${o.name} profiliga o\\'tilmoqda...', 'info')">
                            <div class="owner-top-rank">${o.rank}</div>
                            <img src="${o.img}" class="owner-top-img" alt="${o.name}"
                                 onerror="this.src='https://i.pravatar.cc/80'" />
                            <div class="owner-top-name">${o.name}</div>
                            <div class="owner-top-listings">${o.listings} ta e'lon</div>
                            <div class="owner-top-rating">★ ${o.rating}</div>
                            <div class="owner-top-earnings">+${o.earnings} so'm</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>
    `;
}

// ================================================================
// AUTO-INIT on DOMContentLoaded
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
    injectLangSwitcher();

    // Skeleton demo on listings page
    const grid = document.getElementById('listingsPageGrid');
    if (grid && grid.children.length === 0) {
        renderSkeletons('listingsPageGrid', 6);
    }

    // Track recently viewed on listing-detail
    const params = new URLSearchParams(location.search);
    const lid = parseInt(params.get('id'));
    if (!isNaN(lid) && lid > 0) trackRecentlyViewed(lid);

    // Render recently viewed on appropriate pages
    const rvTarget = document.getElementById('rvContainer') || document.querySelector('footer');
    if (rvTarget && rvTarget.id !== 'rvContainer') {
        // Inject before footer
        const rvDiv = document.createElement('div');
        rvDiv.id = 'rvContainer';
        rvTarget.parentNode.insertBefore(rvDiv, rvTarget);
        setTimeout(() => renderRecentlyViewedSection('rvContainer'), 300);
    }

    // Render top owners on index
    const page = location.pathname.split('/').pop();
    if (page === 'index.html' || page === '') {
        const topOwnersEl = document.getElementById('topOwnersContainer');
        if (topOwnersEl) renderTopOwners('topOwnersContainer');
    }

    // Restore compare button states
    if (compareIds.length > 0) {
        compareIds.forEach(id => {
            document.querySelectorAll(`.compare-add-btn[data-id="${id}"]`).forEach(btn => {
                btn.classList.add('added');
                btn.textContent = '✔ Solishtir';
            });
        });
    }
});
