// ===== IJARA HUB — MAIN JS =====

// ===== GLOBAL TOAST =====
function showToast(msg, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.id = 'toastContainer';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3000);
}

// ===== 🌙 DARK MODE =====
function toggleDark() {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('ijara-dark', isDark ? '1' : '0');
  const btn = document.getElementById('darkToggle');
  if (btn) btn.textContent = isDark ? '☀️' : '🌙';
}

// Auto-apply saved dark mode
(function () {
  const saved = localStorage.getItem('ijara-dark');
  if (saved === '1') {
    document.body.classList.add('dark');
    document.addEventListener('DOMContentLoaded', () => {
      const btn = document.getElementById('darkToggle');
      if (btn) btn.textContent = '☀️';
    });
  }
})();

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
});

// Mobile menu toggle
function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  if (navLinks) navLinks.classList.toggle('open');
  if (hamburger) hamburger.classList.toggle('active');
}

// Search
function doSearch() {
  const q = document.getElementById('searchInput')?.value || '';
  const cat = document.getElementById('searchCategory')?.value || '';
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (cat) params.set('cat', cat);
  window.location.href = 'listings.html?' + params.toString();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('searchInput') === document.activeElement) {
    doSearch();
  }
});

// ===== RENDER LISTINGS ON HOME PAGE =====
function renderHomeListings() {
  const grid = document.getElementById('listingsGrid');
  if (!grid) return;

  const shown = LISTINGS.slice(0, 8);
  grid.innerHTML = shown.map(item => createCard(item)).join('');
}

function createCard(item) {
  const stars = '★'.repeat(Math.floor(item.rating)) + (item.rating % 1 >= 0.5 ? '★' : '');
  return `
    <div class="listing-card" onclick="openDetailModal(${item.id})">
      <div class="card-image-wrap">
        <img src="${item.image}" alt="${item.title}" class="card-img" loading="lazy" onerror="this.src='https://via.placeholder.com/400x250?text=Rasm+yuklanmadi'"/>
        ${item.premium ? '<span class="badge-premium">⭐ Premium</span>' : ''}
        ${item.verified ? '<span class="badge-verified">✔ Tasdiqlangan</span>' : ''}
        <div class="card-overlay">
          <button class="btn-detail" onclick="event.stopPropagation(); openDetailModal(${item.id})">Batafsil</button>
        </div>
      </div>
      <div class="card-body">
        <div class="card-category">${item.categoryLabel}</div>
        <h3 class="card-title">${item.title}</h3>
        <div class="card-location">📍 ${item.location}</div>
        <div class="card-footer">
          <div class="card-price">
            <strong>${formatPrice(item.price)}</strong>
            <span>/${item.priceType}</span>
          </div>
          <div class="card-rating">
            <span class="stars">${item.rating}</span>
            <span class="star-icon">★</span>
            <span class="review-count">(${item.reviews})</span>
          </div>
        </div>
        <div class="card-owner" style="display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:6px;">
            <img src="${item.ownerImg}" alt="${item.owner}" class="owner-avatar" onerror="this.src='https://i.pravatar.cc/60?img=1'"/>
            <span>${item.owner}</span>
          </div>
          <button class="compare-add-btn" data-id="${item.id}"
            onclick="event.stopPropagation(); if(typeof addToCompare==='function') addToCompare(${item.id})">⚖️ Solishtir</button>
        </div>
      </div>
    </div>
  `;
}

