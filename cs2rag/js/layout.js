window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) preloader.classList.add('hide');
});

const NAV = [
    { href: "index.html",       label: "Сервера" },
    { href: "skinchanger.html", label: "Скинченджер" },
    { href: "shop.html",        label: "Привилегии" },
    { href: "top.html",         label: "Топ" },
    { href: "rules.html",       label: "Правила" },
    { href: "faq.html",         label: "FAQ" },
];

let currentUser = null;

async function checkAuth() {
    try {
        const response = await fetch('/api/check-auth.php');
        const data = await response.json();
        if (data.authenticated && data.user) {
            currentUser = data.user;
            return true;
        } else {
            currentUser = null;
            return false;
        }
    } catch (error) {
        currentUser = null;
        return false;
    }
}

async function getUserBalance() {
    if (!currentUser) return 0;
    try {
        const response = await fetch('/api/get-balance.php');
        const data = await response.json();
        if (data.success) return data.balance;
        return 0;
    } catch(e) {
        return 0;
    }
}

async function updateBalanceDisplay() {
    const balance = await getUserBalance();
    const balanceElement = document.getElementById('user-balance');
    if (balanceElement) balanceElement.textContent = balance.toLocaleString('ru-RU') + ' ₽';
}

function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    // Убираем backdrop-filter и делаем сплошной тёмный фон
    toast.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: #1a1a1a;
        border-left: 4px solid ${type === 'success' ? '#e0883a' : '#e34d4d'};
        border-radius: 12px;
        padding: 0.8rem 1.2rem;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);
        z-index: 10000;
        animation: slideInRight 0.3s ease forwards;
        font-family: 'Rajdhani', sans-serif;
    `;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}" style="color: ${type === 'success' ? '#e0883a' : '#e34d4d'};"></i>
        <div style="color: #e8e6e3;">${message}</div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

window.showTopupModal = function() {
    if (!currentUser) {
        showToast('Сначала авторизуйтесь через Steam', 'error');
        return;
    }
    
    const existing = document.getElementById('topupModal');
    if (existing) existing.remove();
    
    const modalHtml = `
        <div id="topupModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:10001;">
            <div style="background:#1a1a1a; border:1px solid #2a2a2a; border-radius:24px; width:90%; max-width:450px; padding:1.5rem; box-shadow:0 20px 40px rgba(0,0,0,0.5);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; border-bottom:1px solid #2a2a2a; padding-bottom:0.8rem;">
                    <h3 style="color:#e0883a; font-family:'Oswald',sans-serif; margin:0; font-size:1.2rem;"><i class="fas fa-wallet"></i> Пополнение баланса</h3>
                    <button id="closeModalBtn" style="background:none; border:none; color:#8a8a8a; font-size:1.3rem; cursor:pointer;">&times;</button>
                </div>
                <div>
                    <label style="display:block; font-size:0.7rem; color:#8a8a8a; margin-bottom:0.5rem;">СУММА (₽)</label>
                    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:0.5rem; margin-bottom:1rem;">
                        <button class="amount-btn" data-amount="100" style="background:#0f0f0f; border:1px solid #2a2a2a; border-radius:10px; padding:0.5rem; cursor:pointer; color:#e8e6e3;">100 ₽</button>
                        <button class="amount-btn" data-amount="300" style="background:#0f0f0f; border:1px solid #2a2a2a; border-radius:10px; padding:0.5rem; cursor:pointer; color:#e8e6e3;">300 ₽</button>
                        <button class="amount-btn" data-amount="500" style="background:#0f0f0f; border:1px solid #2a2a2a; border-radius:10px; padding:0.5rem; cursor:pointer; color:#e8e6e3;">500 ₽</button>
                        <button class="amount-btn" data-amount="1000" style="background:#0f0f0f; border:1px solid #2a2a2a; border-radius:10px; padding:0.5rem; cursor:pointer; color:#e8e6e3;">1000 ₽</button>
                        <button class="amount-btn" data-amount="2000" style="background:#0f0f0f; border:1px solid #2a2a2a; border-radius:10px; padding:0.5rem; cursor:pointer; color:#e8e6e3;">2000 ₽</button>
                        <button class="amount-btn" data-amount="5000" style="background:#0f0f0f; border:1px solid #2a2a2a; border-radius:10px; padding:0.5rem; cursor:pointer; color:#e8e6e3;">5000 ₽</button>
                    </div>
                    <input type="number" id="customAmount" placeholder="Своя сумма" min="100" step="1" style="width:100%; background:#0f0f0f; border:1px solid #2a2a2a; border-radius:10px; padding:0.7rem; color:#e8e6e3; margin-bottom:1.5rem; outline:none;">
                </div>
                <div style="display:flex; gap:0.5rem; margin-bottom:1.5rem;">
                    <button id="paySbpBtn" style="flex:1; background:linear-gradient(135deg,#c0702a,#f0a050); border:none; border-radius:40px; padding:0.7rem; color:#1a1a1a; font-weight:700; cursor:pointer;"><i class="fas fa-qrcode"></i> СБП</button>
                    <button id="payCardBtn" style="flex:1; background:#0f0f0f; border:1px solid #2a2a2a; border-radius:40px; padding:0.7rem; color:#e8e6e3; cursor:pointer;"><i class="fas fa-credit-card"></i> Карта</button>
                </div>
                <button id="submitPaymentBtn" style="width:100%; background:linear-gradient(135deg,#c0702a,#f0a050); border:none; border-radius:40px; padding:0.8rem; color:#1a1a1a; font-weight:700; cursor:pointer;"><i class="fas fa-arrow-right"></i> Оплатить</button>
                <div style="text-align:center; font-size:0.65rem; color:#8a8a8a; margin-top:1rem;">Комиссия 0% • Мгновенное зачисление</div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Убираем стрелочки
    const style = document.createElement('style');
    style.textContent = `input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; } input[type=number] { -moz-appearance: textfield; }`;
    document.head.appendChild(style);
    
    let selectedAmount = 100;
    let selectedMethod = 'sbp';
    
    document.querySelectorAll('.amount-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.amount-btn').forEach(b => {
                b.style.background = '#0f0f0f';
                b.style.borderColor = '#2a2a2a';
            });
            btn.style.background = 'linear-gradient(135deg,#c0702a,#f0a050)';
            btn.style.borderColor = '#e0883a';
            selectedAmount = parseInt(btn.dataset.amount);
            document.getElementById('customAmount').value = '';
        });
    });
    document.querySelector('.amount-btn').style.background = 'linear-gradient(135deg,#c0702a,#f0a050)';
    
    document.getElementById('customAmount').addEventListener('input', (e) => {
        document.querySelectorAll('.amount-btn').forEach(b => {
            b.style.background = '#0f0f0f';
            b.style.borderColor = '#2a2a2a';
        });
        selectedAmount = parseInt(e.target.value) || 0;
    });
    
    document.getElementById('paySbpBtn').addEventListener('click', () => {
        selectedMethod = 'sbp';
        document.getElementById('paySbpBtn').style.background = 'linear-gradient(135deg,#c0702a,#f0a050)';
        document.getElementById('payCardBtn').style.background = '#0f0f0f';
        document.getElementById('payCardBtn').style.border = '1px solid #2a2a2a';
        document.getElementById('payCardBtn').style.color = '#e8e6e3';
    });
    
    document.getElementById('payCardBtn').addEventListener('click', () => {
        selectedMethod = 'card';
        document.getElementById('payCardBtn').style.background = 'linear-gradient(135deg,#c0702a,#f0a050)';
        document.getElementById('payCardBtn').style.border = 'none';
        document.getElementById('payCardBtn').style.color = '#1a1a1a';
        document.getElementById('paySbpBtn').style.background = '#0f0f0f';
    });
    
    document.getElementById('closeModalBtn').addEventListener('click', () => document.getElementById('topupModal').remove());
    document.getElementById('submitPaymentBtn').addEventListener('click', async () => {
        if (selectedAmount < 100) {
            showToast('Минимальная сумма 100 ₽', 'error');
            return;
        }
        const btn = document.getElementById('submitPaymentBtn');
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Создание...';
        try {
            const response = await fetch(`/api/create-payment.php?amount=${selectedAmount}&method=${selectedMethod}`);
            const data = await response.json();
            if (data.success) {
                if (data.demo) {
                    showToast('Демо-режим: подключите ЮKassa или Tinkoff', 'error');
                    document.getElementById('topupModal').remove();
                } else if (data.payment_url) {
                    window.open(data.payment_url, '_blank');
                    showToast(`Платёж на сумму ${selectedAmount} ₽ создан`, 'success');
                    document.getElementById('topupModal').remove();
                }
            } else {
                showToast('Ошибка: ' + (data.error || 'Не удалось создать платёж'), 'error');
            }
        } catch(err) {
            showToast('Ошибка соединения с сервером', 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-arrow-right"></i> Оплатить';
        }
    });
};

