// SOUZA landings: código da empresa (?r=SZ-0001) no WhatsApp, revelações, CTA fixo, galeria, diagnóstico, lupa.
(() => {
  const WA = '351916868318';
  const V = document.documentElement.dataset.variante || 'O';
  const raw = new URLSearchParams(location.search).get('r') || '';
  const ref = /^SZ-\d{4}$/.test(raw.toUpperCase()) ? raw.toUpperCase() : '';
  const tag = ref ? `\n\n[Ref. ${ref} · ${V}]` : `\n\n[${V}]`;
  const base = 'Olá Fábio, vi a página da SOUZA para serralharias e queria falar sobre técnicos para a minha empresa.';
  const link = (txt) => `https://wa.me/${WA}?text=${encodeURIComponent(txt + tag)}`;
  document.querySelectorAll('a[data-wa]').forEach(a => { a.href = link(base); a.target = '_blank'; a.rel = 'noopener'; });

  // revelações ao scroll
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' }) : null;
  document.querySelectorAll('.rv').forEach((el, i) => {
    el.style.transitionDelay = (el.dataset.d || 0) + 'ms';
    io ? io.observe(el) : el.classList.add('in');
  });

  // CTA fixo no telemóvel: aparece depois do hero e esconde-se no CTA final
  const st = document.querySelector('.sticky'), hero = document.querySelector('.hero'), fin = document.querySelector('.final');
  if (st && hero && 'IntersectionObserver' in window) {
    let pastHero = false, atEnd = false;
    const upd = () => st.classList.toggle('on', pastHero && !atEnd);
    new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; upd(); }).observe(hero);
    if (fin) new IntersectionObserver(([e]) => { atEnd = e.isIntersecting; upd(); }).observe(fin);
  }

  // A: galeria com filtros e lightbox
  const gal = document.querySelector('.gal');
  if (gal) {
    const items = [...gal.querySelectorAll('button')];
    document.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', x === c));
      items.forEach(b => b.hidden = c.dataset.f !== 'all' && !b.dataset.t.includes(c.dataset.f));
    }));
    const more = document.querySelector('.more');
    if (more) more.addEventListener('click', () => gal.classList.add('all'));
    document.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => gal.classList.add('all')));
    const lb = document.querySelector('.lb');
    items.forEach(b => b.addEventListener('click', () => {
      lb.querySelector('img').src = b.dataset.big; lb.querySelector('img').alt = b.querySelector('img').alt;
      lb.querySelector('p').textContent = b.querySelector('img').alt;
      lb.showModal();
    }));
    lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  }

  // B: diagnóstico que escreve a mensagem do WhatsApp
  const dg = document.querySelector('.diag');
  if (dg) {
    const out = dg.querySelector('.preview'), go = dg.querySelector('a.btn');
    const val = n => [...dg.querySelectorAll(`[name=${n}]:checked`)].map(i => i.value);
    const upd = () => {
      const t = val('t'), q = val('q')[0], w = val('w')[0], onde = dg.querySelector('[name=onde]').value.trim();
      let m = 'Olá Fábio, preciso de reforço na minha serralharia.';
      if (t.length) m += `\nTrabalho: ${t.join(', ')}.`;
      if (q) m += `\nTécnicos: ${q}.`;
      if (onde) m += `\nOnde: ${onde}.`;
      if (w) m += `\nQuando: ${w}.`;
      out.textContent = m;
      go.href = link(m);
    };
    dg.addEventListener('input', upd); dg.addEventListener('change', upd); upd();
    go.target = '_blank'; go.rel = 'noopener';
  }

  // C: lupa no cordão (rato e dedo)
  const lp = document.querySelector('.loupe');
  if (lp) {
    const lens = lp.querySelector('.lens'), img = lp.querySelector('img'), Z = 2.6;
    const big = lp.dataset.big;
    lens.style.backgroundImage = `url(${big})`;
    const place = (x, y) => {
      const r = lp.getBoundingClientRect();
      const px = Math.max(0, Math.min(r.width, x - r.left)), py = Math.max(0, Math.min(r.height, y - r.top));
      lens.style.left = px + 'px'; lens.style.top = py + 'px';
      // a imagem usa object-fit:cover; calcular a área visível
      const ir = img.naturalWidth / img.naturalHeight, rr = r.width / r.height;
      let w, h, ox = 0, oy = 0;
      if (ir > rr) { h = r.height; w = h * ir; ox = (w - r.width) / 2; } else { w = r.width; h = w / ir; oy = (h - r.height) / 2; }
      lens.style.backgroundSize = `${w * Z}px ${h * Z}px`;
      lens.style.backgroundPosition = `${-((px + ox) * Z - 95)}px ${-((py + oy) * Z - 95)}px`;
      lp.querySelector('.hint')?.remove();
    };
    lp.addEventListener('pointermove', e => place(e.clientX, e.clientY));
    lp.addEventListener('pointerdown', e => place(e.clientX, e.clientY));
    const init = () => { const r = lp.getBoundingClientRect(); place(r.left + r.width * .55, r.top + r.height * .48); lp.insertAdjacentHTML('beforeend', ''); };
    img.complete ? requestAnimationFrame(() => { const h = lp.querySelector('.hint'); init(); if (h) lp.appendChild(h); }) : img.addEventListener('load', () => { const h = lp.querySelector('.hint'); init(); if (h) lp.appendChild(h); });
  }
})();
// vídeo: botão grande de play; controlos só depois de arrancar
document.querySelectorAll('.vid-frame').forEach(f => {
  const v = f.querySelector('video'), b = f.querySelector('.vid-play');
  b.addEventListener('click', () => { v.controls = true; v.play(); });
  v.addEventListener('play', () => { f.classList.add('playing'); v.controls = true; });
});
// cabeçalho fixo no computador depois do topo
(() => {
  const top = document.querySelector('.top'), hero = document.querySelector('.hero');
  if (!top || !hero || !('IntersectionObserver' in window)) return;
  const mq = matchMedia('(min-width:901px)');
  new IntersectionObserver(([e]) => top.classList.toggle('fix', !e.isIntersecting && mq.matches), { rootMargin: '-120px 0px 0px 0px' }).observe(hero);
})();
// ===== revisão 2 (11/11): faíscas no topo, título que arrefece, títulos palavra a palavra, linha dos passos =====
(() => {
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1) título principal: as letras entram incandescentes e arrefecem (da esquerda para a direita)
  const h1 = document.querySelector('.hero h1');
  if (h1 && !calm) {
    const txt = h1.textContent; h1.setAttribute('aria-label', txt);
    let i = 0;
    h1.innerHTML = txt.split(/(\s+)/).map(w => /^\s+$/.test(w) ? w :
      `<span class="w" aria-hidden="true">${[...w].map(c => `<span class="hot" style="--i:${i++}">${c}</span>`).join('')}</span>`).join('');
    h1.classList.add('welding');
  }

  // 2) títulos das secções: palavras a subir quando a secção aparece
  document.querySelectorAll('section:not(.hero) h2').forEach(h => {
    if (calm || h.querySelector('*')) return;
    const txt = h.textContent; h.setAttribute('aria-label', txt);
    h.innerHTML = txt.split(' ').map((w, k) => `<span class="wd" aria-hidden="true"><span style="--k:${k}">${w}</span></span>`).join(' ');
    h.classList.add('words');
    const io = new IntersectionObserver(([e], o) => { if (e.isIntersecting) { h.classList.add('in'); o.disconnect(); } }, { rootMargin: '0px 0px -10% 0px' });
    io.observe(h);
  });

  // 3) faíscas a sair do ponto da soldadura na foto do topo
  const media = document.querySelector('.hero-media'), img = media && media.querySelector('img');
  if (!media || !img || calm) return;
  const ARC = { x: 0.294, y: 0.496 };              // ponto do arco na foto f04 (fração da imagem)
  const cv = document.createElement('canvas'); cv.className = 'sparks'; cv.setAttribute('aria-hidden', 'true');
  media.appendChild(cv);
  const ctx = cv.getContext('2d');
  let W = 0, H = 0, ax = 0, ay = 0, dpr = 1, run = false, last = 0, ps = [], sc = 1;
  const fit = () => {
    const r = media.getBoundingClientRect(); dpr = Math.min(devicePixelRatio || 1, 2);
    W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // object-fit:cover + object-position lido do CSS
    const iw = img.naturalWidth || 800, ih = img.naturalHeight || 1422, s = Math.max(W / iw, H / ih);
    const pos = getComputedStyle(img).objectPosition.split(' ').map(v => parseFloat(v) / 100);
    const ox = (W - iw * s) * (isNaN(pos[0]) ? .5 : pos[0]), oy = (H - ih * s) * (isNaN(pos[1]) ? .5 : pos[1]);
    ax = ox + ARC.x * iw * s; ay = oy + ARC.y * ih * s;
    sc = Math.min(1, Math.max(.4, H / 900));
  };
  const spawn = n => { for (let k = 0; k < n; k++) {
    const a = -Math.PI / 2 + (Math.random() - .35) * 2.4, v = (120 + Math.random() * 340) * sc;
    ps.push({ x: ax + (Math.random() - .5) * 8, y: ay + (Math.random() - .5) * 6, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: .5 + Math.random() * 1.1, w: (1.2 + Math.random() * 1.6) * Math.max(.6, sc) });
  } };
  const tick = t => {
    if (!run) return;
    const dt = Math.min(.033, (t - last) / 1000 || .016); last = t;
    ctx.clearRect(0, 0, W, H);
    // brilho do arco a tremeluzir
    const f = .75 + Math.random() * .25, g = ctx.createRadialGradient(ax, ay, 0, ax, ay, 90 * f * sc);
    g.addColorStop(0, `rgba(200,225,255,${.55 * f})`); g.addColorStop(.35, `rgba(120,170,255,${.18 * f})`); g.addColorStop(1, 'rgba(120,170,255,0)');
    ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(ax - 100, ay - 100, 200, 200);
    spawn(Math.round((3 + Math.random() * 3) * sc * sc + .3));
    ps = ps.filter(p => (p.life += dt) < p.max && p.y < H + 10);
    for (const p of ps) {
      
      p.vy += 520 * sc * dt; p.vx *= .995; p.x += p.vx * dt; p.y += p.vy * dt;
      const k = 1 - p.life / p.max;                        // arrefece: branco → amarelo → laranja
      ctx.strokeStyle = `rgba(255,${Math.round(150 + 105 * k)},${Math.round(60 + 160 * k * k)},${k})`;
      ctx.lineWidth = p.w * (0.6 + k * .6); ctx.beginPath(); ctx.moveTo(p.x - p.vx * .028, p.y - p.vy * .028); ctx.lineTo(p.x, p.y); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
    requestAnimationFrame(tick);
  };
  const start = () => { if (!run) { run = true; last = performance.now(); requestAnimationFrame(tick); } };
  const stop = () => { run = false; };
  const go = () => { fit(); new IntersectionObserver(([e]) => e.isIntersecting ? start() : stop()).observe(media); };
  img.complete ? go() : img.addEventListener('load', go);
  addEventListener('resize', fit);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
})();
