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