function renderHeader() {
    const here = location.pathname.split("/").pop() || "index.html";
    const online = (typeof TOTAL_ONLINE !== "undefined") ? TOTAL_ONLINE : 0;
    const navHtml = NAV.map(n => `<a href="${n.href}" class="${here === n.href ? "active" : ""}" style="padding:0.65rem 1rem; border-radius:8px; font-weight:600; font-size:0.85rem; text-transform:uppercase; letter-spacing:0.1em; color:#e8e6e3; transition:0.2s; text-decoration:none;">${n.label}</a>`).join("");
    
    if (document.querySelector('header.site')) return;
    
    let authHtml = '';
    if (currentUser && currentUser.nickname) {
        authHtml = `
            <div style="display:flex; align-items:center; gap:12px;">
                <div class="online-pill" style="display:flex; align-items:center; gap:0.5rem; background:#1a1a1a; border:1px solid #2a2a2a; padding:0.3rem 1rem; border-radius:999px;">
                    <span class="dot" style="width:8px; height:8px; border-radius:50%; background:#e0883a;"></span>
                    <b style="color:#e8e6e3;">${online}</b>
                </div>
                <div onclick="showTopupModal()" style="display:flex; align-items:center; gap:8px; background:#1a1a1a; padding:5px 12px; border-radius:30px; border:1px solid #2a2a2a; cursor:pointer;">
                    <i class="fas fa-wallet" style="color:#e0883a;"></i>
                    <span id="user-balance" style="font-weight:600; color:#e8e6e3;">0 ₽</span>
                </div>
                <div style="display:flex; align-items:center; gap:8px; background:#1a1a1a; padding:5px 12px 5px 5px; border-radius:30px; border:1px solid #2a2a2a;">
                    <img src="${currentUser.avatar}" width="28" height="28" style="border-radius:50%;">
                    <span style="color:#e8e6e3;">${escapeHtml(currentUser.nickname)}</span>
                    <a href="/api/logout.php" style="color:#e0883a; text-decoration:none;"><i class="fas fa-sign-out-alt"></i></a>
                </div>
            </div>
        `;
    } else {
        authHtml = `
            <div style="display:flex; align-items:center; gap:12px;">
                <div class="online-pill" style="display:flex; align-items:center; gap:0.5rem; background:#1a1a1a; border:1px solid #2a2a2a; padding:0.3rem 1rem; border-radius:999px;">
                    <span class="dot" style="width:8px; height:8px; border-radius:50%; background:#e0883a;"></span>
                    <b style="color:#e8e6e3;">${online}</b>
                </div>
                <a href="/api/steam-auth.php?return=${encodeURIComponent(window.location.pathname)}" style="background:linear-gradient(135deg,#c0702a,#f0a050); color:#1a1a1a; padding:8px 16px; border-radius:30px; font-weight:700; font-size:13px; text-decoration:none; display:flex; align-items:center; gap:8px;">
                    <i class="fab fa-steam"></i> Войти
                </a>
            </div>
        `;
    }
    
    document.body.insertAdjacentHTML("afterbegin", `
        <header class="site" style="position:sticky; top:0; z-index:1000; backdrop-filter:blur(12px); background:rgba(15,15,15,0.85); border-bottom:1px solid #2a2a2a;">
            <div class="container" style="max-width:1340px; margin:0 auto; padding:0 2rem; display:flex; justify-content:space-between; align-items:center; height:72px;">
                <a href="index.html" class="logo" style="font-family:'Oswald',sans-serif; font-size:1.5rem; letter-spacing:0.2em; font-weight:700; display:flex; align-items:center; gap:5px; text-decoration:none; color:#e8e6e3;">
                    <span style="color:#e0883a;">▲</span>
                    <span>CS2</span><span style="color:#e0883a;">RAGE</span>
                </a>
                <nav class="main" style="display:flex; gap:5px;">${navHtml}</nav>
                ${authHtml}
            </div>
        </header>
    `);
}