// ===== MODAL — BATAFSIL =====
function openDetailModal(id) {
  const item = LISTINGS.find(l => l.id === id);
  if (!item) return;

  const modal = document.getElementById('detailModal');
  const content = document.getElementById('modalContent');
  if (!modal || !content) return;

  const featuresHTML = item.features.map(f => `<span class="feature-tag">${f}</span>`).join('');

  content.innerHTML = `
    <div class="modal-img-wrap">
      <img src="${item.image}" alt="${item.title}" class="modal-img" onerror="this.src='https://via.placeholder.com/800x400?text=Rasm'"/>
      <div class="modal-badges">
        ${item.premium ? '<span class="badge-premium">⭐ Premium</span>' : ''}
        ${item.verified ? '<span class="badge-verified">✔ Tasdiqlangan</span>' : ''}
      </div>
    </div>
    <div class="modal-info">
      <div class="modal-category">${item.categoryLabel}</div>
      <h2 class="modal-title">${item.title}</h2>
      <div class="modal-meta">
        <span class="modal-location">📍 ${item.location}</span>
        <span class="modal-rating">★ ${item.rating} <em>(${item.reviews} sharh)</em></span>
      </div>
      <p class="modal-desc">${item.description}</p>
      <div class="modal-features">
        <h4>Qo'shimcha imkoniyatlar:</h4>
        <div class="features-list">${featuresHTML}</div>
      </div>
      <div class="modal-price-box">
        <div class="modal-price-row">
          <div>
            <div class="modal-price-label">Narxi</div>
            <div class="modal-price-val">${formatPrice(item.price)} <span>/${item.priceType}</span></div>
          </div>
          <div>
            <div class="modal-price-label">Depozit</div>
            <div class="modal-price-val deposit">${formatPrice(item.deposit)}</div>
          </div>
          <div>
            <div class="modal-price-label">Min. muddat</div>
            <div class="modal-price-val">${item.minDays} kun</div>
          </div>
        </div>
      </div>
      <div class="modal-owner-card">
        <img src="${item.ownerImg}" alt="${item.owner}" class="owner-avatar-lg" onerror="this.src='https://i.pravatar.cc/60?img=1'"/>
        <div class="owner-info">
          <div class="owner-name">${item.owner}</div>
          <div class="owner-label">${item.verified ? '✔ Tasdiqlangan ega' : 'Foydalanuvchi'}</div>
        </div>
        <div class="owner-actions">
          <a href="tel:+998901234567" class="btn btn-primary">📞 Qo'ng'iroq</a>
          <a href="chat.html?id=${item.id}" class="btn btn-outline">💬 Chat</a>
        </div>
      </div>
      <div class="modal-cta-row">
        <a href="booking.html?id=${item.id}" class="btn btn-primary btn-lg full-width">📅 Band qilish (Bron)</a>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDetailModal() {
  const modal = document.getElementById('detailModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

function closeModal(event) {
  if (event.target === document.getElementById('detailModal')) {
    closeDetailModal();
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeDetailModal();
});

// ===== PWA — SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('[IjaraGo] SW registered:', reg.scope))
      .catch(err => console.log('[IjaraGo] SW error:', err));
  });
}

// ===== RECOMMENDATIONS — Track viewed categories =====
function trackViewedCategory(cat) {
  if (!cat) return;
  let viewed = JSON.parse(localStorage.getItem('ij_viewed_cats') || '[]');
  viewed = viewed.filter(c => c !== cat);
  viewed.push(cat);
  if (viewed.length > 10) viewed = viewed.slice(-10);
  localStorage.setItem('ij_viewed_cats', JSON.stringify(viewed));
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  renderHomeListings();
  animateCounters();
  // Track current page category if on listing detail
  const params = new URLSearchParams(location.search);
  const listingId = parseInt(params.get('id'));
  if (listingId && typeof LISTINGS !== 'undefined') {
    const item = LISTINGS.find(l => l.id === listingId);
    if (item) trackViewedCategory(item.category);
  }
});

// Animate hero stats
function animateCounters() {
  const counters = document.querySelectorAll('.stat-item strong');
  counters.forEach(counter => {
    const text = counter.textContent;
    const num = parseInt(text.replace(/[^0-9]/g, ''));
    const suffix = text.replace(/[0-9,]/g, '');
    let current = 0;
    const step = num / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= num) {
        current = num;
        clearInterval(timer);
      }
      counter.textContent = Math.floor(current).toLocaleString() + suffix;
    }, 20);
  });
}
