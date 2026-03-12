// ================================================================
//  IjaraGo — SUPPORT CHAT WIDGET v2.0
//  "Yordam kerakmi?" - To'liq ishlaydigan AI yordamchi chatbot
//  Barcha sahifalarda avtomatik yuklanadi
// ================================================================

(function () {
    'use strict';

    // ── Sozlamalar ─────────────────────────────────────────────
    const BOT_NAME = 'IjaraBot';
    const BOT_AVATAR = '🤖';
    const TYPING_DELAY_MS = 900;
    const OPEN_DELAY_MS = 3500; // sahifa yuklanganidan keyin pulsatsiya boshlanadi

    // ── Bilim bazasi (javoblar) ────────────────────────────────
    const KB = {
        salom: ['Salom! 👋 Sizga qanday yordam bera olaman? E\'lon qidirish, ro\'yxatdan o\'tish yoki boshqa savol bo\'lsa yozing!', 'Assalomu alaykum! IjaraGo yordamchisiman. Nima haqida bilmoqchisiz? 😊'],
        uy: ['🏠 Uylar bo\'limida 840+ ta e\'lon mavjud! Narxlar 150,000 so\'mdan kuniga boshlanadi.\n\n👉 <a href="listings.html?cat=uy" class="sc-link">E\'lonlarni ko\'rish →</a>', 'Toshkent, Samarqand, Buxoro va boshqa shaharlarda uylar bor. Qaysi shahar kerak?'],
        mashina: ['🚗 Mashinalar bo\'limida 520+ variant bor!\n• Toyota, Chevrolet, Hyundai va boshqalar\n• Haydovchi bilan yoki haydovchisiz\n• Kuniga 200,000 so\'mdan\n\n👉 <a href="listings.html?cat=mashina" class="sc-link">Mashinalarni ko\'rish →</a>'],
        texnika: ['🔌 Texnika ijarasida kamera, proyektor, konditsioner va ko\'p narsalar bor!\n\n👉 <a href="listings.html?cat=texnika" class="sc-link">Texnikalarni ko\'rish →</a>'],
        tolov: ['💳 Qabul qilinadigan to\'lov usullari:\n• Payme ✅\n• Click ✅\n• Bank kartasi ✅\n• Naqd pul ✅\n\nBarcha to\'lovlar 100% xavfsiz!'],
        depozit: ['🔒 Depozit haqida:\n• Depozit miqdori ijara summasiga teng\n• Ijara tugagach to\'liq qaytariladi\n• Buyum shikastlanmasa depozit qaytariladi'],
        bekor: ['❌ Bekor qilish shartlari:\n• 48 soat oldin — to\'liq pul qaytariladi ✅\n• 24 soat oldin — 50% qaytariladi ℹ️\n• Kechroq — qaytarilmaydi ❌'],
        royxat: ['📝 Ro\'yxatdan o\'tish juda oson!\n1. "Ro\'yxatdan o\'tish" tugmasini bosing\n2. Ma\'lumotlaringizni kiriting\n3. Tasdiqlash kodini kiriting\n\n👉 <a href="register.html" class="sc-link">Ro\'yxatdan o\'tish →</a>'],
        elon: ['➕ E\'lon qo\'shish uchun:\n1. Avval ro\'yxatdan o\'ting\n2. "E\'lon qo\'shish" tugmasini bosing\n3. 3 oddiy qadamni bajaring\n\nAdmin tasdiqlashidan keyin e\'lon chiqadi! ⏱️\n\n👉 <a href="add-listing.html" class="sc-link">E\'lon qo\'shish →</a>'],
        narx: ['💰 Narxlar kategoriyaga qarab farq qiladi:\n• Uylar: 150K – 2M so\'m/kun\n• Mashinalar: 200K – 800K so\'m/kun\n• Texnika: 50K – 500K so\'m/kun\n\nBarcha narxlar muzokarali!'],
        reyting: ['⭐ Reyting tizimi haqida:\n• Har bir ijara tugagach baholash qoldiriladi\n• 1–5 yulduz shkala\n• 4.5+ reyting = "Premium" nishon\n• Hamma sharhlar haqiqiy foydalanuvchilardan'],
        aloqa: ['📞 Biz bilan bog\'lanish:\n• 📧 info@ijarago.uz\n• 📱 +998 71 123 45 67\n• 🕐 Ish soati: 9:00 – 18:00\n\n👉 <a href="contact.html" class="sc-link">Aloqa sahifasi →</a>'],
        default: ['Tushundim! Bu savol bo\'yicha operatorlarimiz yordam beradi. 📞 +998 71 123 45 67 ga qo\'ng\'iroq qiling yoki <a href="contact.html" class="sc-link">aloqa sahifasiga</a> o\'ting.', 'Qiziqarli savol! Batafsil ma\'lumot uchun <a href="faq.html" class="sc-link">FAQ sahifamizni</a> o\'qing. 📖', 'Rahmat savolingiz uchun! Boshqa savolingiz bo\'lsa, bemalol yozing 😊']
    };

    // Quick reply tugmalari
    const QUICK_REPLIES = [
        { label: '🏠 Uylar', key: 'uy' },
        { label: '🚗 Mashinalar', key: 'mashina' },
        { label: '💳 To\'lov', key: 'tolov' },
        { label: '➕ E\'lon qo\'shish', key: 'elon' },
        { label: '❌ Bekor qilish', key: 'bekor' },
        { label: '📞 Aloqa', key: 'aloqa' },
    ];

    // ── HTML inject ────────────────────────────────────────────
    function injectStyles() {
        if (document.getElementById('sc-styles')) return;
        const style = document.createElement('style');
        style.id = 'sc-styles';
        style.textContent = `
            /* ── Support Chat Widget Styles ── */
            #sc-btn {
                position: fixed;
                bottom: 28px;
                right: 28px;
                background: linear-gradient(135deg, #4f46e5, #ec4899);
                color: white;
                padding: 14px 22px;
                border-radius: 100px;
                font-weight: 700;
                font-size: 15px;
                font-family: 'Inter', sans-serif;
                box-shadow: 0 8px 30px rgba(79, 70, 229, 0.5), 0 0 0 0 rgba(236,72,153,0.4);
                cursor: pointer;
                z-index: 99999;
                border: none;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: transform 0.3s cubic-bezier(0.175,0.885,0.32,1.275), box-shadow 0.3s ease, opacity 0.3s;
                animation: sc-btn-pulse 2.5s ease-in-out infinite;
                user-select: none;
                letter-spacing: 0.2px;
            }
            @keyframes sc-btn-pulse {
                0%, 100% { box-shadow: 0 8px 30px rgba(79,70,229,0.45), 0 0 0 0 rgba(236,72,153,0.35); }
                50%       { box-shadow: 0 12px 40px rgba(79,70,229,0.6), 0 0 0 10px rgba(236,72,153,0); }
            }
            #sc-btn:hover {
                transform: translateY(-4px) scale(1.04);
                box-shadow: 0 16px 45px rgba(79,70,229,0.6);
                animation: none;
            }
            #sc-btn.hidden {
                opacity: 0;
                transform: scale(0.7) translateY(20px);
                pointer-events: none;
            }
            #sc-btn .sc-btn-dot {
                width: 8px; height: 8px;
                background: #10b981;
                border-radius: 50%;
                flex-shrink: 0;
                box-shadow: 0 0 0 2px rgba(16,185,129,0.3);
                animation: sc-dot-blink 1.5s ease infinite;
            }
            @keyframes sc-dot-blink {
                0%, 100% { opacity: 1; }
                50%       { opacity: 0.3; }
            }

            /* ── Panel ── */
            #sc-panel {
                position: fixed;
                bottom: 100px;
                right: 28px;
                width: 360px;
                max-height: 600px;
                background: #ffffff;
                border-radius: 24px;
                box-shadow: 0 25px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06);
                z-index: 99998;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                opacity: 0;
                transform: translateY(24px) scale(0.92);
                pointer-events: none;
                transition: all 0.35s cubic-bezier(0.175,0.885,0.32,1.275);
                font-family: 'Inter', sans-serif;
            }
            #sc-panel.open {
                opacity: 1;
                transform: translateY(0) scale(1);
                pointer-events: all;
            }
            body.dark #sc-panel {
                background: #1e293b;
                box-shadow: 0 25px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06);
            }

            /* ── Header ── */
            .sc-header {
                background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%);
                padding: 16px 20px;
                display: flex;
                align-items: center;
                gap: 12px;
                flex-shrink: 0;
            }
            .sc-avatar {
                width: 46px; height: 46px;
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                font-size: 22px;
                flex-shrink: 0;
                border: 2px solid rgba(255,255,255,0.3);
                animation: sc-avatar-float 3s ease-in-out infinite;
            }
            @keyframes sc-avatar-float {
                0%, 100% { transform: translateY(0); }
                50%       { transform: translateY(-3px); }
            }
            .sc-header-info { flex: 1; min-width: 0; }
            .sc-header-info b { display: block; color: white; font-size: 15px; font-weight: 700; }
            .sc-header-info small { color: rgba(255,255,255,0.8); font-size: 12px; display: flex; align-items: center; gap: 4px; margin-top: 1px; }
            .sc-online-dot {
                display: inline-block; width: 7px; height: 7px;
                background: #10b981; border-radius: 50%;
                box-shadow: 0 0 0 2px rgba(16,185,129,0.3);
                animation: sc-dot-blink 1.5s ease infinite;
            }
            .sc-close-btn {
                background: rgba(255,255,255,0.15);
                border: none; color: white;
                width: 32px; height: 32px;
                border-radius: 50%;
                cursor: pointer; font-size: 15px;
                display: flex; align-items: center; justify-content: center;
                transition: all 0.2s; flex-shrink: 0;
            }
            .sc-close-btn:hover { background: rgba(255,255,255,0.3); transform: rotate(90deg); }

            /* ── Messages ── */
            .sc-messages {
                flex: 1;
                overflow-y: auto;
                padding: 16px;
                display: flex;
                flex-direction: column;
                gap: 10px;
                background: #f8fafc;
                max-height: 340px;
                scroll-behavior: smooth;
            }
            body.dark .sc-messages { background: #0f172a; }
            .sc-messages::-webkit-scrollbar { width: 4px; }
            .sc-messages::-webkit-scrollbar-track { background: transparent; }
            .sc-messages::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 2px; }
            body.dark .sc-messages::-webkit-scrollbar-thumb { background: #334155; }

            /* ── Buble ── */
            .sc-msg {
                max-width: 85%;
                padding: 10px 14px;
                border-radius: 16px;
                font-size: 13.5px;
                line-height: 1.5;
                word-break: break-word;
                animation: sc-msg-in 0.3s cubic-bezier(0.34,1.2,0.64,1) both;
            }
            @keyframes sc-msg-in {
                from { opacity: 0; transform: translateY(10px) scale(0.95); }
                to   { opacity: 1; transform: translateY(0) scale(1); }
            }
            .sc-msg.bot {
                background: white;
                color: #1e293b;
                border-bottom-left-radius: 4px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.07);
                align-self: flex-start;
            }
            body.dark .sc-msg.bot { background: #1e293b; color: #f1f5f9; box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
            .sc-msg.user {
                background: linear-gradient(135deg, #4f46e5, #7c3aed);
                color: white;
                border-bottom-right-radius: 4px;
                align-self: flex-end;
            }
            .sc-msg .sc-link {
                color: #4f46e5;
                text-decoration: underline;
                font-weight: 600;
            }
            body.dark .sc-msg .sc-link { color: #818cf8; }
            .sc-msg.user .sc-link { color: rgba(255,255,255,0.85); }
            .sc-msg-time {
                font-size: 10px;
                opacity: 0.55;
                margin-top: 4px;
                display: block;
            }

            /* ── Typing indicator ── */
            .sc-typing {
                display: flex; gap: 4px; align-items: center;
                padding: 12px 14px;
                background: white;
                border-radius: 16px;
                border-bottom-left-radius: 4px;
                align-self: flex-start;
                box-shadow: 0 2px 8px rgba(0,0,0,0.07);
                animation: sc-msg-in 0.3s both;
            }
            body.dark .sc-typing { background: #1e293b; }
            .sc-typing span {
                width: 7px; height: 7px;
                background: #94a3b8;
                border-radius: 50%;
                animation: sc-typing-bounce 1.2s ease-in-out infinite;
            }
            .sc-typing span:nth-child(2) { animation-delay: 0.2s; }
            .sc-typing span:nth-child(3) { animation-delay: 0.4s; }
            @keyframes sc-typing-bounce {
                0%, 60%, 100% { transform: translateY(0); }
                30%            { transform: translateY(-6px); }
            }

            /* ── Quick replies ── */
            .sc-quick-replies {
                padding: 8px 16px 4px;
                display: flex; flex-wrap: wrap; gap: 6px;
                background: #f8fafc;
                flex-shrink: 0;
            }
            body.dark .sc-quick-replies { background: #0f172a; }
            .sc-qr-btn {
                background: white;
                border: 1.5px solid #e2e8f0;
                color: #374151;
                padding: 6px 12px;
                border-radius: 100px;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.34,1.2,0.64,1);
                font-family: 'Inter', sans-serif;
                white-space: nowrap;
            }
            .sc-qr-btn:hover {
                background: #4f46e5;
                border-color: #4f46e5;
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(79,70,229,0.3);
            }
            body.dark .sc-qr-btn {
                background: #1e293b;
                border-color: #334155;
                color: #cbd5e1;
            }
            body.dark .sc-qr-btn:hover {
                background: #4f46e5;
                border-color: #4f46e5;
                color: white;
            }

            /* ── Input area ── */
            .sc-input-row {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px 16px;
                background: white;
                border-top: 1px solid #f1f5f9;
                flex-shrink: 0;
            }
            body.dark .sc-input-row { background: #1e293b; border-color: #334155; }
            #sc-input {
                flex: 1;
                border: 1.5px solid #e2e8f0;
                border-radius: 100px;
                padding: 10px 16px;
                font-size: 13.5px;
                font-family: 'Inter', sans-serif;
                outline: none;
                background: #f8fafc;
                color: #1e293b;
                transition: border-color 0.2s, box-shadow 0.2s;
            }
            #sc-input:focus {
                border-color: #4f46e5;
                box-shadow: 0 0 0 3px rgba(79,70,229,0.12);
                background: white;
            }
            body.dark #sc-input {
                background: #0f172a;
                border-color: #334155;
                color: #f1f5f9;
            }
            body.dark #sc-input:focus {
                border-color: #6366f1;
                background: #1e293b;
            }
            #sc-send {
                width: 40px; height: 40px;
                background: linear-gradient(135deg, #4f46e5, #7c3aed);
                border: none;
                border-radius: 50%;
                color: white;
                font-size: 17px;
                cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                transition: all 0.2s cubic-bezier(0.34,1.2,0.64,1);
                flex-shrink: 0;
                box-shadow: 0 4px 12px rgba(79,70,229,0.35);
            }
            #sc-send:hover { transform: scale(1.12) rotate(-10deg); box-shadow: 0 6px 20px rgba(79,70,229,0.5); }
            #sc-send:active { transform: scale(0.95); }

            /* ── Footer note ── */
            .sc-footer-note {
                text-align: center;
                font-size: 11px;
                color: #94a3b8;
                padding: 6px 16px 10px;
                background: white;
                flex-shrink: 0;
            }
            body.dark .sc-footer-note { background: #1e293b; color: #475569; }

            /* ── Responsive ── */
            @media (max-width: 480px) {
                #sc-panel { width: calc(100vw - 24px); right: 12px; bottom: 88px; }
                #sc-btn { bottom: 80px; right: 16px; padding: 12px 18px; font-size: 14px; }
            }
        `;
        document.head.appendChild(style);
    }

    function injectHTML() {
        if (document.getElementById('sc-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'sc-btn';
        btn.setAttribute('aria-label', 'Yordam chatini ochish');
        btn.setAttribute('title', 'Yordam kerakmi?');
        btn.innerHTML = `<span class="sc-btn-dot"></span>💬 Yordam kerakmi?`;
        btn.addEventListener('click', toggleChat);
        document.body.appendChild(btn);

        const panel = document.createElement('div');
        panel.id = 'sc-panel';
        panel.setAttribute('aria-label', 'Yordam chat paneli');
        panel.innerHTML = `
            <div class="sc-header">
                <div class="sc-avatar">${BOT_AVATAR}</div>
                <div class="sc-header-info">
                    <b>${BOT_NAME} — IjaraGo Yordamchisi</b>
                    <small><span class="sc-online-dot"></span> Hozir onlayn · Odatda 1 daqiqada javob</small>
                </div>
                <button class="sc-close-btn" id="sc-close" aria-label="Yopish" title="Yopish">✕</button>
            </div>
            <div class="sc-messages" id="sc-messages"></div>
            <div class="sc-quick-replies" id="sc-qr"></div>
            <div class="sc-input-row">
                <input type="text" id="sc-input" placeholder="Savol yozing..." maxlength="300" />
                <button id="sc-send" aria-label="Yuborish">➤</button>
            </div>
            <div class="sc-footer-note">🔒 IjaraGo · Xavfsiz va shifrlangan</div>
        `;
        document.body.appendChild(panel);

        // Events
        document.getElementById('sc-close').addEventListener('click', toggleChat);
        document.getElementById('sc-send').addEventListener('click', handleSend);
        document.getElementById('sc-input').addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
        });

        // Quick reply buttons
        const qrContainer = document.getElementById('sc-qr');
        QUICK_REPLIES.forEach(function (qr) {
            const btn2 = document.createElement('button');
            btn2.className = 'sc-qr-btn';
            btn2.textContent = qr.label;
            btn2.addEventListener('click', function () { sendMessage(qr.label, qr.key); });
            qrContainer.appendChild(btn2);
        });

        // Initial bot greeting after delay
        setTimeout(function () {
            addBotMessage('Salom! 👋 Men <b>IjaraBot</b>man — IjaraGo\'ning AI yordamchisi.<br>E\'lon qidirish, to\'lov, bron yoki boshqa savollar bo\'lsa yordam beraman!');
        }, 500);
    }

    // ── State ───────────────────────────────────────────────────
    var isOpen = false;

    function toggleChat() {
        isOpen = !isOpen;
        var panel = document.getElementById('sc-panel');
        var btn = document.getElementById('sc-btn');
        if (!panel || !btn) return;

        panel.classList.toggle('open', isOpen);
        btn.classList.toggle('hidden', isOpen);

        if (isOpen) {
            setTimeout(function () {
                var inp = document.getElementById('sc-input');
                if (inp) inp.focus();
            }, 350);
        }
    }

    // ── Messages ────────────────────────────────────────────────
    function now() {
        return new Date().toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit' });
    }

    function addBotMessage(html) {
        var box = document.getElementById('sc-messages');
        if (!box) return;
        var el = document.createElement('div');
        el.className = 'sc-msg bot';
        el.innerHTML = html + '<span class="sc-msg-time">' + now() + '</span>';
        box.appendChild(el);
        box.scrollTop = box.scrollHeight;
    }

    function addUserMessage(text) {
        var box = document.getElementById('sc-messages');
        if (!box) return;
        var el = document.createElement('div');
        el.className = 'sc-msg user';
        el.textContent = text;
        var timeEl = document.createElement('span');
        timeEl.className = 'sc-msg-time';
        timeEl.textContent = now();
        el.appendChild(timeEl);
        box.appendChild(el);
        box.scrollTop = box.scrollHeight;
    }

    function showTyping() {
        var box = document.getElementById('sc-messages');
        if (!box) return null;
        var el = document.createElement('div');
        el.className = 'sc-typing';
        el.id = 'sc-typing-indicator';
        el.innerHTML = '<span></span><span></span><span></span>';
        box.appendChild(el);
        box.scrollTop = box.scrollHeight;
        return el;
    }

    function removeTyping() {
        var el = document.getElementById('sc-typing-indicator');
        if (el) el.remove();
    }

    function getBotReply(key) {
        var arr = KB[key] || KB['default'];
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function detectKey(text) {
        var t = text.toLowerCase();
        if (/salom|assalom|привет|hello|hi\b/i.test(t)) return 'salom';
        if (/uy|kvartira|xona|komnata|apartment|dach/i.test(t)) return 'uy';
        if (/mashina|avto|car|toyota|chevrolet|nexia|malibu/i.test(t)) return 'mashina';
        if (/texnika|kamera|proyektor|konditsioner|electr/i.test(t)) return 'texnika';
        if (/to'lov|tolov|payme|click|karta|payment|pul/i.test(t)) return 'tolov';
        if (/depozit|garanti/i.test(t)) return 'depozit';
        if (/bekor|cancel|qaytarish|refund/i.test(t)) return 'bekor';
        if (/ro'yxat|royxat|register|kirish|login/i.test(t)) return 'royxat';
        if (/e'lon|elon|qo'shish|add|post/i.test(t)) return 'elon';
        if (/narx|price|qancha|necha|cost/i.test(t)) return 'narx';
        if (/reyting|rating|ishonch|trust|star|yulduz/i.test(t)) return 'reyting';
        if (/aloqa|contact|telefon|phone|email|murojaat/i.test(t)) return 'aloqa';
        return 'default';
    }

    function sendMessage(text, key) {
        text = (text || '').trim();
        if (!text) return;

        addUserMessage(text);
        var inp = document.getElementById('sc-input');
        if (inp) inp.value = '';

        var key2 = key || detectKey(text);
        showTyping();

        setTimeout(function () {
            removeTyping();
            addBotMessage(getBotReply(key2));
        }, TYPING_DELAY_MS + Math.random() * 400);
    }

    function handleSend() {
        var inp = document.getElementById('sc-input');
        if (!inp) return;
        var text = inp.value.trim();
        if (!text) return;
        sendMessage(text);
    }

    // ── Init ────────────────────────────────────────────────────
    function init() {
        injectStyles();
        injectHTML();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
