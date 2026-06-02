// layout.js - исправленная версия с рабочей кнопкой Steam

const NAV = [
    { href: "index.html",       label: "Сервера" },
    { href: "skinchanger.html", label: "Скинченджер" },
    { href: "shop.html",        label: "Привилегии" },
    { href: "top.html",         label: "Топ" },
    { href: "rules.html",       label: "Правила" }
];

let currentUser = null;

async function checkAuth() {
    try {
        const response = await fetch('/api/check-auth.php');
        const data = await response.json();
        currentUser = data.authenticated && data.user ? data.user : null;
        return currentUser;
    } catch(e) {
        currentUser = null;
        return null;
    }
}

async function getUserBalance() {
    if (!currentUser) return 0;
    try {
        const response = await fetch('/api/get-balance.php');
        const data = await response.json();
        return data.success ? data.balance : 0;
    } catch(e) { return 0; }
}

function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; top: 90px; right: 20px; background: #1a1a1a;
        border-left: 4px solid ${isError ? '#e34d4d' : '#e0883a'};
        border-radius: 12px; padding: 0.8rem 1.2rem;
        display: flex; align-items: center; gap: 0.8rem;
        z-index: 10000; color: #e8e6e3; font-family: 'Rajdhani', sans-serif;
        animation: slideInRight 0.3s ease forwards;
    `;
    toast.innerHTML = `<i class="fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'}" style="color: ${isError ? '#e34d4d' : '#e0883a'};"></i><div>${message}</div>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

window.showTopupModal = function() {
    if (!currentUser) {
        showToast('Сначала авторизуйтесь через Steam', true);
        return;
    }
    
    const modal = document.createElement('div');
    modal.id = 'topupModal';
    modal.style.cssText = `position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:10001;`;
    modal.innerHTML = `
        <div style="background:#1a1a1a; border:1px solid #2a2a2a; border-radius:24px; width:90%; max-width:400px; padding:1.5rem;">
            <div style="display:flex; justify-content:space-between; margin-bottom:1rem;">
                <h3 style="color:#e0883a;"><i class="fas fa-wallet"></i> Пополнение баланса</h3>
                <button id="closeTopup" style="background:none; border:none; color:#8a8a8a; font-size:1.2rem; cursor:pointer;">✕</button>
            </div>
            <div style="margin-bottom:1rem;">
                <p style="font-size:0.8rem; color:#8a8a8a; margin-bottom:0.5rem;">💳 Реквизиты для перевода:</p>
                <div style="background:#0f0f0f; border-radius:12px; padding:0.8rem;">
                    <p><strong>Банк:</strong> <span style="color:#e0883a;">Тинькофф</span></p>
                    <p><strong>Номер карты:</strong> <span style="color:#e0883a; font-family:monospace;">2200 7017 1047 8105</span></p>
                    <p><strong>Получатель:</strong> Тимофей Д.</p>
                </div>
            </div>
            <div style="margin-bottom:1rem;">
                <label style="display:block; font-size:0.7rem; color:#8a8a8a; margin-bottom:0.5rem;">СУММА ПЕРЕВОДА (₽)</label>
                <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:0.5rem; margin-bottom:0.5rem;">
                    <button class="amount" data-a="100">100 ₽</button>
                    <button class="amount" data-a="300">300 ₽</button>
                    <button class="amount" data-a="500">500 ₽</button>
                    <button class="amount" data-a="1000">1000 ₽</button>
                    <button class="amount" data-a="2000">2000 ₽</button>
                    <button class="amount" data-a="5000">5000 ₽</button>
                </div>
                <input type="number" id="customAmount" placeholder="Своя сумма" min="100" step="100" style="width:100%; background:#0f0f0f; border:1px solid #2a2a2a; border-radius:10px; padding:0.7rem; color:#e8e6e3;">
            </div>
            <button id="paidBtn" style="width:100%; background:linear-gradient(135deg,#00c853,#00a844); border:none; border-radius:30px; padding:0.7rem; color:#fff; font-weight:700; cursor:pointer; margin-bottom:0.5rem;">
                <i class="fas fa-check-circle"></i> Я перевёл(а)
            </button>
            <p style="font-size:0.65rem; color:#8a8a8a; text-align:center;">После перевода нажмите кнопку выше. Баланс будет пополнен вручную.</p>
        </div>
    `;
    document.body.appendChild(modal);
    
    let amount = 100;
    document.querySelectorAll('.amount').forEach(btn => {
        btn.style.cssText = 'background:#0f0f0f; border:1px solid #2a2a2a; border-radius:10px; padding:0.5rem; cursor:pointer; color:#e8e6e3;';
        btn.onclick = () => {
            document.querySelectorAll('.amount').forEach(b => b.style.background = '#0f0f0f');
            btn.style.background = 'linear-gradient(135deg,#c0702a,#f0a050)';
            amount = parseInt(btn.dataset.a);
            document.getElementById('customAmount').value = '';
        };
    });
    document.querySelector('.amount').style.background = 'linear-gradient(135deg,#c0702a,#f0a050)';
    
    document.getElementById('customAmount').oninput = (e) => {
        document.querySelectorAll('.amount').forEach(b => b.style.background = '#0f0f0f');
        amount = parseInt(e.target.value) || 0;
    };
    
    document.getElementById('closeTopup').onclick = () => modal.remove();
    document.getElementById('paidBtn').onclick = async () => {
        if (amount < 100) {
            showToast('Минимальная сумма 100 ₽', true);
            return;
        }
        document.getElementById('paidBtn').disabled = true;
        document.getElementById('paidBtn').innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Отправка...';
        showToast(`✅ Заявка на пополнение ${amount} ₽ отправлена! Администратор пополнит баланс.`);
        modal.remove();
    };
};

