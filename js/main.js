/**
 * 陈若菁 · Sound Portfolio
 * Interaction layer: gate, acoustic field, cursor, filters, overlay, ambient, i18n
 */

(() => {
  "use strict";

  const I18N = window.CRJ_I18N;
  I18N.bindSwitcher();
  I18N.apply();

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = matchMedia("(hover: none), (pointer: coarse)").matches;

  const gate = document.getElementById("gate");
  const enterBtn = document.getElementById("enterBtn");
  const nav = document.getElementById("nav");
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");
  const cursor = document.getElementById("cursor");
  const field = document.getElementById("field");
  const scrollPath = document.getElementById("scrollPath");
  const overlay = document.getElementById("overlay");
  const overlayContent = document.getElementById("overlayContent");
  const ambientToggle = document.getElementById("ambientToggle");
  const yearEl = document.getElementById("year");

  let openProjectKey = null;

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  if (isTouch) document.body.classList.add("touch-device");
  document.body.classList.add("is-gated");

  // ---------- Gate ----------
  function enterSite() {
    gate.classList.add("is-exit");
    document.body.classList.remove("is-gated");
    document.body.classList.add("is-ready");
    setTimeout(() => {
      gate.setAttribute("aria-hidden", "true");
      gate.style.display = "none";
    }, 950);
    initReveals();
    if (!reducedMotion) startField();
  }

  function returnToGate() {
    closeOverlay();
    menuBtn?.classList.remove("is-open");
    mobileNav?.classList.remove("is-open");
    menuBtn?.setAttribute("aria-expanded", "false");

    const adPlayer = document.getElementById("adPlayer");
    if (adPlayer?.classList.contains("is-open")) {
      adPlayer.querySelector("[data-player-close]")?.click();
    }

    if (ambientOn && ambientNodes && audioCtx) {
      const now = audioCtx.currentTime;
      ambientNodes.master.gain.cancelScheduledValues(now);
      ambientNodes.master.gain.linearRampToValueAtTime(0, now + 0.6);
      ambientOn = false;
      ambientToggle?.classList.remove("is-on");
    }

    window.scrollTo(0, 0);
    gate.style.display = "";
    gate.removeAttribute("aria-hidden");
    void gate.offsetWidth;
    gate.classList.remove("is-exit");
    document.body.classList.add("is-gated");
    document.body.classList.remove("is-ready");
  }

  enterBtn?.addEventListener("click", enterSite);
  enterBtn?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      enterSite();
    }
  });
  document.getElementById("reenterGate")?.addEventListener("click", returnToGate);
  document.getElementById("reenterGateMobile")?.addEventListener("click", () => {
    returnToGate();
  });

  // ---------- Custom cursor ----------
  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const cursorPos = { x: mouse.x, y: mouse.y };

  if (!isTouch && cursor) {
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    document.addEventListener("mousedown", () => cursor.classList.add("is-down"));
    document.addEventListener("mouseup", () => cursor.classList.remove("is-down"));

    const hoverTargets = "a, button, .filter, .project__hit, [data-magnetic]";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverTargets)) cursor.classList.add("is-hover");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverTargets)) cursor.classList.remove("is-hover");
    });

    function tickCursor() {
      cursorPos.x += (mouse.x - cursorPos.x) * 0.18;
      cursorPos.y += (mouse.y - cursorPos.y) * 0.18;
      cursor.style.transform = `translate(${cursorPos.x}px, ${cursorPos.y}px)`;
      requestAnimationFrame(tickCursor);
    }
    tickCursor();
  }

  // ---------- Magnetic buttons ----------
  if (!isTouch && !reducedMotion) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  // ---------- Acoustic field ----------
  let fieldCtx;
  let ripples = [];
  let fieldRunning = false;

  function startField() {
    if (!field || fieldRunning) return;
    fieldRunning = true;
    fieldCtx = field.getContext("2d");
    resizeField();
    window.addEventListener("resize", resizeField);

    window.addEventListener("mousemove", (e) => {
      if (Math.random() > 0.72) {
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          r: 0,
          max: 40 + Math.random() * 80,
          alpha: 0.22,
        });
      }
    });

    setInterval(() => {
      if (document.hidden) return;
      ripples.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: 0,
        max: 60 + Math.random() * 120,
        alpha: 0.08,
      });
    }, 1800);

    requestAnimationFrame(drawField);
  }

  function resizeField() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    field.width = window.innerWidth * dpr;
    field.height = window.innerHeight * dpr;
    field.style.width = `${window.innerWidth}px`;
    field.style.height = `${window.innerHeight}px`;
    fieldCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawField() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    fieldCtx.clearRect(0, 0, w, h);

    const g = fieldCtx.createRadialGradient(
      mouse.x,
      mouse.y,
      0,
      mouse.x,
      mouse.y,
      Math.max(w, h) * 0.45
    );
    g.addColorStop(0, "rgba(126, 184, 178, 0.045)");
    g.addColorStop(0.45, "rgba(196, 165, 116, 0.02)");
    g.addColorStop(1, "transparent");
    fieldCtx.fillStyle = g;
    fieldCtx.fillRect(0, 0, w, h);

    ripples = ripples.filter((r) => r.alpha > 0.01);
    ripples.forEach((r) => {
      r.r += 1.4;
      r.alpha *= 0.975;
      fieldCtx.beginPath();
      fieldCtx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      fieldCtx.strokeStyle = `rgba(196, 165, 116, ${r.alpha})`;
      fieldCtx.lineWidth = 1;
      fieldCtx.stroke();
    });

    requestAnimationFrame(drawField);
  }

  // ---------- Scroll + nav ----------
  function onScroll() {
    const scrolled = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? scrolled / max : 0;

    if (scrollPath) {
      scrollPath.style.strokeDashoffset = String(100 - progress * 100);
      const amp = 2.2 * Math.sin(progress * Math.PI * 4);
      scrollPath.setAttribute("d", `M0 4 Q 25 ${4 - amp} 50 4 T 100 4`);
    }

    if (nav) nav.classList.toggle("is-solid", scrolled > 40);

    const sections = ["work", "contact"];
    let current = "";
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (el.getBoundingClientRect().top < window.innerHeight * 0.45) current = id;
    });
    document.querySelectorAll(".nav__links a").forEach((a) => {
      a.classList.toggle("is-active", a.dataset.section === current);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- Mobile nav ----------
  menuBtn?.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("is-open");
    menuBtn.classList.toggle("is-open", open);
    menuBtn.setAttribute(
      "aria-label",
      open ? I18N.t("nav.closeMenu") : I18N.t("nav.openMenu")
    );
  });

  mobileNav?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      mobileNav.classList.remove("is-open");
      menuBtn?.classList.remove("is-open");
    });
  });

  // ---------- Reveals ----------
  function initReveals() {
    const nodes = document.querySelectorAll("[data-reveal]");
    if (reducedMotion) {
      nodes.forEach((n) => n.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    nodes.forEach((n, i) => {
      n.style.transitionDelay = `${Math.min(i % 6, 5) * 0.06}s`;
      io.observe(n);
    });
  }

  // ---------- Wave canvases ----------
  function initWaveCanvases() {
    document.querySelectorAll(".wave-canvas").forEach((canvas, index) => {
      const ctx = canvas.getContext("2d");
      const seed = index * 17 + 3;
      let t = 0;
      let active = false;
      const parent = canvas.closest(".project");

      parent?.addEventListener("mouseenter", () => {
        active = true;
      });
      parent?.addEventListener("mouseleave", () => {
        active = false;
      });

      function draw() {
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        ctx.beginPath();
        const amp = active ? 28 : 12;
        const speed = active ? 0.085 : 0.035;
        t += speed;

        for (let x = 0; x <= w; x += 2) {
          const y =
            h / 2 +
            Math.sin(x * 0.035 + t + seed) * amp * Math.sin(x * 0.01 + seed) +
            Math.sin(x * 0.08 + t * 1.4) * (amp * 0.35);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = active
          ? "rgba(126, 184, 178, 0.85)"
          : "rgba(196, 165, 116, 0.55)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        requestAnimationFrame(draw);
      }
      draw();
    });
  }

  initWaveCanvases();

  const projects = document.querySelectorAll(".project");
  projects.forEach((p) => {
    p.style.maxHeight = `${p.scrollHeight}px`;
  });

  // ---------- Overlay ----------
  let overlayTab = "overview";
  let overlayPhotoCat = "all";
  let overlayReportId = null;
  let overlayDemoId = null;
  let overlayVideoEl = null;

  function projectMedia(key) {
    return (window.CRJ_PROJECT_MEDIA && window.CRJ_PROJECT_MEDIA[key]) || null;
  }

  function mediaLabel(obj) {
    if (!obj) return "";
    const L = I18N.getLang();
    return obj[L] || obj.zh || "";
  }

  function demoList(media) {
    if (!media) return [];
    if (media.videos?.length) return media.videos;
    if (media.video) {
      return [{ id: "main", title: { zh: "成片", en: "Film" }, src: media.video }];
    }
    return [];
  }

  function tabLabel(media, id, fallbackKey) {
    return mediaLabel(media?.tabLabels?.[id]) || I18N.t(fallbackKey);
  }

  function stopOverlayVideo() {
    overlayContent?.querySelectorAll("video.overlay__video").forEach((v) => {
      v.pause();
      v.removeAttribute("src");
      v.load();
    });
    overlayContent?.querySelectorAll("audio.overlay__audio").forEach((a) => {
      a.pause();
      a.removeAttribute("src");
      a.load();
    });
    overlayVideoEl = null;
  }

  function renderOverlay(key, opts = {}) {
    const data = I18N.getProject(key);
    if (!data || !overlayContent) return;
    const media = projectMedia(key);
    const demos = demoList(media);
    const hasMedia = !!(
      media &&
      (demos.length ||
        (media.reports && media.reports.length) ||
        (media.photos && media.photos.length) ||
        (media.links && media.links.length))
    );

    if (opts.resetTab || !hasMedia) overlayTab = "overview";
    if (opts.resetTab) {
      overlayPhotoCat = "all";
      overlayReportId = media?.reports?.[0]?.id || null;
      overlayDemoId = demos[0]?.id || null;
    }

    const filmLabel = tabLabel(media, "film", "overlay.tabFilm");
    const reportLabel = tabLabel(media, "report", "overlay.tabReport");

    const tabs = [
      { id: "overview", label: I18N.t("overlay.tabOverview"), show: true },
      { id: "film", label: filmLabel, show: demos.length > 0 },
      { id: "report", label: reportLabel, show: !!(media?.reports?.length) },
      { id: "photos", label: I18N.t("overlay.tabPhotos"), show: !!(media?.photos?.length) },
    ].filter((t) => t.show);

    if (!tabs.some((t) => t.id === overlayTab)) overlayTab = "overview";

    let pane = "";
    if (overlayTab === "overview") {
      const photoLabel = tabLabel(media, "photos", "overlay.tabPhotos");
      pane = `
        ${!hasMedia ? `<div class="overlay__placeholder">${I18N.t("overlay.preview")}</div>` : `
          <div class="overlay__quick">
            ${demos.length ? `<button type="button" class="btn btn--primary" data-overlay-tab="film">${filmLabel}</button>` : ""}
            ${media?.reports?.length ? `<button type="button" class="btn btn--ghost" data-overlay-tab="report">${reportLabel}</button>` : ""}
            ${media?.photos?.length ? `<button type="button" class="btn btn--ghost" data-overlay-tab="photos">${photoLabel}</button>` : ""}
          </div>
          ${
            media?.links?.length
              ? `<div class="overlay__links">
                  ${media.links
                    .map(
                      (l) => `
                    <a class="overlay__ext-link" href="${l.href}" target="_blank" rel="noopener noreferrer">
                      ${mediaLabel(l.title)}
                      <span aria-hidden="true">↗</span>
                    </a>`
                    )
                    .join("")}
                </div>`
              : ""
          }`}
        <p class="overlay__body">${data.body}</p>
        <ul class="overlay__list">
          ${data.points.map((pt) => `<li>${pt}</li>`).join("")}
        </ul>
        <div class="overlay__tags">
          ${data.tags.map((tag) => `<span>${tag}</span>`).join("")}
        </div>`;
    } else if (overlayTab === "film" && demos.length) {
      if (!overlayDemoId || !demos.some((d) => d.id === overlayDemoId)) {
        overlayDemoId = demos[0].id;
      }
      const activeDemo = demos.find((d) => d.id === overlayDemoId) || demos[0];
      const keyframes = activeDemo.keyframes
        || (activeDemo.keyframe ? [activeDemo.keyframe] : []);
      const stackItems = activeDemo.items?.length
        ? activeDemo.items
        : [
            {
              kind: activeDemo.kind,
              src: activeDemo.src,
              label: activeDemo.title,
              note: activeDemo.note,
              image: activeDemo.image,
            },
          ];

      const renderMediaItem = (item, idx) => {
        const isAudio =
          item.kind === "audio" ||
          /\.(wav|mp3|m4a|aac|ogg)$/i.test(item.src || "");
        const label = mediaLabel(item.label || item.title);
        const note = mediaLabel(item.note);
        const img = item.image;
        const videoId =
          !activeDemo.items && idx === 0 ? ' id="overlayVideo"' : "";
        return `
          <section class="overlay__demo-block">
            ${label ? `<h3 class="overlay__demo-block-title">${label}</h3>` : ""}
            ${
              isAudio
                ? `<div class="overlay__audio-wrap">
                    <audio class="overlay__audio" controls preload="metadata" src="${item.src}"></audio>
                    ${note ? `<p class="overlay__audio-note">${note}</p>` : ""}
                  </div>`
                : `<div class="overlay__video-wrap">
                    <video class="overlay__video"${videoId} controls playsinline preload="metadata" src="${item.src}"></video>
                  </div>`
            }
            ${
              img?.src
                ? `<button type="button" class="overlay__demo-shot" data-full="${img.src}" aria-label="${mediaLabel(img.caption)}">
                    <img src="${img.src}" alt="${mediaLabel(img.caption)}" loading="lazy" />
                    <span>${mediaLabel(img.caption)}</span>
                  </button>`
                : ""
            }
          </section>`;
      };

      pane = `
        ${
          demos.length > 1
            ? `<div class="overlay__report-nav" role="tablist">
                ${demos
                  .map(
                    (d) => `
                  <button type="button" class="overlay__report-nav-btn${
                    d.id === activeDemo.id ? " is-active" : ""
                  }" data-demo-id="${d.id}">
                    ${mediaLabel(d.title)}
                  </button>`
                  )
                  .join("")}
              </div>`
            : ""
        }
        <div class="overlay__demo-stack">
          ${stackItems.map((item, idx) => renderMediaItem(item, idx)).join("")}
        </div>
        ${
          keyframes.length
            ? `<div class="overlay__keyframes">
                ${keyframes
                  .map(
                    (kf) => `
                  <button type="button" class="overlay__keyframe" data-seek="${kf.time}" aria-label="${mediaLabel(kf.label)}">
                    <img src="${kf.src}" alt="${mediaLabel(kf.label)}" />
                    <span class="overlay__keyframe-meta">
                      <strong>${mediaLabel(kf.label)}</strong>
                      <em>${mediaLabel(kf.note)}</em>
                    </span>
                  </button>`
                  )
                  .join("")}
              </div>`
            : ""
        }
        ${
          activeDemo.build
            ? `<div class="overlay__build">
                <a class="btn btn--primary overlay__build-dl" href="${activeDemo.build.href}" download>
                  ${mediaLabel(activeDemo.build.label) || I18N.t("overlay.downloadBuild")}
                </a>
                <p class="overlay__build-note">${mediaLabel(activeDemo.build.note)}</p>
              </div>`
            : ""
        }
        <div class="overlay__lightbox" id="overlayLightbox" hidden>
          <button type="button" class="overlay__lightbox-close" data-lightbox-close aria-label="${I18N.t("overlay.close")}">×</button>
          <img src="" alt="" id="overlayLightboxImg" />
        </div>`;
    } else if (overlayTab === "report" && media?.reports?.length) {
      if (!overlayReportId) overlayReportId = media.reports[0].id;
      const active = media.reports.find((r) => r.id === overlayReportId) || media.reports[0];
      const paras = (active.paras || []).map((p) =>
        typeof p === "string" ? p : mediaLabel(p)
      );
      pane = `
        <div class="overlay__report-nav" role="tablist">
          ${media.reports
            .map(
              (r) => `
            <button type="button" class="overlay__report-nav-btn${r.id === active.id ? " is-active" : ""}" data-report-id="${r.id}">
              ${mediaLabel(r.title)}
            </button>`
            )
            .join("")}
        </div>
        <div class="overlay__report">
          <div class="overlay__report-head">
            <h3 class="overlay__report-title">${mediaLabel(active.title)}</h3>
            ${
              (() => {
                const file =
                  typeof active.file === "string"
                    ? active.file
                    : mediaLabel(active.file);
                return file
                  ? `<a class="overlay__report-dl" href="${file}" download>${I18N.t("overlay.download")}</a>`
                  : "";
              })()
            }
          </div>
          ${
            active.video
              ? `<div class="overlay__video-wrap">
                  <video class="overlay__video" id="overlayVideo" controls playsinline preload="metadata" src="${active.video}"></video>
                </div>`
              : ""
          }
          ${
            paras.length
              ? `<div class="overlay__report-body">
                  ${paras.map((p) => `<p>${p}</p>`).join("")}
                </div>`
              : ""
          }
          ${
            active.images?.length
              ? `<div class="overlay__gallery overlay__gallery--docs">
                  ${active.images
                    .map(
                      (img) => `
                    <button type="button" class="overlay__shot overlay__shot--doc" data-full="${img.src}" aria-label="${mediaLabel(img.caption)}">
                      <img src="${img.src}" alt="${mediaLabel(img.caption)}" loading="lazy" />
                      <span>${mediaLabel(img.caption)}</span>
                    </button>`
                    )
                    .join("")}
                </div>
                <div class="overlay__lightbox" id="overlayLightbox" hidden>
                  <button type="button" class="overlay__lightbox-close" data-lightbox-close aria-label="${I18N.t("overlay.close")}">×</button>
                  <img src="" alt="" id="overlayLightboxImg" />
                </div>`
              : ""
          }
        </div>`;
    } else if (overlayTab === "photos" && media?.photos?.length) {
      const cats = ["all", ...new Set(media.photos.map((p) => p.cat))];
      const showCats = cats.length > 2;
      const filtered =
        !showCats || overlayPhotoCat === "all"
          ? media.photos
          : media.photos.filter((p) => p.cat === overlayPhotoCat);
      pane = `
        ${
          showCats
            ? `<div class="overlay__photo-cats">
                ${cats
                  .map((c) => {
                    const label =
                      c === "all"
                        ? I18N.t("overlay.photoAll")
                        : mediaLabel(media.photoCats?.[c]) || c;
                    return `<button type="button" class="overlay__photo-cat${
                      c === overlayPhotoCat ? " is-active" : ""
                    }" data-photo-cat="${c}">${label}</button>`;
                  })
                  .join("")}
              </div>`
            : ""
        }
        <div class="overlay__gallery">
          ${filtered
            .map(
              (p) => `
            <button type="button" class="overlay__shot" data-full="${p.src}" aria-label="${mediaLabel(p.caption)}">
              <img src="${p.src}" alt="${mediaLabel(p.caption)}" loading="lazy" />
              <span>${mediaLabel(p.caption)}</span>
            </button>`
            )
            .join("")}
        </div>
        <div class="overlay__lightbox" id="overlayLightbox" hidden>
          <button type="button" class="overlay__lightbox-close" data-lightbox-close aria-label="${I18N.t("overlay.close")}">×</button>
          <img src="" alt="" id="overlayLightboxImg" />
        </div>`;
    } else {
      pane = `<p class="overlay__body">${I18N.t("overlay.noMedia")}</p>`;
    }

    overlayContent.innerHTML = `
      <p class="overlay__kicker">${data.kicker}</p>
      <h2 class="overlay__title" id="overlayTitle">${data.title}</h2>
      <p class="overlay__role">${data.role}</p>
      ${
        tabs.length > 1
          ? `<div class="overlay__tabs" role="tablist">
              ${tabs
                .map(
                  (t) => `
                <button type="button" role="tab" class="overlay__tab${
                  t.id === overlayTab ? " is-active" : ""
                }" data-overlay-tab="${t.id}" aria-selected="${t.id === overlayTab}">
                  ${t.label}
                </button>`
                )
                .join("")}
            </div>`
          : ""
      }
      <div class="overlay__pane" data-pane="${overlayTab}">${pane}</div>
    `;

    overlay?.classList.toggle("has-media", hasMedia);
    overlayVideoEl = overlayContent.querySelector("#overlayVideo");

    overlayContent.querySelectorAll("[data-overlay-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        stopOverlayVideo();
        const next = btn.getAttribute("data-overlay-tab");
        if (next === "photos") overlayPhotoCat = "all";
        overlayTab = next;
        renderOverlay(key);
      });
    });
    overlayContent.querySelectorAll("[data-demo-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        stopOverlayVideo();
        overlayDemoId = btn.getAttribute("data-demo-id");
        renderOverlay(key);
      });
    });
    overlayContent.querySelectorAll("[data-seek]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const t = Number(btn.getAttribute("data-seek"));
        const video = overlayContent.querySelector("#overlayVideo");
        if (!video || !Number.isFinite(t)) return;
        const seek = () => {
          video.currentTime = t;
          video.play().catch(() => {});
        };
        if (video.readyState >= 1) seek();
        else video.addEventListener("loadedmetadata", seek, { once: true });
      });
    });
    overlayContent.querySelectorAll("[data-report-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        stopOverlayVideo();
        overlayReportId = btn.getAttribute("data-report-id");
        renderOverlay(key);
      });
    });
    overlayContent.querySelectorAll("[data-photo-cat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        overlayPhotoCat = btn.getAttribute("data-photo-cat");
        renderOverlay(key);
      });
    });
    const lightbox = overlayContent.querySelector("#overlayLightbox");
    const lightboxImg = overlayContent.querySelector("#overlayLightboxImg");
    overlayContent.querySelectorAll("[data-full]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = btn.getAttribute("data-full");
        lightboxImg.alt = btn.getAttribute("aria-label") || "";
        lightbox.hidden = false;
      });
    });
    overlayContent.querySelectorAll("[data-lightbox-close]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (lightbox) lightbox.hidden = true;
        if (lightboxImg) lightboxImg.removeAttribute("src");
      });
    });
    lightbox?.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.hidden = true;
        lightboxImg?.removeAttribute("src");
      }
    });
  }

  function openOverlay(key) {
    openProjectKey = key;
    stopOverlayVideo();
    renderOverlay(key, { resetTab: true });
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    overlay.querySelector(".overlay__close")?.focus();
  }

  function closeOverlay() {
    stopOverlayVideo();
    openProjectKey = null;
    overlayTab = "overview";
    overlay?.classList.remove("is-open");
    overlay?.classList.remove("has-media");
    overlay?.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  document.querySelectorAll(".project").forEach((p) => {
    p.querySelector(".project__hit")?.addEventListener("click", () => {
      openOverlay(p.dataset.project);
    });
  });

  overlay?.querySelectorAll("[data-close]").forEach((el) => {
    el.addEventListener("click", closeOverlay);
  });

  // Escape: player first, then page lightbox, then overlay lightbox, then project overlay
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const adPlayer = document.getElementById("adPlayer");
    if (adPlayer?.classList.contains("is-open")) return; // commercial.js handles
    const pageLightbox = document.getElementById("pageLightbox");
    if (pageLightbox && !pageLightbox.hidden) {
      pageLightbox.hidden = true;
      document.getElementById("pageLightboxImg")?.removeAttribute("src");
      return;
    }
    const lightbox = overlayContent?.querySelector("#overlayLightbox");
    if (lightbox && !lightbox.hidden) {
      lightbox.hidden = true;
      overlayContent.querySelector("#overlayLightboxImg")?.removeAttribute("src");
      return;
    }
    closeOverlay();
  });

  // ---------- Commercial archive fold ----------
  document.querySelectorAll("[data-archive-fold]").forEach((fold) => {
    const btn = fold.querySelector(".archive-fold__toggle");
    const panel = fold.querySelector(".archive-fold__panel");
    const label = fold.querySelector("[data-fold-label]");
    if (!btn || !panel) return;
    btn.addEventListener("click", () => {
      const open = fold.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      panel.hidden = !open;
      if (label) {
        label.textContent = open
          ? I18N.t("commercial.archiveCollapse")
          : I18N.t("commercial.archiveExpand");
      }
    });
  });

  // ---------- Spatial blocks B / C / D body fold ----------
  document.querySelectorAll("[data-spatial-block-fold]").forEach((fold) => {
    const btn = fold.querySelector("[data-spatial-block-toggle]");
    const panel = fold.querySelector("[data-spatial-block-panel]");
    const label = fold.querySelector("[data-fold-label]");
    if (!btn || !panel) return;

    function setOpen(open) {
      fold.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      panel.hidden = !open;
      if (label) {
        label.textContent = I18N.t(open ? "spatial.blockCollapse" : "spatial.blockExpand");
      }
      if (!open) {
        panel.querySelectorAll("video, audio").forEach((media) => {
          try {
            media.pause();
          } catch (_) {}
        });
        panel.querySelectorAll("iframe[data-src]").forEach((frame) => {
          frame.src = "about:blank";
        });
      }
    }

    btn.addEventListener("click", () => setOpen(!fold.classList.contains("is-open")));
    window.addEventListener("crj:langchange", () => {
      setOpen(fold.classList.contains("is-open"));
    });
  });

  // ---------- Commercial ad role list fold ----------
  document.querySelectorAll("[data-ad-role-fold]").forEach((fold) => {
    const btn = fold.querySelector("[data-ad-role-toggle]");
    const panel = fold.querySelector("[data-ad-role-panel]");
    const label = fold.querySelector("[data-fold-label]");
    if (!btn || !panel) return;

    function setOpen(open) {
      fold.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      panel.hidden = !open;
      if (label) {
        label.textContent = I18N.t(open ? "commercial.listCollapse" : "commercial.listExpand");
      }
    }

    btn.addEventListener("click", () => setOpen(!fold.classList.contains("is-open")));
    window.addEventListener("crj:langchange", () => {
      setOpen(fold.classList.contains("is-open"));
    });
  });

  // ---------- Spatial Block D project fold ----------
  document.querySelectorAll("[data-spatial-fold]").forEach((fold) => {
    const btn = fold.querySelector("[data-spatial-fold-toggle]");
    const panel = fold.querySelector("[data-spatial-fold-panel]");
    const label = fold.querySelector("[data-fold-label]");
    if (!btn || !panel) return;

    const expandKey =
      btn.querySelector("[data-i18n]")?.getAttribute("data-i18n") ||
      "spatial.blockD.expand";
    const collapseKey =
      expandKey === "spatial.blockD.expandMedia"
        ? "spatial.blockD.collapseMedia"
        : "spatial.blockD.collapse";

    function setOpen(open) {
      fold.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      panel.hidden = !open;
      if (label) label.textContent = I18N.t(open ? collapseKey : expandKey);

      panel.querySelectorAll("iframe[data-src]").forEach((frame) => {
        if (open) {
          if (!frame.getAttribute("src") || frame.getAttribute("src") === "about:blank") {
            frame.src = frame.getAttribute("data-src");
          }
        } else {
          frame.src = "about:blank";
        }
      });

      if (!open) {
        panel.querySelectorAll("video, audio").forEach((media) => {
          try {
            media.pause();
          } catch (_) {}
        });
      }
    }

    btn.addEventListener("click", () => setOpen(!fold.classList.contains("is-open")));
    window.addEventListener("crj:langchange", () => {
      setOpen(fold.classList.contains("is-open"));
    });
  });

  // ---------- Page archive lightbox (commercial work photos) ----------
  const pageLightbox = document.getElementById("pageLightbox");
  const pageLightboxImg = document.getElementById("pageLightboxImg");
  function closePageLightbox() {
    if (!pageLightbox) return;
    pageLightbox.hidden = true;
    pageLightboxImg?.removeAttribute("src");
  }
  document.querySelectorAll(".archive-shot[data-full]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!pageLightbox || !pageLightboxImg) return;
      pageLightboxImg.src = btn.getAttribute("data-full");
      pageLightboxImg.alt = btn.getAttribute("aria-label") || "";
      pageLightbox.hidden = false;
    });
  });
  document.querySelectorAll("[data-page-lightbox-close]").forEach((btn) => {
    btn.addEventListener("click", closePageLightbox);
  });
  pageLightbox?.addEventListener("click", (e) => {
    if (e.target === pageLightbox) closePageLightbox();
  });

  window.addEventListener("crj:langchange", () => {
    if (openProjectKey) renderOverlay(openProjectKey);
  });

  // ---------- Ambient tone ----------
  let audioCtx = null;
  let ambientNodes = null;
  let ambientOn = false;

  function createAmbient() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const master = audioCtx.createGain();
    master.gain.value = 0;
    master.connect(audioCtx.destination);

    const oscA = audioCtx.createOscillator();
    const oscB = audioCtx.createOscillator();
    const filterNode = audioCtx.createBiquadFilter();
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();

    oscA.type = "sine";
    oscB.type = "sine";
    oscA.frequency.value = 110;
    oscB.frequency.value = 164.81;

    filterNode.type = "lowpass";
    filterNode.frequency.value = 420;
    filterNode.Q.value = 0.7;

    lfo.type = "sine";
    lfo.frequency.value = 0.07;
    lfoGain.gain.value = 80;
    lfo.connect(lfoGain);
    lfoGain.connect(filterNode.frequency);

    const gainA = audioCtx.createGain();
    const gainB = audioCtx.createGain();
    gainA.gain.value = 0.04;
    gainB.gain.value = 0.025;

    oscA.connect(gainA);
    oscB.connect(gainB);
    gainA.connect(filterNode);
    gainB.connect(filterNode);
    filterNode.connect(master);

    oscA.start();
    oscB.start();
    lfo.start();

    return { master, oscA, oscB, lfo };
  }

  ambientToggle?.addEventListener("click", async () => {
    if (!audioCtx) ambientNodes = createAmbient();
    if (audioCtx.state === "suspended") await audioCtx.resume();

    ambientOn = !ambientOn;
    ambientToggle.classList.toggle("is-on", ambientOn);
    const now = audioCtx.currentTime;
    ambientNodes.master.gain.cancelScheduledValues(now);
    ambientNodes.master.gain.linearRampToValueAtTime(ambientOn ? 1 : 0, now + 1.2);
  });

  window.addEventListener("resize", () => {
    projects.forEach((p) => {
      p.style.maxHeight = `${p.scrollHeight}px`;
    });
  });
})();