function renderFooter() {
    if (document.querySelector('footer.site')) return;
    document.body.insertAdjacentHTML("beforeend", `
        <footer class="site" style="padding:3rem 0; border-top:1px solid #2a2a2a; background:rgba(15,15,15,0.6); margin-top:auto;">
            <div class="container" style="max-width:1340px; margin:0 auto; padding:0 2rem; display:flex; justify-content:space-between; flex-wrap:wrap; gap:2rem;">
                <div style="max-width:24rem">
                    <a href="index.html" class="logo" style="font-family:'Oswald',sans-serif; font-size:1.5rem; letter-spacing:0.2em; font-weight:700; display:flex; align-items:center; gap:5px; text-decoration:none; color:#e8e6e3;"><span style="color:#e0883a;">▲</span><span>CS2</span><span style="color:#e0883a;">RAGE</span></a>
                    <p style="color:#8a8a8a; margin-top:0.75rem; font-size:0.9rem">Игровой проект Counter-Strike 2. Не аффилирован с Valve Corporation.</p>
                </div>
                <div style="display:flex; gap:3rem; flex-wrap:wrap;">
                    <div><h4 style="font-size:0.8rem; color:#8a8a8a; margin-bottom:0.75rem;">Проект</h4><a href="index.html" style="display:block; color:#8a8a8a; text-decoration:none; padding:0.25rem 0;">Серверы</a><a href="shop.html" style="display:block; color:#8a8a8a; text-decoration:none; padding:0.25rem 0;">Привилегии</a><a href="skinchanger.html" style="display:block; color:#8a8a8a; text-decoration:none; padding:0.25rem 0;">Скины</a><a href="rules.html" style="display:block; color:#8a8a8a; text-decoration:none; padding:0.25rem 0;">Правила</a></div>
                    <div><h4 style="font-size:0.8rem; color:#8a8a8a; margin-bottom:0.75rem;">Сообщество</h4><a href="#" style="display:block; color:#8a8a8a; text-decoration:none; padding:0.25rem 0;">Discord</a><a href="#" style="display:block; color:#8a8a8a; text-decoration:none; padding:0.25rem 0;">Telegram</a><a href="#" style="display:block; color:#8a8a8a; text-decoration:none; padding:0.25rem 0;">VK</a></div>
                </div>
            </div>
        </footer>
    `);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : (m === '<' ? '&lt;' : '&gt;'));
}

document.addEventListener("DOMContentLoaded", async () => {
    await checkAuth();
    renderHeader();
    renderFooter();
    if (currentUser) await updateBalanceDisplay();
});