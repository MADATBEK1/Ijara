// ================================================================
//  IjaraGo — AUTH TIZIMI (localStorage asosida)
// ================================================================

const AUTH = {
    USERS_KEY: 'ij_users',
    SESSION_KEY: 'ij_session',

    getUsers() {
        return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    },
    saveUsers(users) {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    },
    getCurrentUser() {
        const session = localStorage.getItem(this.SESSION_KEY);
        if (!session) return null;
        try { return JSON.parse(session); } catch { return null; }
    },

    register(data) {
        const users = this.getUsers();
        if (users.find(u => u.email === data.email)) {
            return { success: false, error: 'Bu email allaqachon ro\'yxatdan o\'tgan!' };
        }
        const safeLastName = data.lastName || '';
        const user = {
            id: 'u_' + Date.now(),
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            password: data.password,
            role: data.role || 'user',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.firstName + ' ' + safeLastName)}&background=random&color=fff&bold=true&size=128`,
            createdAt: new Date().toISOString(),
            status: 'active'
        };
        users.push(user);
        this.saveUsers(users);
        this.setSession(user);
        return { success: true, user };
    },

    login(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) return { success: false, error: 'Email yoki parol noto\'g\'ri!' };
        if (user.status === 'blocked') return { success: false, error: 'Hisobingiz bloklangan!' };
        this.setSession(user);
        return { success: true, user };
    },

    setSession(user) {
        const safeUser = { ...user };
        delete safeUser.password;
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(safeUser));
    },

    logout() {
        localStorage.removeItem(this.SESSION_KEY);
        window.location.href = 'index.html';
    },

    isLoggedIn() { return !!this.getCurrentUser(); },
    isOwner() {
        const u = this.getCurrentUser();
        return u && (u.role === 'owner' || u.role === 'admin');
    },
    isAdmin() {
        const u = this.getCurrentUser();
        return u && u.role === 'admin';
    },

    // ============================================================
    //  NAVBAR yangilash — BARCHA static tugmalarni olib, to'g'ri qo'yish
    // ============================================================
    updateNavbar() {
        const user = this.getCurrentUser();
        const actionsEl = document.querySelector('.nav-actions');
        if (!actionsEl) return;

        // 1. nav-actions dagi BARCHA a[href*=login], a[href*=register] static tugmalarini o'chirish
        actionsEl.querySelectorAll(
            'a[href*="login.html"], a[href*="register.html"], .nav-auth-btn, .nav-user-menu'
        ).forEach(el => el.remove());

        // 2. nav-links dagi "E'lon qo'shish" linkini qo'shish (agar yo'q bo'lsa)
        const navLinks = document.querySelector('.nav-links');
        if (navLinks && !navLinks.querySelector('a[href="add-listing.html"]')) {
            const faqLi = navLinks.querySelector('a[href="faq.html"]')?.parentElement;
            const alLi = document.createElement('li');
            alLi.innerHTML = `<a href="add-listing.html" style="display:flex;align-items:center;gap:5px;background:linear-gradient(135deg,#10b981,#059669);color:white;padding:6px 14px;border-radius:100px;font-weight:700;font-size:13px;text-decoration:none;transition:all .25s ease;box-shadow:0 4px 12px rgba(16,185,129,.35);" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 20px rgba(16,185,129,.5)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='0 4px 12px rgba(16,185,129,.35)'">➕ E'lon qo'shish</a>`;
            if (faqLi) {
                faqLi.after(alLi);
            } else {
                navLinks.appendChild(alLi);
            }
        }

        // 3. Kirgan/Kirmagani qarab tugmalar qo'yish
        if (user) {
            // Agar oldingi bazada qolgan 'pravatar' bo'lsa, harfli avatarga majburiy o'zgartiramiz:
            let displayAvatar = user.avatar;
            if (displayAvatar && displayAvatar.includes('pravatar.cc')) {
                displayAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName + ' ' + (user.lastName || ''))}&background=8b5cf6&color=fff&bold=true&size=128`;
            }

            const roleName = user.role === 'admin' ? 'Super Admin' : (user.role === 'owner' ? 'E\'lon Egasi' : 'Free');
            const roleColor = user.role === 'admin' ? '#ef4444' : (user.role === 'owner' ? '#f59e0b' : '#94a3b8');

            actionsEl.insertAdjacentHTML('beforeend', `
                <div class="nav-user-menu" id="navUserMenu">
                    <button class="nav-user-trigger" onclick="toggleUserMenu()" id="navUserTrigger">
                        <img src="${displayAvatar}" alt="Avatar" />
                    </button>
                    <div class="nav-user-dropdown" id="navUserDropdown">
                        <div class="nav-user-info">
                            <img src="${displayAvatar}" alt="Avatar" />
                            <div>
                                <strong class="gpt-name">${user.firstName.toUpperCase()}</strong>
                                <span class="gpt-role" style="color: ${roleColor}">${roleName}</span>
                            </div>
                        </div>
                        <a href="${user.role === 'owner' ? 'owner-panel.html' : 'user-panel.html'}" class="nav-dd-item"><i>👤</i> Mening panelim</a>
                        <a href="add-listing.html" class="nav-dd-item"><i>➕</i> E'lon qo'shish</a>
                        <div class="nav-dd-divider"></div>
                        <a href="settings.html" class="nav-dd-item"><i>⚙️</i> Sozlamalar</a>
                        ${user.role === 'admin' ? '<a href="admin.html" class="nav-dd-item"><i>🛡️</i> Admin panel</a>' : ''}
                        <div class="nav-dd-divider"></div>
                        <button class="nav-dd-item nav-dd-logout" onclick="AUTH.logout()"><i>🚪</i> Chiqish</button>
                    </div>
                </div>
            `);
        } else {
            // Kirmaganda faqat 1ta Kirish + 1ta Ro'yxatdan o'tish
            actionsEl.insertAdjacentHTML('beforeend', `
                <a href="login.html" class="btn btn-outline nav-auth-btn">Kirish</a>
                <a href="register.html" class="btn btn-primary nav-auth-btn">Ro'yxatdan o'tish</a>
            `);
        }
    }
};

// User menu toggle
function toggleUserMenu() {
    const dd = document.getElementById('navUserDropdown');
    const trigger = document.getElementById('navUserTrigger');
    if (!dd) return;
    const isOpen = dd.classList.toggle('open');
    if (trigger) trigger.classList.toggle('active', isOpen);
}

// Outside click
document.addEventListener('click', (e) => {
    const menu = document.getElementById('navUserMenu');
    if (menu && !menu.contains(e.target)) {
        document.getElementById('navUserDropdown')?.classList.remove('open');
        document.getElementById('navUserTrigger')?.classList.remove('active');
    }
});

// DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    AUTH.updateNavbar();
});
