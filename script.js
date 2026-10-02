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

  // Miniatures
  const minis = P.miniatures || [];
  const miniItems = minis.map((m, i) => ({ html: media(m.src, m.title, m.client, i), caption: `${m.title} · ${m.client}`, ratio: ratios.miniatures }));
  // ---------- Big framed slider (reused for miniatures, carrousels, statiques) ----------
  // items: [{ src, title, client }] · opts: { ratio, label, thumbs, caption(i), onOpen(i) }
  function makeSlider(root, items, opts = {}) {
    if (!root || !items.length) return;
    const label = opts.label || "Visuel";
    root.classList.add("mini-slider");
    root.style.setProperty("--ratio", opts.ratio || "16 / 9");
    root.innerHTML = `
      <div class="mini-slider__frame">
        <div class="mini-slider__screen">${items.map((m, i) => `<div class="mini-slider__slide">${media(m.src, m.title, m.client, i)}</div>`).join("")}</div>
        ${items.length > 1 ? `
        <button class="mini-slider__arrow mini-slider__arrow--prev" aria-label="${label} précédent">←</button>
        <button class="mini-slider__arrow mini-slider__arrow--next" aria-label="${label} suivant">→</button>
        <div class="mini-slider__dots">${items.map((_, i) => `<button aria-label="${label} ${i + 1}"></button>`).join("")}</div>` : ""}
      </div>
      <div class="mini-slider__caption"><b></b><span></span></div>
      ${opts.thumbs === false ? "" : `<div class="mini-slider__thumbs">${items.map((m, i) => `<button aria-label="${m.title}">${media(m.src, m.title, m.client, i)}</button>`).join("")}</div>`}`;
    const slides = [...root.querySelectorAll(".mini-slider__slide")];
    const dots = [...root.querySelectorAll(".mini-slider__dots button")];
    const thumbs = [...root.querySelectorAll(".mini-slider__thumbs button")];
    let cur = 0;
    const show = (i) => {
      cur = (i + items.length) % items.length;
      slides.forEach((el, k) => el.classList.toggle("is-active", k === cur));
      dots.forEach((el, k) => el.classList.toggle("is-active", k === cur));
      thumbs.forEach((el, k) => el.classList.toggle("is-active", k === cur));
      const [title, sub] = opts.caption ? opts.caption(cur) : [items[cur].title, items[cur].client];
      $(".mini-slider__caption b", root).textContent = title;
      $(".mini-slider__caption span", root).textContent = `${sub} · ${String(cur + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
      const t = thumbs[cur];
      if (t) t.parentElement.scrollTo({ left: t.offsetLeft - t.parentElement.clientWidth / 2 + t.clientWidth / 2, behavior: "smooth" });
    };
    const prev = $(".mini-slider__arrow--prev", root), next = $(".mini-slider__arrow--next", root);
    if (prev) prev.onclick = () => show(cur - 1);
    if (next) next.onclick = () => show(cur + 1);
    dots.forEach((d, i) => (d.onclick = () => show(i)));
    thumbs.forEach((t, i) => (t.onclick = () => show(i)));
    const screen = $(".mini-slider__screen", root);
    if (opts.onOpen) screen.addEventListener("click", () => opts.onOpen(cur));
    let x0 = null; // swipe on touch screens
    screen.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    screen.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) show(cur + (dx < 0 ? 1 : -1));
    });
    show(0);
  }

  // Miniatures : big 16:9 slider with thumbnail strip
  makeSlider($('[data-slider="miniatures"]'), minis, { ratio: "16 / 9", label: "Miniature", onOpen: (i) => lbOpen(miniItems, i) });

  // Carrousels : Instagram-size 4:5 slider of the selected carrousel + carrousel picker
  const caros = P.carrousels || [];
  const caroWrap = $('[data-caro]');
  if (caroWrap && caros.length) {
    caroWrap.innerHTML = `<div class="caro-slider"></div>
      <div class="caro-picker">${caros.map((c, i) => `<button aria-label="${c.title}">${media(c.slides[0], c.title, c.client, i + 1)}<span>${c.slides.length} slides</span></button>`).join("")}</div>`;
    const picks = [...caroWrap.querySelectorAll(".caro-picker button")];
    const pick = (ci) => {
      const c = caros[ci];
      const items = c.slides.map((src, s) => ({ src, title: c.title, client: c.client }));
      const lbItems = items.map((it, s) => ({ html: media(it.src, it.title, it.client, s), caption: `${c.title} · ${c.client}`, ratio: ratios.carrousels }));
      makeSlider($(".caro-slider", caroWrap), items, {
        ratio: "4 / 5", label: "Slide", thumbs: false,
        caption: (s) => [c.title, `Slide`],
        onOpen: (s) => lbOpen(lbItems, s),
      });
      picks.forEach((b, k) => b.classList.toggle("is-active", k === ci));
    };
    picks.forEach((b, i) => (b.onclick = () => pick(i)));
    pick(0);
  }

  // Posts statiques : Instagram-size 4:5 slider
  const stats = P.statiques || [];
  const statItems = stats.map((m, i) => ({ html: media(m.src, m.title, m.client, i + 3), caption: `${m.title} · ${m.client}`, ratio: "4 / 5" }));
  makeSlider($('[data-slider="statiques"]'), stats, { ratio: "4 / 5", label: "Post", onOpen: (i) => lbOpen(statItems, i) });

  // Affiches
  const affs = P.affiches || [];
  const affItems = affs.map((a, i) => ({ html: media(a.src, a.title, a.client, i + 2), caption: `${a.title} · ${a.client}`, ratio: ratios.affiches }));
  makeSlider($('[data-slider="affiches"]'), affs, { ratio: "9 / 16", label: "Affiche", onOpen: (i) => lbOpen(affItems, i) });

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
