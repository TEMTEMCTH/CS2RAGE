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

// Глобальная переменная для хранения данных пользователя
let currentUser = null;

// Функция проверки авторизации через API
async function checkAuth() {
    try {
        const response = await fetch('/api/check-auth.php');
        const data = await response.json();
        if (data.authenticated) {
            currentUser = data.user;
        } else {
            currentUser = null;
        }
    } catch (error) {
        console.error('Ошибка проверки авторизации:', error);
        currentUser = null;
    }
}

// Функция рендера хедера (будет вызвана после проверки авторизации)
function renderHeader() {
    const here = location.pathname.split("/").pop() || "index.html";
    const online = (typeof TOTAL_ONLINE !== "undefined") ? TOTAL_ONLINE : 0;
    const navHtml = NAV.map(n =>
        `<a href="${n.href}" class="${here === n.href ? "active" : ""}">${n.label}</a>`
    ).join("");
    
    // Если хедер уже существует — не добавляем второй раз
    if (document.querySelector('header.site')) return;
    
    let authHtml = '';
    if (currentUser) {
        authHtml = `
            <div style="display:flex;align-items:center;gap:.75rem">
                <div class="online-pill"><span class="dot"></span><b>${online}</b> онлайн</div>
                <div style="display:flex;align-items:center;gap:10px;background:var(--card);padding:5px 16px 5px 8px;border-radius:999px;border:1px solid var(--border)">
                    <img src="${currentUser.avatar}" width="32" height="32" style="border-radius:50%">
                    <span style="font-weight:600">${escapeHtml(currentUser.nickname)}</span>
                    <a href="/api/logout.php" style="color:var(--primary);margin-left:5px;text-decoration:none">
                        <i class="fas fa-sign-out-alt"></i>
                    </a>
                </div>
            </div>
        `;
    } else {
        authHtml = `
            <div style="display:flex;align-items:center;gap:.75rem">
                <div class="online-pill"><span class="dot"></span><b>${online}</b> онлайн</div>
                <a href="/api/steam-auth.php?return=${encodeURIComponent(window.location.pathname)}" class="btn-steam" style="text-decoration:none; display:inline-flex; align-items:center; gap:8px;">
                    <i class="fab fa-steam"></i> Войти через Steam
                </a>
            </div>
        `;
    }
    
    document.body.insertAdjacentHTML("afterbegin", `
        <header class="site">
            <div class="container inner">
                <a href="index.html" class="logo">
                    <span class="text-primary text-glow">▲</span>
                    <span>CS2</span><span class="text-primary text-glow">RAGE</span>
                </a>
                <nav class="main">${navHtml}</nav>
                ${authHtml}
            </div>
        </header>
    `);
}

function renderFooter() {
    // Если футер уже существует — не добавляем второй раз
    if (document.querySelector('footer.site')) return;
    
    document.body.insertAdjacentHTML("beforeend", `
        <footer class="site">
            <div class="container inner">
                <div style="max-width:24rem">
                    <a href="index.html" class="logo"><span class="text-primary text-glow">▲</span><span>CS2</span><span class="text-primary text-glow">RAGE</span></a>
                    <p style="color:var(--muted);margin-top:.75rem;font-size:.9rem">Игровой проект Counter-Strike 2. Не аффилирован с Valve Corporation.</p>
                </div>
                <div class="cols">
                    <div class="col">
                        <h4>Проект</h4>
                        <a href="index.html">Серверы</a>
                        <a href="shop.html">Привилегии</a>
                        <a href="skinchanger.html">Скины</a>
                        <a href="rules.html">Правила</a>
                    </div>
                    <div class="col">
                        <h4>Сообщество</h4>
                        <a href="#">Discord</a>
                        <a href="#">Telegram</a>
                        <a href="#">VK</a>
                    </div>
                </div>
            </div>
        </footer>
    `);
}

// Функция для защиты от XSS
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Запуск: сначала проверяем авторизацию, потом рендерим хедер
document.addEventListener("DOMContentLoaded", async () => {
    await checkAuth();
    renderHeader();
    renderFooter();
});