async function renderHeader() {
    if (document.querySelector('header.site')) return;
    
    const here = location.pathname.split("/").pop() || "index.html";
    const online = typeof TOTAL_ONLINE !== 'undefined' ? TOTAL_ONLINE : 0;
    const navHtml = NAV.map(n => {
        const isActive = here === n.href;
        return `<a href="${n.href}" style="padding:0.65rem 1rem; border-radius:8px; font-weight:600; font-size:0.85rem; text-transform:uppercase; letter-spacing:0.1em; color:#e8e6e3; text-decoration:none; transition:0.2s; ${isActive ? 'background:rgba(224,136,58,0.15); color:#e0883a;' : ''}">${n.label}</a>`;
    }).join("");
    
    let authHtml = '';
    if (currentUser) {
        const balance = await getUserBalance();
        authHtml = `
            <div style="display:flex; align-items:center; gap:15px;">
                <div onclick="showTopupModal()" style="background:#1a1a1a; border:1px solid #2a2a2a; padding:6px 14px; border-radius:30px; cursor:pointer; display:flex; align-items:center; gap:8px;">
                    <i class="fas fa-wallet" style="color:#e0883a;"></i>
                    <span id="user-balance">${balance} ₽</span>
                </div>
                <div style="background:#1a1a1a; border:1px solid #2a2a2a; padding:4px 12px 4px 6px; border-radius:30px; display:flex; align-items:center; gap:8px;">
                    <img src="${currentUser.avatar}" width="28" height="28" style="border-radius:50%;">
                    <span>${escapeHtml(currentUser.nickname)}</span>
                    <a href="/api/logout.php" style="color:#e0883a; text-decoration:none;"><i class="fas fa-sign-out-alt"></i></a>
                </div>
            </div>
        `;
    } else {
        authHtml = `
            <div style="display:flex; align-items:center; gap:15px;">
                <a href="/api/steam-auth.php?return=${encodeURIComponent(window.location.pathname)}" class="steam-login-btn" style="background:linear-gradient(135deg,#c0702a,#f0a050); color:#1a1a1a; padding:8px 20px; border-radius:30px; font-weight:700; text-decoration:none; display:flex; align-items:center; gap:8px; cursor:pointer;">
                    <i class="fab fa-steam"></i> Войти через Steam
                </a>
            </div>
        `;
    }
    
    // Кнопка админки
    const adminButton = `
        <div onclick="window.location.href='/admin.html'" style="position:fixed; bottom:10px; left:10px; width:30px; height:30px; opacity:0.2; cursor:pointer; z-index:9999; background:rgba(224,136,58,0.2); border-radius:50%; display:flex; align-items:center; justify-content:center; transition:0.2s;">
            <i class="fas fa-shield-alt" style="font-size:12px; color:#e0883a;"></i>
        </div>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', `
        <header class="site" style="position:sticky; top:0; z-index:1000; backdrop-filter:blur(12px); background:rgba(15,15,15,0.85); border-bottom:1px solid #2a2a2a;">
            <div style="max-width:1400px; margin:0 auto; padding:0 30px; display:flex; justify-content:space-between; align-items:center; height:70px;">
                <a href="index.html" class="logo" style="font-family:'Oswald',sans-serif; font-size:1.5rem; letter-spacing:0.2em; font-weight:700; display:flex; align-items:center; gap:5px; text-decoration:none; color:#e8e6e3;">
                    <span style="color:#e0883a;">▲</span>
                    <span>CS2</span><span style="color:#e0883a;">RAGE</span>
                </a>
                <nav style="display:flex; gap:5px;">${navHtml}</nav>
                ${authHtml}
            </div>
        </header>
        ${adminButton}
    `);
    
    // Добавляем обработчик клика на кнопку Steam (на случай, если ссылка не сработает)
    const steamBtn = document.querySelector('.steam-login-btn');
    if (steamBtn) {
        steamBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const returnUrl = encodeURIComponent(window.location.pathname);
            window.location.href = `/api/steam-auth.php?return=${returnUrl}`;
        });
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : (m === '<' ? '&lt;' : '&gt;'));
}

document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    await renderHeader();
});