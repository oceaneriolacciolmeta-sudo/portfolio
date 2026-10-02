(() => {
  const P = window.PROJECTS || {};
  const $ = (s, el = document) => el.querySelector(s);

  // ---------- Media: real image or almond-green placeholder ----------
  function media(src, title, sub, i) {
    if (src) return `<img src="${src}" alt="${title}" loading="lazy" draggable="false" data-ph="${i % 6}" />`;
    return `<div class="placeholder pg-${i % 6}"><div>${title}<small>${sub}</small></div></div>`;
  }

  // Missing image file → show a placeholder instead of a broken icon
  document.addEventListener("error", (e) => {
    const img = e.target;
    if (img.tagName !== "IMG") return;
    const ph = document.createElement("div");
    ph.className = `placeholder pg-${img.dataset.ph || 0}`;
    ph.innerHTML = `<div>Image à ajouter<small>${img.getAttribute("src")}</small></div>`;
    img.replaceWith(ph);
  }, true);

  // ---------- Lightbox (works on a list of items) ----------
  const lb = $("#lightbox"), stage = $(".lightbox__stage", lb), caption = $(".lightbox__caption", lb);
  let lbItems = [], lbIndex = 0;
  const ratios = { miniatures: "16 / 9", carrousels: "4 / 5", affiches: "9 / 16" };

  function lbShow(i) {
    lbIndex = (i + lbItems.length) % lbItems.length;
    const it = lbItems[lbIndex];
    stage.innerHTML = it.html;
    const ph = $(".placeholder", stage);
    if (ph) { ph.style.aspectRatio = it.ratio; ph.style.height = it.ratio === "16 / 9" ? "auto" : "70vh"; ph.style.width = it.ratio === "16 / 9" ? "min(90vw, 900px)" : "auto"; }
    caption.textContent = `${it.caption}  ·  ${lbIndex + 1}/${lbItems.length}`;
  }
  function lbOpen(items, i) { lbItems = items; lbShow(i); lb.classList.add("is-open"); lb.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
  function lbClose() { lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
  $(".lightbox__close", lb).onclick = lbClose;
  $(".lightbox__prev", lb).onclick = () => lbShow(lbIndex - 1);
  $(".lightbox__next", lb).onclick = () => lbShow(lbIndex + 1);
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target === stage) lbClose(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") lbClose();
    if (e.key === "ArrowLeft") lbShow(lbIndex - 1);
    if (e.key === "ArrowRight") lbShow(lbIndex + 1);
  });

  // ---------- Coverflow 3D ----------
  function coverflow(root, items, onOpen) {
    if (!items.length) return;
    root.innerHTML = `
      <div class="coverflow__stage">${items.map((it, i) => `<div class="cf-item" data-i="${i}">${it.badge ? `<span class="cf-badge">${it.badge}</span>` : ""}${it.html}</div>`).join("")}</div>
      <div class="coverflow__nav">
        <button class="arrow" data-d="-1" aria-label="Précédent">←</button>
        <span class="coverflow__count"></span>
        <span class="coverflow__dots">${items.map(() => "<i></i>").join("")}</span>
        <button class="arrow" data-d="1" aria-label="Suivant">→</button>
      </div>`;
    const els = [...root.querySelectorAll(".cf-item")], dots = [...root.querySelectorAll(".coverflow__dots i")];
    const count = $(".coverflow__count", root);
    let cur = 0;

    function render() {
      els.forEach((el, i) => {
        let o = i - cur;
        const n = els.length; // wrap so neighbours exist on both sides
        if (o > n / 2) o -= n; if (o < -n / 2) o += n;
        const a = Math.abs(o);
        el.style.transform = `translateX(${o * 42}%) translateZ(${-a * 160}px) rotateY(${-Math.sign(o) * Math.min(a, 1) * 40}deg)`;
        el.style.zIndex = 10 - a;
        el.style.opacity = a > 1 ? 0 : 1 - a * .15;
        el.style.pointerEvents = a > 1 ? "none" : "";
        el.style.filter = a ? `brightness(${1 - a * .12}) saturate(${1 - a * .2})` : "none";
        el.classList.toggle("is-active", a === 0);
      });
      dots.forEach((d, i) => d.classList.toggle("is-active", i === cur));
      count.textContent = `${String(cur + 1).padStart(2, "0")} / ${String(els.length).padStart(2, "0")}`;
    }
    const go = (i) => { cur = (i + els.length) % els.length; render(); };

    root.addEventListener("click", (e) => {
      const b = e.target.closest("[data-d]");
      if (b) return go(cur + Number(b.dataset.d));
      const it = e.target.closest(".cf-item");
      if (!it || moved) return;
      const i = Number(it.dataset.i);
      i === cur ? onOpen(i) : go(i);
    });

    // swipe / drag
    let x0 = null, moved = false;
    root.addEventListener("pointerdown", (e) => { x0 = e.clientX; moved = false; });
    window.addEventListener("pointerup", (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) { moved = true; go(cur + (dx < 0 ? 1 : -1)); setTimeout(() => (moved = false), 0); }
    });
    render();
  }

  // Miniatures
  const minis = P.miniatures || [];
  const miniItems = minis.map((m, i) => ({ html: media(m.src, m.title, m.client, i), caption: `${m.title} · ${m.client}`, ratio: ratios.miniatures }));
  coverflow($('[data-flow="miniatures"]'), miniItems, (i) => lbOpen(miniItems, i));

  // Carrousels: cover = first slide; opening shows every slide of that carrousel
  const caros = P.carrousels || [];
  const caroCovers = caros.map((c, i) => ({ html: media(c.slides[0], c.title, c.client, i + 1), badge: `${c.slides.length} slides` }));
  coverflow($('[data-flow="carrousels"]'), caroCovers, (i) => {
    const c = caros[i];
    lbOpen(c.slides.map((src, s) => ({
      html: media(src, s === 0 ? c.title : `Slide ${s + 1}`, c.client, i + 1 + s),
      caption: `${c.title} · ${c.client}`, ratio: ratios.carrousels,
    })), 0);
  });

  // Posts statiques
  const stats = P.statiques || [];
  const statItems = stats.map((m, i) => ({ html: media(m.src, m.title, m.client, i + 3), caption: `${m.title} · ${m.client}`, ratio: "4 / 5" }));
  coverflow($('[data-flow="statiques"]'), statItems, (i) => lbOpen(statItems, i));

  // Affiches
  const affs = P.affiches || [];
  const affItems = affs.map((a, i) => ({ html: media(a.src, a.title, a.client, i + 2), caption: `${a.title} · ${a.client}`, ratio: ratios.affiches }));
  coverflow($('[data-flow="affiches"]'), affItems, (i) => lbOpen(affItems, i));

  // ---------- Avant / Après (comparison slider) ----------
  const BA = P.avantApres || {}, ba = $("#ba");
  if (ba) {
    const viewer = $(".ba__viewer", ba), before = $(".ba__before", ba), after = $(".ba__after", ba);
    const range = $(".ba__range", ba), handle = $(".ba__handle", ba), thumbs = $(".ba__thumbs", ba);
    const baRatio = { miniatures: "16 / 9", affiches: "707 / 1000" };
    const beforePh = (t, c) => `<div class="placeholder ph-before"><div>Avant<small>${t} · photo brute</small></div></div>`;
    let tab = "miniatures", idx = 0;

    const setPos = (v) => { viewer.style.setProperty("--pos", `${v}%`); };
    function load(i) {
      const list = BA[tab] || [];
      if (!list.length) return;
      idx = i;
      const it = list[i];
      before.innerHTML = it.avant ? media(it.avant, `${it.title}, avant`, "", 0) : beforePh(it.title, it.client);
      after.innerHTML = it.apres ? media(it.apres, `${it.title}, après`, "", 0) : media("", it.title, it.client, i + (tab === "affiches" ? 2 : 0));
      $(".ba__title", ba).textContent = it.title;
      $(".ba__client", ba).textContent = it.client;
      [...thumbs.children].forEach((t, k) => t.classList.toggle("is-active", k === i));
      range.value = 50; setPos(50);
    }
    function setTab(t) {
      tab = t;
      ba.dataset.tab = t;
      viewer.style.aspectRatio = baRatio[t];
      document.querySelectorAll("[data-ba-tab]").forEach((b) => b.classList.toggle("is-active", b.dataset.baTab === t));
      thumbs.hidden = (BA[t] || []).length < 2;
      thumbs.innerHTML = (BA[t] || []).map((it, i) =>
        `<button aria-label="${it.title}">${it.apres ? `<img src="${it.apres}" alt="" loading="lazy" />` : `<span class="placeholder pg-${(i + (t === "affiches" ? 2 : 0)) % 6}"></span>`}</button>`).join("");
      [...thumbs.children].forEach((b, i) => b.addEventListener("click", () => load(i)));
      load(0);
    }
    range.addEventListener("input", () => setPos(range.value));
    document.querySelectorAll("[data-ba-tab]").forEach((b) => b.addEventListener("click", () => setTab(b.dataset.baTab)));
    // only keep tabs that have at least one complete before/after pair
    for (const k of Object.keys(BA)) BA[k] = (BA[k] || []).filter((it) => it.avant && it.apres);
    const tabs = [...document.querySelectorAll("[data-ba-tab]")];
    tabs.forEach((b) => { b.hidden = !BA[b.dataset.baTab].length; });
    const available = tabs.filter((b) => !b.hidden).map((b) => b.dataset.baTab);
    $(".ba-tabs").hidden = available.length < 2;
    if (available.length) setTab(available[0]);
    else document.getElementById("avant-apres").hidden = true;

    // small hint animation the first time the slider is visible
    const hint = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      hint.disconnect();
      const s = performance.now();
      (function f(t) {
        const p = Math.min((t - s) / 1600, 1);
        const v = 50 + Math.sin(p * Math.PI * 2) * 18;
        range.value = v; setPos(v);
        if (p < 1) requestAnimationFrame(f);
      })(s);
    }, { threshold: 0.6 });
    hint.observe(viewer);
  }

  // ---------- Showreel (hero): cycles through the miniatures ----------
  const reel = $("#showreel");
  if (reel && minis.length) {
    const screen = $(".showreel__screen", reel), dotsEl = $(".showreel__dots", reel);
    screen.innerHTML = minis.map((m, i) => `<div>${media(m.src, m.title, m.client, i)}</div>`).join("");
    dotsEl.innerHTML = minis.map((_, i) => `<button aria-label="Visuel ${i + 1}"></button>`).join("");
    const slides = [...screen.children], btns = [...dotsEl.children];
    let r = 0, timer;
    const show = (i) => {
      r = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle("is-active", k === r));
      btns.forEach((b, k) => b.classList.toggle("is-active", k === r));
    };
    const play = () => { clearInterval(timer); timer = setInterval(() => show(r + 1), 3200); };
    btns.forEach((b, i) => b.addEventListener("click", () => { show(i); play(); }));
    screen.addEventListener("click", () => lbOpen(miniItems, r));
    screen.style.cursor = "zoom-in";
    show(0); play();
  }

  // ---------- Loader ----------
  const loader = $("#loader"), bar = $(".loader__bar span", loader), pct = $("#loader-pct");
  document.body.classList.add("is-loading");
  const t0 = performance.now(), dur = 1400;
  (function tick(t) {
    const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
    bar.style.transform = `scaleX(${e})`; pct.textContent = `${Math.round(e * 100)}%`;
    if (p < 1) return requestAnimationFrame(tick);
    setTimeout(finishLoading, 250);
  })(t0);
  // safety net: never leave the page hidden, even if animation frames are paused
  setTimeout(finishLoading, 2500);
  let loaded = false;
  function finishLoading() {
    if (loaded) return;
    loaded = true;
    loader.classList.add("is-done");
    document.body.classList.remove("is-loading");
    startReveal();
  }

  // ---------- Reveal on scroll + counters ----------
  function startReveal() {
    // safety net: show everything if the observer never fires
    setTimeout(() => document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible")), 2500);
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("is-visible"); io.unobserve(en.target);
      const c = en.target.matches("[data-count]") ? en.target : $("[data-count]", en.target);
      if (c) countUp(c);
    }), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 70}ms`; io.observe(el); });
  }
  function countUp(el) {
    const end = Number(el.dataset.count), suf = el.dataset.suffix || "", s = performance.now();
    (function f(t) {
      const p = Math.min((t - s) / 1400, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
      if (p < 1) requestAnimationFrame(f);
    })(s);
  }

  // FAQ: one open at a time
  document.querySelectorAll(".faq details").forEach((d) => d.addEventListener("toggle", () => {
    if (d.open) document.querySelectorAll(".faq details").forEach((o) => o !== d && (o.open = false));
  }));

  $("#year").textContent = new Date().getFullYear();
})();
