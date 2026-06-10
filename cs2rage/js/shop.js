const prices = { basic: 99, lite: 199, premium: 399, king: 699, god: 1299 };

function showToast(msg, err) {
    err = err || false;
    var t = document.createElement('div');
    t.className = 'toast' + (err ? ' error' : '');
    t.innerHTML = '<div>' + msg + '</div>';
    document.body.appendChild(t);
    setTimeout(function() { t.style.opacity = '0'; t.style.transform = 'translateX(100px)'; t.style.transition = 'all 0.3s ease'; setTimeout(function() { t.remove(); }, 300); }, 3000);
}

async function purchase(tier) {
    try {
        var a = await fetch('/api/check-auth.php').then(r => r.json());
        if (!a.authenticated) { if (confirm('Войдите через Steam. Перейти?')) location.href = '/api/steam-auth.php?return=/shop.html'; return; }
        var b = await fetch('/api/get-balance.php').then(r => r.json());
        var bal = b.success ? b.balance : 0;
        if (bal < prices[tier]) { showToast('Недостаточно средств! Нужно ' + prices[tier] + ' ₽, у вас ' + bal + ' ₽', true); return; }
        var r = await fetch('/api/buy-privilege.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tier: tier, price: prices[tier] }) }).then(r => r.json());
        if (r.success) { showToast('✅ Привилегия ' + tier.toUpperCase() + ' активирована!'); setTimeout(function() { location.reload(); }, 1500); }
        else showToast(r.error || 'Ошибка активации', true);
    } catch(e) { showToast('Ошибка соединения', true); }
}

document.querySelectorAll('.btn').forEach(function(btn) { btn.onclick = function() { purchase(btn.dataset.tier); }; });