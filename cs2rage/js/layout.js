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

function renderHeader() {
    const here = location.pathname.split("/").pop() || "index.html";
    const online = (typeof TOTAL_ONLINE !== "undefined") ? TOTAL_ONLINE : 0;
    const navHtml = NAV.map(n =>
        `<a href="${n.href}" class="${here === n.href ? "active" : ""}">${n.label}</a>`
    ).join("");
    
    document.body.insertAdjacentHTML("afterbegin", `
        <header class="site">
            <div class="container inner">
                <a href="index.html" class="logo">
                    <span class="text-primary text-glow">▲</span>
                    <span>CS2</span><span class="text-primary text-glow">RAGE</span>
                </a>
                <nav class="main">${navHtml}</nav>
                <div style="display:flex;align-items:center;gap:.75rem">
                    <div class="online-pill"><span class="dot"></span><b>${online}</b> онлайн</div>
                    <a href="/steam-auth.php?return=" + encodeURIComponent(window.location.pathname) + window.location.search + window.location.hash + "" class="btn-steam" style="text-decoration:none; display:inline-flex; align-items:center; gap:8px;">
                        <i class="fab fa-steam"></i> Войти через Steam
                    </a>
                </div>
            </div>
        </header>
    `);
}

function renderFooter() {
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

document.addEventListener("DOMContentLoaded", () => {
    renderHeader();
    renderFooter();
});