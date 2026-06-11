// layout.js — ЗОЛОТАЯ/ЖЁЛТАЯ ГАММА

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
        var r = await fetch('/api/check-auth.php');
        var d = await r.json();
        currentUser = d.authenticated && d.user ? d.user : null;
        return currentUser;
    } catch(e) {
        currentUser = null;
        return null;
    }
}

async function getUserBalance() {
    if (!currentUser) return 0;
    try {
        var r = await fetch('/api/get-balance.php');
        var d = await r.json();
        return d.success ? d.balance : 0;
    } catch(e) { return 0; }
}

function showToast(msg, err) {
    err = err || false;
    var t = document.createElement('div');
    t.style.cssText = 'position:fixed;top:90px;right:20px;background:#1a1a1a;border-left:4px solid '+(err?'#e34d4d':'#f5c518')+';border-radius:12px;padding:0.8rem 1.2rem;display:flex;align-items:center;gap:0.8rem;z-index:10000;color:#e8e6e3;font-family:Rajdhani,sans-serif;';
    t.innerHTML = '<i class="fas '+(err?'fa-exclamation-circle':'fa-check-circle')+'" style="color:'+(err?'#e34d4d':'#f5c518')+';"></i><div>'+msg+'</div>';
    document.body.appendChild(t);
    setTimeout(function(){t.remove();},3000);
}

window.showTopupModal = function() {
    if (!currentUser) { showToast('Авторизуйтесь через Steam', true); return; }
    var m = document.createElement('div');
    m.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:10001;';
    m.innerHTML = '<div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:24px;width:90%;max-width:400px;padding:1.5rem;"><div style="display:flex;justify-content:space-between;margin-bottom:1rem;"><h3 style="color:#f5c518;"><i class="fas fa-wallet"></i> Пополнение</h3><button id="closeTopup" style="background:none;border:none;color:#8a8a8a;font-size:1.2rem;cursor:pointer;">✕</button></div><p style="font-size:0.8rem;color:#8a8a8a;">💳 Тинькофф: 2200 7017 1047 8105</p><input type="number" id="customAmount" placeholder="Сумма" min="100" style="width:100%;background:#0f0f0f;border:1px solid #2a2a2a;border-radius:10px;padding:0.7rem;color:#e8e6e3;margin:1rem 0;"><button id="paidBtn" style="width:100%;background:#00c853;border:none;border-radius:30px;padding:0.7rem;color:#fff;font-weight:700;cursor:pointer;">Я перевёл</button></div>';
    document.body.appendChild(m);
    document.getElementById('closeTopup').onclick = function(){m.remove();};
    document.getElementById('paidBtn').onclick = function(){
        var amt = parseInt(document.getElementById('customAmount').value)||0;
        if(amt<100){showToast('Минимум 100 ₽',true);return;}
        showToast('✅ Заявка на '+amt+' ₽ отправлена!');
        m.remove();
    };
};

async function renderHeader() {
    if (document.querySelector('header.site')) return;

    var here = location.pathname.split("/").pop() || "index.html";

    var navHtml = '';
    for (var i = 0; i < NAV.length; i++) {
        var n = NAV[i];
        var act = here === n.href;
        navHtml += '<a href="'+n.href+'" style="padding:0.65rem 1rem;border-radius:8px;font-weight:600;font-size:0.85rem;text-transform:uppercase;letter-spacing:0.1em;color:'+(act?'#f5c518':'#e8e6e3')+';text-decoration:none;'+(act?'background:rgba(245,197,24,0.15);':'')+'">'+n.label+'</a>';
    }

    var authHtml = '';
    if (currentUser) {
        var bal = await getUserBalance();
        authHtml = '<div style="display:flex;align-items:center;gap:15px;"><div onclick="showTopupModal()" style="background:#1a1a1a;border:1px solid #2a2a2a;padding:6px 14px;border-radius:30px;cursor:pointer;display:flex;align-items:center;gap:8px;"><i class="fas fa-wallet" style="color:#f5c518;"></i><span>'+bal+' ₽</span></div><div style="background:#1a1a1a;border:1px solid #2a2a2a;padding:4px 12px 4px 6px;border-radius:30px;display:flex;align-items:center;gap:8px;"><img src="'+currentUser.avatar+'" width="28" height="28" style="border-radius:50%;"><span>'+escapeHtml(currentUser.nickname)+'</span><a href="/api/logout.php" style="color:#f5c518;text-decoration:none;"><i class="fas fa-sign-out-alt"></i></a></div></div>';
    } else {
        authHtml = '<a href="/api/steam-auth.php" style="background:linear-gradient(135deg,#d4a90e,#f5c518);color:#1a1a1a;padding:8px 20px;border-radius:30px;font-weight:700;text-decoration:none;display:flex;align-items:center;gap:8px;"><i class="fab fa-steam"></i> Войти через Steam</a>';
    }

    var h = '';
    h += '<header class="site" style="position:sticky;top:0;z-index:1000;backdrop-filter:blur(12px);background:rgba(15,15,15,0.85);border-bottom:1px solid #2a2a2a;">';
    h += '<div style="max-width:1400px;margin:0 auto;padding:0 30px;display:flex;align-items:center;height:90px;position:relative;">';

    // ЛОГОТИП
    h += '<a href="index.html" style="display:flex;align-items:center;text-decoration:none;flex-shrink:0;position:absolute;left:30px;top:50%;transform:translateY(-50%);">';
    h += '<img src="images/logo.png" alt="CS2RAGE" style="height:85px;width:auto;min-width:250px;object-fit:contain;object-position:left;" onerror="this.outerHTML=\'<span style=color:#f5c518;font-size:55px;font-weight:700;>▲ CS2RAGE</span>\'">';
    h += '</a>';

    // НАВИГАЦИЯ
    h += '<nav style="display:flex;gap:5px;margin:0 auto;">'+navHtml+'</nav>';

    // АВТОРИЗАЦИЯ
    h += '<div style="flex-shrink:0;">'+authHtml+'</div>';

    h += '</div></header>';

    h += '<div onclick="location.href=\'/admin.html\'" style="position:fixed;bottom:10px;left:10px;width:30px;height:30px;opacity:0.2;cursor:pointer;z-index:9999;background:rgba(245,197,24,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;"><i class="fas fa-shield-alt" style="font-size:12px;color:#f5c518;"></i></div>';

    document.body.insertAdjacentHTML('afterbegin', h);
}

function escapeHtml(s) {
    if(!s)return'';
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

document.addEventListener('DOMContentLoaded', async function(){
    await checkAuth();
    await renderHeader();
});