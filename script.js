
(() => {
    'use strict';

    
    const CONFIG = {
        suggestionsEndpoint: 'https://formsubmit.co/ajax/jgtmollykao@gmail.com',
        suggestionsEmail: 'jgtmollykao@gmail.com'
    };

    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => [...c.querySelectorAll(s)];
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const fmt = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
    const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
    const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
    const raf = (fn) => requestAnimationFrame(fn);

    const PRODUCTS = {
        dracox:   { name: 'DRACOX',   letter: 'D', price: 2,   tone: '',         color: '#ff6b4f', tag: 'Favorito', desc: 'DRACOX es un soporte de móvil impreso en 3D, inspirado en un dragón de la suerte.', variants: [{ label: 'Blanco', src: 'dracox1.png' }, { label: 'Camaleón', src: 'dracox2.png' }] },
        kraxen:   { name: 'KRAXEN',   letter: 'K', price: 2.5, tone: 'c-lime',   color: '#d7ff5e', tag: 'Destacado', desc: 'KRAXEN es un soporte de móvil, impreso en 3D, inspirado en el KRAKEN, una criatura abismal con forma de calamar.', variants: [{ label: 'Blanco', src: 'kraxen1.png' }] },
        bolseus:  { name: 'BOLSEUS',  letter: 'B', price: 2,   tone: 'c-blue',   color: '#5cc8ff', tag: 'El Primero', desc: 'BOLSEUS permite cargar con múltiples bolsas a la vez para facilitar las tareas como comprar en el supermercado.', note: 'No garantizamos la eficacia del producto en otros ámbitos.', variants: [{ label: 'Blanco', src: 'bolseus1.png' }, { label: 'Camaleón', src: 'bolseus2.png' }] },
        hexungus: { name: 'HEXUNGUS', letter: 'H', price: 2,   tone: 'c-violet', color: '#9b6bff', tag: 'Nuevo', desc: 'Hexungus es una figura antiestresante, con un diseño particular que lo permite usar como llavero para llevarlo a todas partes.', variants: [{ label: 'Camaleón', src: 'hexungus.png' }] },
        letrina:  { name: 'LETRIÑA',  letter: 'L', price: 1.5, tone: 'c-cyan',   color: '#19e3d0', tag: 'Nuevo', desc: 'Letriña, cuyo modelo es una letra, cuenta con un diseño único que permite incorporarla a un llavero. Perfecto para regalos.', variants: [] }
    };
    const MAX_QTY = 20;
    let modalKey = null;
    function updateModalCount() {
        if (!modalKey) return;
        const el = $('#pm-inpack');
        if (el) el.textContent = cart[modalKey] ? `En tu pack: ${cart[modalKey]}` : '';
    }

    
    function toast(message) {
        const box = $('#toasts');
        const el = document.createElement('div');
        el.className = 'toast';
        el.textContent = message;
        box.append(el);
        raf(() => el.classList.add('in'));
        setTimeout(() => { el.classList.remove('in'); setTimeout(() => el.remove(), 450); }, 2600);
    }

    
    const preloader = $('#preloader');
    let started = false;
    function start() {
        if (started) return;
        started = true;
        preloader.classList.add('hide');
        document.body.classList.add('ready');
        runCounters($$('.hero [data-count]'));
    }
    window.addEventListener('load', () => setTimeout(start, 700));
    setTimeout(start, 2600);

    
    const header = $('#site-header');
    const progress = $('#progress');
    let lastY = window.scrollY;
    let ticking = false;

    function onScroll() {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? clamp(y / max, 0, 1) : 0})`;
        header.classList.toggle('scrolled', y > 20);
        if (!header.classList.contains('nav-open')) {
            header.classList.toggle('hide', y > lastY && y > 420);
        }
        lastY = y;
        ticking = false;
    }
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; raf(onScroll); } }, { passive: true });
    onScroll();

    const spyLinks = $$('[data-spy]');
    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            spyLinks.forEach((link) => link.classList.toggle('active', link.dataset.spy === entry.target.id));
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['productos', 'packs', 'ruleta', 'faq', 'quienes-somos', 'contacto'].forEach((id) => { const el = document.getElementById(id); if (el) spyObserver.observe(el); });

    
    const burger = $('#burger');
    function setMenu(open) {
        header.classList.toggle('nav-open', open);
        document.body.classList.toggle('menu-open', open);
        burger.setAttribute('aria-expanded', String(open));
        burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
        if (open) header.classList.remove('hide');
    }
    burger.addEventListener('click', () => setMenu(!header.classList.contains('nav-open')));
    $$('.main-nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('in');
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    $$('.reveal').forEach((el) => revealObserver.observe(el));

    
    function runCounters(list) {
        list.forEach((el) => {
            if (el.dataset.done) return;
            el.dataset.done = '1';
            const target = Number(el.dataset.count);
            const dec = Number(el.dataset.dec || 0);
            const show = (v) => v.toFixed(dec).replace('.', ',');
            if (reduce) { el.textContent = show(target); return; }
            const t0 = performance.now();
            const dur = 1400;
            (function step(now) {
                const p = clamp((now - t0) / dur, 0, 1);
                el.textContent = show(target * (1 - Math.pow(1 - p, 3)));
                if (p < 1) raf(step);
            })(t0);
        });
    }

    
    (function particles() {
        const canvas = $('#bg-canvas');
        if (!canvas || reduce) return;
        const ctx = canvas.getContext('2d');
        let w, h, dpr, dots = [];
        const mouse = { x: -9999, y: -9999 };

        function resize() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = innerWidth; h = innerHeight;
            canvas.width = w * dpr; canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const n = clamp(Math.round((w * h) / 24000), 22, 70);
            dots = Array.from({ length: n }, () => ({
                x: Math.random() * w, y: Math.random() * h,
                vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
                r: Math.random() * 1.6 + .6
            }));
        }
        let running = true;
        function frame() {
            if (!running) return;
            ctx.clearRect(0, 0, w, h);
            for (let i = 0; i < dots.length; i++) {
                const p = dots[i];
                const dx = p.x - mouse.x, dy = p.y - mouse.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < 14000) { const f = (1 - d2 / 14000) * .6; p.vx += (dx / Math.sqrt(d2 || 1)) * f * .08; p.vy += (dy / Math.sqrt(d2 || 1)) * f * .08; }
                p.vx *= .995; p.vy *= .995;
                p.x += p.vx; p.y += p.vy;
                if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
                if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,.55)';
                ctx.fill();
                for (let j = i + 1; j < dots.length; j++) {
                    const q = dots[j];
                    const ex = p.x - q.x, ey = p.y - q.y;
                    const dist = ex * ex + ey * ey;
                    if (dist < 16000) {
                        ctx.strokeStyle = `rgba(120,200,255,${(1 - dist / 16000) * .22})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
                    }
                }
            }
            raf(frame);
        }
        window.addEventListener('resize', resize);
        window.addEventListener('pointermove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
        document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) frame(); });
        resize(); frame();
    })();

    
    (function pointerFx() {
        const glow = $('#cursor-glow');
        if (!fine) return;
        let gx = innerWidth / 2, gy = innerHeight / 2, tx = gx, ty = gy;
        window.addEventListener('pointermove', (e) => {
            tx = e.clientX; ty = e.clientY;
            glow.classList.add('on');
        }, { passive: true });
        (function loop() {
            gx += (tx - gx) * .12; gy += (ty - gy) * .12;
            glow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
            raf(loop);
        })();
    })();

    
    if (fine) {
        $$('.product-card').forEach((card) => {
            card.addEventListener('pointermove', (e) => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width;
                const y = (e.clientY - r.top) / r.height;
                card.style.setProperty('--mx', `${x * 100}%`);
                card.style.setProperty('--my', `${y * 100}%`);
                if (!reduce) {
                    card.style.setProperty('--rx', `${((.5 - y) * 9).toFixed(2)}deg`);
                    card.style.setProperty('--ry', `${((x - .5) * 9).toFixed(2)}deg`);
                }
            });
            card.addEventListener('pointerleave', () => {
                card.style.setProperty('--rx', '0deg');
                card.style.setProperty('--ry', '0deg');
            });
        });
        if (!reduce) {
            $$('.magnetic').forEach((el) => {
                el.addEventListener('pointermove', (e) => {
                    const r = el.getBoundingClientRect();
                    const x = e.clientX - (r.left + r.width / 2);
                    const y = e.clientY - (r.top + r.height / 2);
                    el.style.transform = `translate(${x * .22}px, ${y * .3}px)`;
                });
                el.addEventListener('pointerleave', () => { el.style.transform = ''; });
            });
        }
    }

    
    $$('.visual-slides').forEach((box, idx) => {
        const files = (box.dataset.slides || '').split(',').map((s) => s.trim()).filter(Boolean);
        const visual = box.closest('.product-visual');
        const imgs = [];
        files.forEach((src) => {
            const img = new Image();
            img.alt = box.dataset.alt ? `${box.dataset.alt}` : '';
            img.decoding = 'async';
            img.draggable = false;
            img.addEventListener('load', () => {
                imgs.push(img);
                box.append(img);
                if (imgs.length === 1) { img.classList.add('active'); visual.classList.add('has-img'); }
                if (imgs.length === 2 && !reduce) startRotation();
            });
            img.src = src;
        });
        let current = 0, timer = 0;
        function startRotation() {
            const order = () => imgs;
            setTimeout(() => {
                timer = setInterval(() => {
                    if (document.hidden) return;
                    imgs[current].classList.remove('active');
                    current = (current + 1) % order().length;
                    imgs[current].classList.add('active');
                }, 2800);
            }, idx * 500);
        }
    });

    
    const searchInput = $('#product-search');
    const cards = $$('.product-card');
    const filterButtons = $$('.filter-button');
    const emptyState = $('#empty-state');
    let activeFilter = 'all';

    const matchesFilter = (card, f) =>
        f === 'all' ||
        (f === '2' && card.dataset.price !== '' && Number(card.dataset.price) <= 2) ||
        (f === 'premium' && card.dataset.category === 'premium') ||
        (f === 'new' && card.dataset.category === 'new');

    filterButtons.forEach((btn) => {
        const count = cards.filter((c) => matchesFilter(c, btn.dataset.filter)).length;
        const span = $('span', btn);
        if (span) span.textContent = count;
    });

    function filterProducts() {
        const q = norm(searchInput.value);
        let visible = 0;
        cards.forEach((card) => {
            const show = card.dataset.name.includes(q) && matchesFilter(card, activeFilter);
            card.hidden = !show;
            if (show) { visible++; card.classList.add('in'); }
        });
        emptyState.hidden = visible > 0;
    }
    function setFilter(f) {
        activeFilter = f;
        filterButtons.forEach((b) => { const on = b.dataset.filter === f; b.classList.toggle('is-active', on); b.setAttribute('aria-pressed', String(on)); });
        filterProducts();
    }
    searchInput.addEventListener('input', filterProducts);
    filterButtons.forEach((btn) => btn.addEventListener('click', () => setFilter(btn.dataset.filter)));

    $$('[data-find]').forEach((chip) => chip.addEventListener('click', (e) => {
        e.preventDefault();
        searchInput.value = chip.dataset.find;
        setFilter('all');
        $('#productos').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    }));

    document.addEventListener('keydown', (e) => {
        const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
        if (e.key === '/' && !typing && !$('#modal').classList.contains('open')) {
            e.preventDefault();
            $('#productos').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
            setTimeout(() => searchInput.focus({ preventScroll: true }), 350);
        }
    });

    
    const cart = Object.fromEntries(Object.keys(PRODUCTS).map((k) => [k, 0]));
    const picks = Object.fromEntries(Object.keys(PRODUCTS).map((k) => [k, []]));
    const cartRows = $('#cart-rows');
    const cartTotal = $('#cart-total');
    const cartHint = $('#cart-hint');
    const cartBar = $('#cart-bar');
    const barCount = $('#cart-bar-count');
    const barTotal = $('#cart-bar-total');
    let shownTotal = 0;

    try {
        const saved = JSON.parse(localStorage.getItem('mollykao-pack') || '{}');
        Object.keys(cart).forEach((k) => { cart[k] = clamp(parseInt(saved[k], 10) || 0, 0, MAX_QTY); });
    } catch {  }

    cartRows.innerHTML = Object.entries(PRODUCTS).map(([key, p]) => `
        <div class="cart-row" data-row="${key}">
            <span class="cart-row-name"><span class="cart-check ${p.tone}">${p.letter}</span>${p.name}</span>
            <span class="cart-row-price">${fmt.format(p.price)}</span>
            <span class="stepper" role="group" aria-label="Cantidad de ${p.name}">
                <button type="button" data-step="-1" data-key="${key}" aria-label="Quitar uno de ${p.name}">−</button>
                <output aria-live="polite" data-qty="${key}">0</output>
                <button type="button" data-step="1" data-key="${key}" aria-label="Añadir uno de ${p.name}">+</button>
            </span>
        </div>`).join('');

    function animateTotal(el, from, to) {
        if (reduce) { el.textContent = fmt.format(to); return; }
        const t0 = performance.now();
        (function step(now) {
            const p = clamp((now - t0) / 500, 0, 1);
            el.textContent = fmt.format(from + (to - from) * (1 - Math.pow(1 - p, 3)));
            if (p < 1) raf(step);
        })(t0);
    }

    function totals() {
        let count = 0, total = 0;
        Object.entries(cart).forEach(([k, q]) => { count += q; total += q * PRODUCTS[k].price; });
        return { count, total };
    }

    function renderCart(bump = false) {
        Object.keys(cart).forEach((k) => {
            while (picks[k].length < cart[k]) picks[k].push(null);
            picks[k].length = cart[k];
            $(`[data-qty="${k}"]`).textContent = cart[k];
            $(`[data-step="-1"][data-key="${k}"]`).disabled = cart[k] === 0;
            $(`[data-step="1"][data-key="${k}"]`).disabled = cart[k] >= MAX_QTY;
        });
        const { count, total } = totals();
        animateTotal(cartTotal, shownTotal, total);
        animateTotal(barTotal, shownTotal, total);
        shownTotal = total;
        barCount.textContent = count;
        cartHint.textContent = count === 0
            ? 'Elige uno o varios para empezar.'
            : `${count} ${count === 1 ? 'producto' : 'productos'} · suma de precios de catálogo.`;
        cartBar.classList.toggle('show', count > 0);
        if (bump && !reduce) { cartTotal.classList.remove('bump'); void cartTotal.offsetWidth; cartTotal.classList.add('bump'); }
        try { localStorage.setItem('mollykao-pack', JSON.stringify(cart)); } catch {  }
        updateModalCount();
    }

    function addToCart(key, silent, variant) {
        if (!PRODUCTS[key] || cart[key] >= MAX_QTY) return;
        cart[key]++;
        renderCart(true);
        picks[key][picks[key].length - 1] = variant || null;
        if (!silent) toast(`${PRODUCTS[key].name}${variant ? ' · ' + variant : ''} añadido a tu pack`);
    }

    cartRows.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-step]');
        if (!btn) return;
        const key = btn.dataset.key;
        cart[key] = clamp(cart[key] + Number(btn.dataset.step), 0, MAX_QTY);
        renderCart(true);
    });
    $$('[data-add]').forEach((btn) => btn.addEventListener('click', () => addToCart(btn.dataset.add)));
    $$('[data-pack]').forEach((btn) => btn.addEventListener('click', () => {
        Object.keys(cart).forEach((k) => { cart[k] = 0; picks[k] = []; });
        btn.dataset.pack.split(',').forEach((pair) => {
            const [k, q] = pair.split(':');
            if (k in cart) cart[k] = clamp(parseInt(q, 10) || 0, 0, MAX_QTY);
        });
        renderCart(true);
        toast(`${$('strong', btn).textContent} cargado`);
    }));
    $('#cart-clear').addEventListener('click', () => {
        Object.keys(cart).forEach((k) => { cart[k] = 0; picks[k] = []; });
        renderCart();
    });

    /* ---- Guardar / compartir el pack (imagen) ---- */
    const shareModal = $('#share-modal');
    const shareImg = $('#share-img');
    const shareLoading = $('#share-loading');
    const shareNative = $('#share-native');
    const shareDownload = $('#share-download');
    const shareClose = $('#share-close');
    let shareBlob = null;
    let shareObjUrl = '';
    let shareFocus = null;
    let shareToken = 0;

    function packItems() {
        return Object.entries(cart).filter(([, q]) => q > 0).map(([k, q]) => {
            const p = PRODUCTS[k];
            const counts = {};
            picks[k].forEach((v) => { if (v) counts[v] = (counts[v] || 0) + 1; });
            const det = Object.entries(counts).map(([v, n]) => `${n} ${v}`).join(' · ');
            const first = picks[k].find(Boolean);
            const variant = p.variants.find((v) => v.label === first) || p.variants[0] || null;
            return { key: k, p, q, det, src: variant ? variant.src : null };
        });
    }
    const loadImg = (src) => new Promise((resolve) => {
        if (!src) return resolve(null);
        const i = new Image();
        i.onload = () => resolve(i);
        i.onerror = () => resolve(null);
        i.src = src;
    });
    function roundRect(c, x, y, w, h, r) {
        c.beginPath();
        c.moveTo(x + r, y);
        c.arcTo(x + w, y, x + w, y + h, r);
        c.arcTo(x + w, y + h, x, y + h, r);
        c.arcTo(x, y + h, x, y, r);
        c.arcTo(x, y, x + w, y, r);
        c.closePath();
    }
    async function drawPack(withImages) {
        const items = packItems();
        const imgs = await Promise.all(items.map((it) => (withImages ? loadImg(it.src) : null)));
        try { await Promise.all([document.fonts.load("700 40px 'Space Grotesk'"), document.fonts.load("500 28px 'DM Sans'")]); } catch {  }
        const W = 1080, P = 64, ROW = 148, GAP = 16, HEAD = 230, FOOT = 230;
        const H = HEAD + items.length * (ROW + GAP) + FOOT;
        const cv = document.createElement('canvas');
        cv.width = W; cv.height = H;
        const c = cv.getContext('2d');
        const display = "'Space Grotesk', system-ui, sans-serif";
        const body = "'DM Sans', system-ui, sans-serif";

        const bg = c.createLinearGradient(0, 0, W, H);
        bg.addColorStop(0, '#0b1a4a'); bg.addColorStop(.55, '#050816'); bg.addColorStop(1, '#1a0b3a');
        c.fillStyle = bg; c.fillRect(0, 0, W, H);
        [['#0a6cff', 120, 80, 460], ['#b020ff', W - 80, H * .45, 420], ['#00d9b4', 200, H - 60, 380]].forEach(([col, x, y, r]) => {
            const g = c.createRadialGradient(x, y, 0, x, y, r);
            g.addColorStop(0, col + '55'); g.addColorStop(1, col + '00');
            c.fillStyle = g; c.fillRect(0, 0, W, H);
        });

        const count = items.reduce((a, it) => a + it.q, 0);
        c.textAlign = 'left';
        c.fillStyle = '#ffffff'; c.font = `700 64px ${display}`;
        c.fillText('MollyKao', P, 112);
        const mw = c.measureText('MollyKao').width;
        c.fillStyle = '#ff6b4f'; c.fillText('.', P + mw, 112);
        c.fillStyle = '#9fb0c6'; c.font = `500 28px ${body}`;
        c.fillText('Mi pack', P, 162);
        c.textAlign = 'right';
        c.fillText(`${count} ${count === 1 ? 'producto' : 'productos'}`, W - P, 162);

        items.forEach((it, i) => {
            const y = HEAD + i * (ROW + GAP);
            roundRect(c, P, y, W - P * 2, ROW, 28);
            c.fillStyle = 'rgba(255,255,255,.07)'; c.fill();
            c.strokeStyle = 'rgba(255,255,255,.16)'; c.lineWidth = 2; c.stroke();

            const bx = P + 16, by = y + 16, bs = ROW - 32;
            roundRect(c, bx, by, bs, bs, 20);
            c.save(); c.globalAlpha = .22; c.fillStyle = it.p.color; c.fill(); c.restore();
            const img = imgs[i];
            c.textAlign = 'center';
            if (img) {
                const s = Math.min((bs - 12) / img.width, (bs - 12) / img.height);
                const w = img.width * s, h = img.height * s;
                c.drawImage(img, bx + (bs - w) / 2, by + (bs - h) / 2, w, h);
            } else {
                c.fillStyle = it.p.color; c.font = `700 64px ${display}`;
                c.fillText(it.p.letter, bx + bs / 2, by + bs / 2 + 22);
            }

            const tx = bx + bs + 28;
            c.textAlign = 'left';
            c.fillStyle = '#ffffff'; c.font = `700 38px ${display}`;
            c.fillText(it.p.name, tx, y + 64);
            c.fillStyle = '#9fb0c6'; c.font = `500 24px ${body}`;
            c.fillText(it.det || 'Unidad', tx, y + 104);

            c.textAlign = 'right';
            c.fillStyle = '#ffffff'; c.font = `700 38px ${display}`;
            c.fillText(fmt.format(it.p.price * it.q), W - P - 28, y + 64);
            c.fillStyle = '#9fb0c6'; c.font = `500 24px ${body}`;
            c.fillText(`${it.q} × ${fmt.format(it.p.price)}`, W - P - 28, y + 104);
        });

        const fy = HEAD + items.length * (ROW + GAP) + 16;
        c.strokeStyle = 'rgba(255,255,255,.3)'; c.lineWidth = 2;
        c.beginPath(); c.moveTo(P, fy); c.lineTo(W - P, fy); c.stroke();
        c.textAlign = 'left'; c.fillStyle = '#c6d4e4'; c.font = `500 30px ${body}`;
        c.fillText('Total estimado', P, fy + 76);
        c.textAlign = 'right'; c.fillStyle = '#d7ff5e'; c.font = `700 80px ${display}`;
        c.fillText(fmt.format(totals().total), W - P, fy + 88);
        c.textAlign = 'left'; c.fillStyle = '#7f90a8'; c.font = `500 24px ${body}`;
        c.fillText('MollyKao · una colección de JGT', P, H - 48);
        c.textAlign = 'right';
        c.fillText(new Date().toLocaleDateString('es-ES'), W - P, H - 48);
        return cv;
    }
    const canvasToBlob = (cv) => new Promise((resolve, reject) => {
        try { cv.toBlob((b) => (b ? resolve(b) : reject(new Error('blob'))), 'image/png'); }
        catch (err) { reject(err); }
    });
    async function buildPackBlob() {
        try { return await canvasToBlob(await drawPack(true)); }
        catch { return await canvasToBlob(await drawPack(false)); }
    }

    async function openShare() {
        if (!totals().count) { toast('Tu pack está vacío'); return; }
        const token = ++shareToken;
        shareFocus = document.activeElement;
        shareBlob = null;
        shareImg.removeAttribute('src');
        shareLoading.textContent = 'Preparando imagen…';
        shareLoading.hidden = false;
        shareNative.hidden = true;
        shareDownload.disabled = true;
        shareModal.classList.add('open');
        shareModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        shareClose.focus();
        try {
            const blob = await buildPackBlob();
            if (token !== shareToken) return;
            shareBlob = blob;
            if (shareObjUrl) URL.revokeObjectURL(shareObjUrl);
            shareObjUrl = URL.createObjectURL(blob);
            shareImg.src = shareObjUrl;
            shareLoading.hidden = true;
            shareDownload.disabled = false;
            const file = new File([blob], 'mi-pack-mollykao.png', { type: 'image/png' });
            shareNative.hidden = !(navigator.canShare && navigator.canShare({ files: [file] }));
        } catch {
            if (token === shareToken) shareLoading.textContent = 'No se pudo crear la imagen. Puedes usar el enlace.';
        }
    }
    function closeShare() {
        if (!shareModal.classList.contains('open')) return;
        shareToken++;
        shareModal.classList.remove('open');
        shareModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        if (shareFocus) shareFocus.focus();
    }
    $('#cart-share').addEventListener('click', openShare);
    shareClose.addEventListener('click', closeShare);
    shareModal.addEventListener('click', (e) => { if (e.target === shareModal) closeShare(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeShare(); });
    shareNative.addEventListener('click', async () => {
        if (!shareBlob) return;
        const file = new File([shareBlob], 'mi-pack-mollykao.png', { type: 'image/png' });
        try {
            await navigator.share({ files: [file], title: 'Mi pack MollyKao', text: `Mi pack MollyKao · ${fmt.format(totals().total)}` });
        } catch (err) {
            if (err && err.name !== 'AbortError') toast('No se pudo compartir. Prueba a descargarla.');
        }
    });
    shareDownload.addEventListener('click', () => {
        if (!shareBlob) return;
        const a = document.createElement('a');
        a.href = shareObjUrl;
        a.download = 'mi-pack-mollykao.png';
        document.body.append(a); a.click(); a.remove();
        toast('Descargando imagen');
    });
    renderCart();

    
    const modal = $('#modal');
    const pmImg = $('#pm-img');
    const pmStage = $('#pm-stage');
    const pmVariantWrap = $('#pm-variant-wrap');
    const pmVariants = $('#pm-variants');
    const modalAdd = $('#modal-add');
    const modalClose = $('#modal-close');
    let lastFocus = null;
    let currentVariant = 0;
    let swapTimer = 0;

    function setVariant(i, instant) {
        const p = PRODUCTS[modalKey];
        if (!p || !p.variants.length) return;
        currentVariant = clamp(i, 0, p.variants.length - 1);
        const v = p.variants[currentVariant];
        const apply = () => { pmImg.src = v.src; pmImg.alt = `${p.name} · ${v.label}`; pmImg.classList.remove('out'); };
        clearTimeout(swapTimer);
        if (instant || reduce) apply();
        else { pmImg.classList.add('out'); swapTimer = setTimeout(apply, 180); }
        $$('.pm-variant', pmVariants).forEach((b, idx) => {
            const on = idx === currentVariant;
            b.classList.toggle('is-active', on);
            b.setAttribute('aria-pressed', String(on));
        });
        $('#pm-variant-name').textContent = v.label;
    }

    function openModal(key) {
        const p = PRODUCTS[key];
        if (!p) return;
        modalKey = key;
        lastFocus = document.activeElement;
        $('.pm').style.setProperty('--tone', p.color);
        $('#modal-title').textContent = p.name;
        $('#pm-tag').textContent = p.tag;
        const pmDesc = $('#pm-desc');
        pmDesc.textContent = p.desc;
        if (p.note) {
            const note = document.createElement('span');
            note.className = 'pm-note';
            note.textContent = p.note;
            pmDesc.append(' ', note);
        }
        $('#pm-price').innerHTML = `${new Intl.NumberFormat('es-ES', { minimumFractionDigits: p.price % 1 ? 2 : 0 }).format(p.price)} <small>€</small>`;
        $('#pm-letter').textContent = p.letter;
        const specs = [['Precio', fmt.format(p.price)], ['Acabados', p.variants.length ? p.variants.map((v) => v.label).join(' · ') : 'Próximamente'], ['Colección', 'MollyKao · JGT']];
        $('#pm-specs').innerHTML = specs.map(([a, b]) => `<li><span>${a}</span><strong>${b}</strong></li>`).join('');

        const has = p.variants.length > 0;
        pmStage.classList.toggle('no-img', !has);
        pmVariantWrap.hidden = p.variants.length < 2;
        pmVariants.innerHTML = p.variants.map((v, i) => `<button type="button" class="pm-variant" data-i="${i}" aria-pressed="false"><img src="${v.src}" alt=""><span>${v.label}</span></button>`).join('');
        $('#pm-single').textContent = p.variants.length === 1 ? `Acabado: ${p.variants[0].label}` : '';
        modalAdd.disabled = !has;
        modalAdd.textContent = has ? 'Añadir al pack +' : 'Muy pronto';
        if (has) setVariant(0, true);
        updateModalCount();

        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        modalClose.focus();
    }
    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        modalKey = null;
        clearTimeout(swapTimer);
        if (lastFocus) lastFocus.focus();
    }
    $$('[data-open]').forEach((btn) => btn.addEventListener('click', () => openModal(btn.dataset.open)));
    $$('.product-card').forEach((card) => {
        const key = card.dataset.name;
        [$('.product-visual', card), $('.product-info > p', card)].forEach((el) => {
            if (!el) return;
            el.classList.add('is-clickable');
            el.addEventListener('click', () => openModal(key));
        });
    });
    modalClose.addEventListener('click', closeModal);
    pmVariants.addEventListener('click', (e) => { const b = e.target.closest('.pm-variant'); if (b) setVariant(Number(b.dataset.i)); });
    modalAdd.addEventListener('click', () => {
        const p = PRODUCTS[modalKey];
        if (!p || !p.variants.length) return;
        addToCart(modalKey, false, p.variants.length > 1 ? p.variants[currentVariant].label : null);
    });
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('open')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') setVariant(currentVariant + 1);
        if (e.key === 'ArrowLeft') setVariant(currentVariant - 1);
        if (e.key === 'Tab') {
            const items = $$('button, a[href]', modal).filter((el) => el.offsetParent !== null && !el.disabled);
            if (!items.length) return;
            const i = items.indexOf(document.activeElement);
            if (i === -1) { e.preventDefault(); items[0].focus(); }
            else if (e.shiftKey && i === 0) { e.preventDefault(); items[items.length - 1].focus(); }
            else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
        }
    });

    
    const confettiCanvas = $('#confetti');
    const cctx = confettiCanvas.getContext('2d');
    let pieces = [];
    let confettiRunning = false;
    function sizeConfetti() { confettiCanvas.width = innerWidth; confettiCanvas.height = innerHeight; }
    sizeConfetti();
    window.addEventListener('resize', sizeConfetti);

    function burst(x, y, amount = 150) {
        if (reduce) return;
        const colors = ['#ff6b4f', '#d7ff5e', '#5cc8ff', '#9b6bff', '#19e3d0', '#ffffff', '#efc36e'];
        for (let i = 0; i < amount; i++) {
            const a = Math.random() * Math.PI * 2;
            const s = Math.random() * 11 + 4;
            pieces.push({
                x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 6,
                w: Math.random() * 8 + 5, h: Math.random() * 5 + 3,
                rot: Math.random() * 6, vr: (Math.random() - .5) * .35,
                color: colors[(Math.random() * colors.length) | 0], life: 0
            });
        }
        if (!confettiRunning) { confettiRunning = true; raf(confettiFrame); }
    }
    function confettiFrame() {
        cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        pieces = pieces.filter((p) => p.life < 150 && p.y < confettiCanvas.height + 30);
        pieces.forEach((p) => {
            p.life++;
            p.vy += .28; p.vx *= .985;
            p.x += p.vx; p.y += p.vy; p.rot += p.vr;
            cctx.save();
            cctx.globalAlpha = clamp(1 - p.life / 150, 0, 1);
            cctx.translate(p.x, p.y);
            cctx.rotate(p.rot);
            cctx.fillStyle = p.color;
            cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            cctx.restore();
        });
        if (pieces.length) raf(confettiFrame);
        else { confettiRunning = false; cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height); }
    }

    
    const SPIN_MS = 9000;
    const PRIZES = [
        { label: 'Nada esta vez',      short: 'Nada',     probability: 50,  color: '#5f7f99', message: 'Esta vez no ha habido premio. ¡Gracias por jugar!', celebrate: false },
        { label: 'Una firma',          short: 'Firma',    probability: 10,  color: '#4fd1c5', message: '¡Has ganado una firma!', celebrate: true },
        { label: 'Descuento del 10%',  short: '-10 %',    probability: 10,  color: '#cdf45e', message: '¡Has ganado un cupón del 10% de descuento!', celebrate: true },
        { label: 'Pagar 1 € más',      short: '+1 €',     probability: 21,   color: '#ff6b4f', message: 'Te ha tocado pagar 1 € más.', celebrate: false },
        { label: 'Descuento del 20%',  short: '-20 %',    probability: 1,   color: '#ffd27a', message: '¡Has ganado un cupón del 20% de descuento!', celebrate: true },
        { label: 'Un producto gratis', short: 'Gratis',   probability: 0.5, color: '#b78bff', message: '¡Has ganado un producto gratis!', celebrate: true },
        { label: 'Descuento del 5%',   short: '-5 %',     probability: 5,   color: '#7be0a2', message: '¡Has ganado un cupón del 5% de descuento!', celebrate: true },
        { label: 'Elige tu favorito',  short: 'Elige',    probability: 2.5, color: '#ff9ec2', message: '¡Puedes elegir tu producto favorito!', celebrate: true }
    ];
    const wheel = $('#wheel');
    const wheelPlay = $('.wheel-play');
    const wheelCtx = wheel.getContext('2d');
    const spinButton = $('#spin-button');
    const wheelResult = $('#wheel-result');
    const wheelOdds = $('#wheel-odds');
    const wheelHistory = $('#wheel-history');
    const pointer = $('#wheel-pointer');
    const win = $('#win');
    const fmtPct = (n) => `${new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 }).format(n)} %`;

    let acc = 0;
    const stops = PRIZES.map((p) => {
        const s = { ...p, start: acc, end: acc + p.probability };
        acc += p.probability;
        return s;
    });

    stops.forEach((p) => {
        const li = document.createElement('li');
        const sw = document.createElement('span');
        sw.className = 'odds-swatch'; sw.style.background = p.color;
        const name = document.createElement('span'); name.textContent = p.label;
        const pct = document.createElement('strong');
        pct.textContent = fmtPct(p.probability);
        li.append(sw, name, pct);
        wheelOdds.append(li);
    });

    const mixHex = (hex, amt) => {
        const n = parseInt(hex.slice(1), 16);
        const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v + (amt >= 0 ? (255 - v) : v) * amt));
        return `rgb(${ch[0]},${ch[1]},${ch[2]})`;
    };

    function drawWheel() {
        const S = wheel.width, c = S / 2;
        const rim = c - 8;
        const r = c - 54;
        const ctx = wheelCtx;
        ctx.clearRect(0, 0, S, S);

        const rimGrad = ctx.createLinearGradient(0, 0, S, S);
        rimGrad.addColorStop(0, '#26357d'); rimGrad.addColorStop(.5, '#0d1440'); rimGrad.addColorStop(1, '#1b2a6e');
        ctx.beginPath(); ctx.arc(c, c, rim, 0, Math.PI * 2); ctx.fillStyle = rimGrad; ctx.fill();
        const edge = ctx.createLinearGradient(0, 0, S, S);
        edge.addColorStop(0, 'rgba(255,255,255,.95)'); edge.addColorStop(.5, 'rgba(120,200,255,.35)'); edge.addColorStop(1, 'rgba(255,255,255,.8)');
        ctx.lineWidth = 4; ctx.strokeStyle = edge; ctx.stroke();
        ctx.beginPath(); ctx.arc(c, c, r + 34, 0, Math.PI * 2);
        ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(255,255,255,.22)'; ctx.stroke();

        const bulbs = 36;
        for (let i = 0; i < bulbs; i++) {
            const a = (i / bulbs) * Math.PI * 2;
            const x = c + Math.cos(a) * (r + 20), y = c + Math.sin(a) * (r + 20);
            const col = i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#5cc8ff' : '#d7ff5e';
            ctx.beginPath(); ctx.arc(x, y, i % 3 === 0 ? 4.5 : 3.2, 0, Math.PI * 2);
            ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 12; ctx.fill();
        }
        ctx.shadowBlur = 0;

        stops.forEach((p) => {
            const a0 = -Math.PI / 2 + (p.start / 100) * Math.PI * 2;
            const a1 = -Math.PI / 2 + (p.end / 100) * Math.PI * 2;
            const g = ctx.createRadialGradient(c, c, r * .12, c, c, r);
            g.addColorStop(0, mixHex(p.color, .38)); g.addColorStop(.55, p.color); g.addColorStop(1, mixHex(p.color, -.12));
            ctx.beginPath(); ctx.moveTo(c, c); ctx.arc(c, c, r, a0, a1); ctx.closePath();
            ctx.fillStyle = g; ctx.fill();
        });
        stops.forEach((p) => {
            const a = -Math.PI / 2 + (p.start / 100) * Math.PI * 2;
            ctx.beginPath(); ctx.moveTo(c, c); ctx.lineTo(c + Math.cos(a) * r, c + Math.sin(a) * r);
            ctx.lineWidth = 2.5; ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.stroke();
        });
        ctx.beginPath(); ctx.arc(c, c, r, 0, Math.PI * 2);
        ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.stroke();
        ctx.beginPath(); ctx.arc(c, c, r * .3, 0, Math.PI * 2);
        ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.stroke();

        stops.forEach((p) => {
            if (p.probability < 1) return;
            const mid = -Math.PI / 2 + ((p.start + p.probability / 2) / 100) * Math.PI * 2;
            const arc = (p.probability / 100) * Math.PI * 2 * r * .7;
            const size = clamp(arc * .72, 13, 34);
            ctx.save();
            ctx.translate(c, c); ctx.rotate(mid);
            ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
            ctx.font = `700 ${size}px 'Space Grotesk', sans-serif`;
            ctx.fillStyle = 'rgba(11,15,26,.9)';
            ctx.fillText(p.short, r - 28, 0);
            ctx.restore();
        });

        const shine = ctx.createRadialGradient(c * .8, c * .65, r * .05, c, c, r);
        shine.addColorStop(0, 'rgba(255,255,255,.28)'); shine.addColorStop(.6, 'rgba(255,255,255,.04)'); shine.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath(); ctx.arc(c, c, r, 0, Math.PI * 2); ctx.fillStyle = shine; ctx.fill();
    }
    drawWheel();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawWheel);

    let audio = null;
    const soundOn = true;
    function ensureAudio() {
        if (!audio) { const AC = window.AudioContext || window.webkitAudioContext; if (AC) audio = new AC(); }
        if (audio && audio.state === 'suspended') audio.resume();
    }
    function beep(freq, dur, vol = .04, type = 'square', when = 0) {
        if (!soundOn || !audio) return;
        const t = audio.currentTime + when;
        const o = audio.createOscillator();
        const g = audio.createGain();
        o.type = type; o.frequency.value = freq;
        g.gain.setValueAtTime(vol, t);
        g.gain.exponentialRampToValueAtTime(.0001, t + dur);
        o.connect(g); g.connect(audio.destination);
        o.start(t); o.stop(t + dur);
    }

    let rotation = 0;
    const SPIN_KEY = 'mollykao-spin-day';
    const todayKey = () => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };
    function spunToday() { try { return localStorage.getItem(SPIN_KEY) === todayKey(); } catch { return false; } }
    function markSpun() { try { localStorage.setItem(SPIN_KEY, todayKey()); } catch {  } }
    let used = spunToday();
    let unlockTimer = 0;

    function lockWheel() {
        spinButton.disabled = true;
        spinButton.textContent = 'Vuelve mañana';
        wheelPlay.classList.add('is-used');
        wheelResult.textContent = 'Ya has girado hoy. ¡Vuelve mañana para otra tirada!';
        wheelHistory.textContent = 'Una tirada al día';
    }
    function unlockWheel() {
        if (spinning || !used) return;
        used = false;
        spinButton.disabled = false;
        spinButton.textContent = 'Girar';
        wheelPlay.classList.remove('is-used');
        wheelResult.classList.remove('win');
        wheelResult.textContent = '¡Nueva tirada disponible!';
        wheelHistory.textContent = '';
    }
    function scheduleUnlock() {
        clearTimeout(unlockTimer);
        const now = new Date();
        const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        unlockTimer = setTimeout(unlockWheel, next - now + 1000);
    }
    let spinning = false;
    let spinCount = 0;
    let pendingRepeat = false;
    let lastTick = 0;
    let wiggle = null;

    function currentAngle() {
        const m = getComputedStyle(wheel).transform;
        if (!m || m === 'none') return 0;
        const v = m.match(/matrix\(([^)]+)\)/);
        if (!v) return 0;
        const [a, b] = v[1].split(',').map(Number);
        return (Math.atan2(b, a) * 180 / Math.PI + 360) % 360;
    }
    function sectorAtPointer() {
        const pct = (((360 - currentAngle()) % 360) / 360) * 100;
        return stops.findIndex((s) => pct >= s.start && pct < s.end);
    }

    function showWin(prize) {
        const rare = prize.probability <= 2.5;
        win.classList.toggle('lose', !prize.celebrate);
        win.classList.toggle('rare', rare && prize.celebrate);
        $('#win-eyebrow').textContent = !prize.celebrate ? 'Esta vez no…' : rare ? '¡Premio raro!' : '¡Premio!';
        $('#win-big').textContent = prize.short;
        $('#win-title').textContent = prize.label;
        $('#win-msg').textContent = prize.message;
        $('#win-prob').textContent = `Probabilidad de este resultado: ${fmtPct(prize.probability)}`;
        $('#win-close').textContent = 'Cerrar';
        win.classList.add('open');
        win.setAttribute('aria-hidden', 'false');
        $('#win-close').focus();

        if (prize.celebrate) {
            const cx = innerWidth / 2, cy = innerHeight / 2;
            burst(cx, cy, rare ? 240 : 130);
            if (rare) {
                setTimeout(() => burst(innerWidth * .2, innerHeight * .6, 120), 350);
                setTimeout(() => burst(innerWidth * .8, innerHeight * .6, 120), 600);
            }
            beep(523, .16, .05, 'triangle'); beep(659, .16, .05, 'triangle', .14); beep(784, .3, .05, 'triangle', .28);
        } else {
            beep(220, .3, .05, 'sawtooth');
        }
    }

    function closeWin() {
        if (!win.classList.contains('open')) return;
        win.classList.remove('open');
        win.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('wheel-focus');
        wheelPlay.classList.remove('zoom');
        spinning = false;
        spinButton.disabled = true;
        spinButton.textContent = 'Vuelve mañana';
        scheduleUnlock();
        wheelPlay.classList.add('is-used');
    }
    $('#win-close').addEventListener('click', closeWin);
    win.addEventListener('click', (e) => { if (e.target === win) closeWin(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeWin(); });

    function spin() {
        if (spinning || used) return;
        used = true;
        markSpun();
        spinning = true;
        spinButton.disabled = true;
        wheelResult.classList.remove('win');
        wheelResult.textContent = 'Girando… ¡mucha suerte!';
        ensureAudio();

        document.body.classList.add('wheel-focus');
        wheelPlay.classList.add('zoom');
        wheel.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });

        const draw = Math.random() * 100;
        const prize = stops.find((s) => draw < s.end) || stops[stops.length - 1];
        let done = false;

        function finish() {
            if (done) return;
            done = true;
            wheel.removeEventListener('transitionend', onEnd);
            spinCount++;
            wheelResult.textContent = prize.message;
            wheelResult.classList.toggle('win', prize.celebrate);
            wheelHistory.textContent = 'No más por hoy…';
            setTimeout(() => showWin(prize), reduce ? 0 : 900);
        }
        function onEnd(e) { if (e.target === wheel && e.propertyName === 'transform') finish(); }

        setTimeout(() => {
            const center = prize.start + prize.probability / 2;
            const jitter = (Math.random() - .5) * prize.probability * .7;
            const target = (360 - (center + jitter) * 3.6 + 360) % 360;
            const delta = (target - (rotation % 360) + 360) % 360;
            rotation += 360 * (8 + ((Math.random() * 4) | 0)) + delta;
            wheel.style.transform = `rotate(${rotation}deg)`;

            let lastIdx = sectorAtPointer();
            (function tickLoop() {
                if (done) return;
                const idx = sectorAtPointer();
                if (idx !== lastIdx) {
                    lastIdx = idx;
                    const now = performance.now();
                    if (now - lastTick > 45) { beep(900, .035, .035); lastTick = now; }
                    if (!reduce && pointer.animate) {
                        if (wiggle) wiggle.cancel();
                        wiggle = pointer.animate([
                            { transform: 'translateX(-50%) rotate(0deg)' },
                            { transform: 'translateX(-50%) rotate(-16deg)' },
                            { transform: 'translateX(-50%) rotate(0deg)' }
                        ], { duration: 130, easing: 'ease-out' });
                    }
                }
                raf(tickLoop);
            })();

            wheel.addEventListener('transitionend', onEnd);
            setTimeout(finish, SPIN_MS + 700);
        }, reduce ? 0 : 750);
    }
    spinButton.addEventListener('click', spin);
    if (used) { lockWheel(); scheduleUnlock(); }

    
    const form = $('#suggestion-form');
    const status = $('#suggestion-status');
    let lastSuggestion = 0;

    function saveLocal(entry) {
        try {
            const list = JSON.parse(localStorage.getItem('mollykao-suggestions') || '[]');
            list.push(entry);
            localStorage.setItem('mollykao-suggestions', JSON.stringify(list));
            return true;
        } catch { return false; }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (form.elements.website && form.elements.website.value) return;
        const entry = {
            kind: form.elements.kind.value,
            title: form.elements.title.value.trim(),
            details: form.elements.details.value.trim(),
            createdAt: new Date().toISOString()
        };
        if (!entry.title) { status.textContent = 'Escribe tu sugerencia antes de enviarla.'; return; }
        if (Date.now() - lastSuggestion < 15000) { status.textContent = 'Espera unos segundos antes de enviar otra.'; return; }

        const kindLabel = entry.kind === 'objeto' ? 'Un objeto nuevo' : 'Un cambio en la página';
        const submitBtn = $('button[type="submit"]', form);
        submitBtn.disabled = true;
        status.textContent = 'Enviando…';

        let mode = 'local';
        let ok = true;

        if (CONFIG.suggestionsEndpoint) {
            mode = 'remote';
            try {
                const ctrl = new AbortController();
                const timeout = setTimeout(() => ctrl.abort(), 15000);
                const res = await fetch(CONFIG.suggestionsEndpoint, {
                    signal: ctrl.signal,
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify({ _subject: `Sugerencia MollyKao: ${entry.title}`, _template: 'table', _captcha: 'false', tipo: kindLabel, sugerencia: entry.title, detalles: entry.details || '(sin detalles)', fecha: new Date(entry.createdAt).toLocaleString('es-ES') })
                });
                clearTimeout(timeout);
                ok = res.ok;
                try { const data = await res.json(); if (data && String(data.success) === 'false') { ok = false; console.warn('Sugerencia no enviada:', data.message); } } catch {  }
            } catch (err) { ok = false; console.warn('Sugerencia no enviada:', err); }
        } else if (CONFIG.suggestionsEmail) {
            mode = 'mail';
            const subject = encodeURIComponent(`Sugerencia MollyKao: ${entry.title}`);
            const body = encodeURIComponent(`Tipo: ${kindLabel}\nSugerencia: ${entry.title}\nDetalles: ${entry.details || '(sin detalles)'}`);
            window.location.href = `mailto:${CONFIG.suggestionsEmail}?subject=${subject}&body=${body}`;
        } else {
            ok = saveLocal(entry);
        }

        submitBtn.disabled = false;

        if (mode === 'remote' && !ok) {
            saveLocal(entry);
            if (CONFIG.suggestionsEmail) {
                const subject = encodeURIComponent(`Sugerencia MollyKao: ${entry.title}`);
                const body = encodeURIComponent(`Tipo: ${kindLabel}\nSugerencia: ${entry.title}\nDetalles: ${entry.details || '(sin detalles)'}`);
                window.location.href = `mailto:${CONFIG.suggestionsEmail}?subject=${subject}&body=${body}`;
                status.textContent = 'No se pudo enviar automáticamente. Se ha abierto tu correo con la idea preparada: solo falta pulsar enviar.';
            } else {
                status.textContent = 'No se pudo enviar ahora. La hemos guardado en este dispositivo; inténtalo de nuevo más tarde.';
            }
            return;
        }
        if (!ok) { status.textContent = 'No se pudo registrar la sugerencia. Inténtalo de nuevo.'; return; }

        lastSuggestion = Date.now();
        form.reset();
        if (mode === 'remote') status.textContent = '¡Sugerencia enviada! Gracias por ayudarnos a mejorar.';
        else if (mode === 'mail') status.textContent = 'Se ha abierto tu correo con la idea preparada. Solo falta pulsar enviar.';
        else status.textContent = 'Idea guardada en este dispositivo. ¡Gracias!';
        toast('¡Gracias por tu sugerencia!');
        burst(innerWidth / 2, innerHeight - 160, 60);
    });

    
    $('#to-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
    $$('a[href="#inicio"]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); }));

    const baseTitle = document.title;
    document.addEventListener('visibilitychange', () => {
        document.title = document.hidden ? 'Vuelve, te esperamos · MollyKao' : baseTitle;
    });

    const track = $('.marquee-track');
    if (track && track.children.length === 1) {
        const clone = track.firstElementChild.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.append(clone);
    }
})();
