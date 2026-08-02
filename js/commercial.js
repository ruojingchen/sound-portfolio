/**
 * Commercial archive
 * - Automotive spotlight (featured)
 * - Mouse-scrub fan: left = newest, right = earlier
 */
window.CRJ_ADS = (() => {
  /** Bump when media/player changes so browsers skip stale caches */
  const ASSET_VER = "20260728";
  const withVer = (path) =>
    path.includes("?") ? `${path}&v=${ASSET_VER}` : `${path}?v=${ASSET_VER}`;

  const DEFAULT_ROLE = {
    zh: "声音设计 / 混音师",
    en: "Sound Design / Mixing Engineer",
  };

  /** Delivery formats shown on cards / meta */
  const FORMAT = {
    tvc: { zh: "TVC", en: "TVC" },
    promo: { zh: "宣传片", en: "Promo Film" },
    vertical: { zh: "竖屏平台投放", en: "Vertical / Short-form" },
  };

  // Newest → oldest (fan scrub order)
  const ADS = [
    {
      id: "honor-magic-v-flip2",
      year: 2025,
      kind: "tech",
      format: "tvc",
      title: { zh: "HONOR Magic V Flip2", en: "HONOR Magic V Flip2" },
      role: { zh: "监制助理 / 翻译", en: "Production Assistant / Translator" },
      video: "assets/commercial/videos/honor-magic-v-flip2.mp4",
      poster: "assets/commercial/posters/honor-magic-v-flip2.png",
    },
    {
      id: "rokid-forest",
      year: 2025,
      kind: "tech",
      format: "tvc",
      title: { zh: "ROKID 乐奇｜看见，同一片森林", en: "ROKID · One Forest" },
      role: { zh: "混音师 / 监制", en: "Mixing Engineer / Supervisor" },
      video: "assets/commercial/videos/rokid-forest.mp4",
      poster: "assets/commercial/posters/rokid-forest.png",
    },
    {
      id: "lynk-harman",
      year: 2025,
      kind: "auto",
      format: "tvc",
      title: {
        zh: "领克 900 × Harman Kardon",
        en: "Lynk & Co 900 × Harman Kardon",
      },
      role: DEFAULT_ROLE,
      blurb: {
        zh: "全球首搭哈曼卡顿 31 扬 · 声音成为座舱体验的一部分",
        en: "First Harman Kardon 31-speaker system — sound as cabin experience",
      },
      video: "assets/commercial/videos/lynk-harman.mp4",
      poster: "assets/commercial/posters/lynk-harman.png",
    },
    {
      id: "deepal",
      year: 2025,
      kind: "auto",
      format: "promo",
      title: {
        zh: "深蓝汽车 DEEPAL｜陪你走遍英雄之路",
        en: "Deepal · Hero’s Road",
      },
      role: DEFAULT_ROLE,
      blurb: {
        zh: "汽车宣传片 · 公路叙事与动力质感同频",
        en: "Automotive promo — road narrative and power texture in sync",
      },
      video: "assets/commercial/videos/deepal.mp4",
      poster: "assets/commercial/posters/deepal.png",
    },
    {
      id: "fliggy-hk",
      year: 2025,
      kind: "brand",
      format: "promo",
      title: {
        zh: "飞猪 × 香港旅发局《跟着曾比特游香港》",
        en: "Fliggy × HKTB · Tour with Ian Chan",
      },
      role: DEFAULT_ROLE,
      video: "assets/commercial/videos/fliggy-hk.mp4",
      poster: "assets/commercial/posters/fliggy-hk.png",
    },
    {
      id: "mercedes-songjia",
      year: 2025,
      kind: "auto",
      format: "tvc",
      title: {
        zh: "梅赛德斯-奔驰 S-Class × 宋佳",
        en: "Mercedes-Benz S-Class × Song Jia",
      },
      role: { zh: "监制助理", en: "Production Assistant" },
      blurb: {
        zh: "A 棚监制协作 · 高端汽车 TVC 的节奏与质感把控",
        en: "Stage A production support — pacing and polish for luxury automotive TVC",
      },
      video: "assets/commercial/videos/mercedes-songjia.mp4",
      poster: "assets/commercial/posters/mercedes-songjia.png",
    },
    {
      id: "xiaohongshu-dinner",
      year: 2021,
      kind: "brand",
      format: "promo",
      title: {
        zh: "小红书新年总结｜为爱的人，做顿饭。",
        en: "Xiaohongshu New Year Promo · Cook for Someone You Love",
      },
      role: DEFAULT_ROLE,
      video: "assets/commercial/videos/xiaohongshu-dinner.mp4",
      poster: "assets/commercial/posters/xiaohongshu-dinner.png",
    },
    {
      id: "adidas-heshuijing",
      year: 2021,
      kind: "brand",
      format: "vertical",
      title: {
        zh: "adidas 跑出蔚蓝 × 何水晶",
        en: "adidas Run Blue × He Shuijing",
      },
      role: DEFAULT_ROLE,
      video: "assets/commercial/videos/adidas-heshuijing.mp4",
      poster: "assets/commercial/posters/adidas-heshuijing.png",
    },
    {
      id: "adidas-duoduo",
      year: 2021,
      kind: "brand",
      format: "vertical",
      title: {
        zh: "adidas 跑出蔚蓝 × 多多神犬",
        en: "adidas Run Blue × Duoduo",
      },
      role: DEFAULT_ROLE,
      video: "assets/commercial/videos/adidas-duoduo.mp4",
      poster: "assets/commercial/posters/adidas-duoduo.png",
    },
    {
      id: "tencent-fps",
      year: 2021,
      kind: "brand",
      format: "vertical",
      title: { zh: "腾讯游戏云 · FPS 篇", en: "Tencent Game Cloud · FPS" },
      role: DEFAULT_ROLE,
      video: "assets/commercial/videos/tencent-fps.mp4",
      poster: "assets/commercial/posters/tencent-fps.png",
    },
    {
      id: "tencent-fight",
      year: 2021,
      kind: "brand",
      format: "vertical",
      title: { zh: "腾讯游戏云 · 格斗篇", en: "Tencent Game Cloud · Fighting" },
      role: DEFAULT_ROLE,
      video: "assets/commercial/videos/tencent-fight.mp4",
      poster: "assets/commercial/posters/tencent-fight.png",
    },
    {
      id: "zhongxuegao-office",
      year: 2021,
      kind: "brand",
      format: "vertical",
      title: { zh: "钟薛高 · 办公室篇", en: "Zhongxuegao · Office" },
      role: DEFAULT_ROLE,
      video: "assets/commercial/videos/zhongxuegao-office.mp4",
      poster: "assets/commercial/posters/zhongxuegao-office.png",
    },
    {
      id: "zhongxuegao-beijing",
      year: 2021,
      kind: "brand",
      format: "vertical",
      title: { zh: "钟薛高 · 老北京篇", en: "Zhongxuegao · Old Beijing" },
      role: DEFAULT_ROLE,
      video: "assets/commercial/videos/zhongxuegao-beijing.mp4",
      poster: "assets/commercial/posters/zhongxuegao-beijing.png",
    },
    {
      id: "chevrolet-anger",
      year: 2021,
      kind: "auto",
      format: "tvc",
      title: {
        zh: "雪佛兰特工座驾 · 愤怒篇",
        en: "Chevrolet · Anger",
      },
      role: { zh: "同期录音师", en: "Production Sound Mixer" },
      blurb: {
        zh: "广告 TVC · 同期录音捕捉车辆与情绪质感",
        en: "Automotive TVC — production sound capturing vehicle and emotion",
      },
      video: "assets/commercial/videos/chevrolet-anger.mp4",
      poster: "assets/commercial/posters/chevrolet-anger.png",
    },
  ];

  const AUTO_IDS = ["lynk-harman", "deepal", "mercedes-songjia", "chevrolet-anger"];

  function lang() {
    return (window.CRJ_I18N && window.CRJ_I18N.getLang()) || "zh";
  }

  function label(obj) {
    if (!obj) return "";
    const L = lang();
    return obj[L] || obj.zh || "";
  }

  function formatLabel(ad) {
    if (!ad?.format || !FORMAT[ad.format]) return "";
    return label(FORMAT[ad.format]);
  }

  /** Title with format after the name — plain text, no badge */
  function titleWithFormat(ad) {
    const title = label(ad.title);
    const fmt = formatLabel(ad);
    if (!fmt) return title;
    return `${title}<span class="ad-format"> · ${fmt}</span>`;
  }

  let cards = [];
  let cursor = 0; // continuous float index
  let target = 0;
  let scrubbing = false;
  let rafId = 0;

  const stage = document.getElementById("fanStage");
  const deck = document.getElementById("fanDeck");
  const yearEl = document.getElementById("fanYear");
  const titleEl = document.getElementById("fanTitle");
  const metaEl = document.getElementById("fanMeta");
  const playBtn = document.getElementById("fanPlay");
  const prevBtn = document.getElementById("fanPrev");
  const nextBtn = document.getElementById("fanNext");
  const marksEl = document.getElementById("adTimelineMarks");
  const dotsEl = document.getElementById("adTimelineDots");
  const progressEl = document.getElementById("adTimelineProgress");
  const listEl = document.getElementById("adRoleList");
  const autoRail = document.getElementById("autoRail");
  const zoneLeft = document.getElementById("fanZoneLeft");
  const zoneRight = document.getElementById("fanZoneRight");
  const player = document.getElementById("adPlayer");
  const playerVideo = document.getElementById("playerVideo");
  const playerTitle = document.getElementById("playerTitle");
  const playerYear = document.getElementById("playerYear");
  const playerRole = document.getElementById("playerRole");

  if (!deck) return { ADS };

  function activeIndex() {
    return Math.round(cursor);
  }

  function buildAutoRail() {
    if (!autoRail) return;
    const autos = AUTO_IDS.map((id) => ADS.find((a) => a.id === id)).filter(Boolean);
    autoRail.innerHTML = autos
      .map((ad) => {
        const i = ADS.indexOf(ad);
        return `
        <button type="button" class="auto-card" data-index="${i}">
          <div class="auto-card__media">
            <img src="${withVer(ad.poster)}" alt="" loading="lazy" />
            <span class="auto-card__play" aria-hidden="true">▶</span>
          </div>
          <div class="auto-card__body">
            <p class="auto-card__year">${ad.year}</p>
            <h4 class="auto-card__title">${titleWithFormat(ad)}</h4>
            <p class="auto-card__role">${label(ad.role)}</p>
            <p class="auto-card__blurb">${label(ad.blurb)}</p>
          </div>
        </button>`;
      })
      .join("");

    autoRail.querySelectorAll("[data-index]").forEach((btn) => {
      btn.addEventListener("click", () => openPlayer(Number(btn.dataset.index)));
      btn.addEventListener("mouseenter", () => setTarget(Number(btn.dataset.index)));
    });
  }

  function buildFan() {
    deck.innerHTML = "";
    cards = ADS.map((ad, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `fan-card${ad.kind === "auto" ? " is-auto" : ""}`;
      btn.dataset.index = String(i);
      btn.innerHTML = `
        <img src="${withVer(ad.poster)}" alt="" loading="lazy" />
        <span class="fan-card__veil"></span>
        <span class="fan-card__year">${ad.year}</span>
        <span class="fan-card__role">${label(ad.role)}</span>
        <span class="fan-card__play" aria-hidden="true">▶</span>
      `;
      btn.addEventListener("click", () => openPlayer(i));
      deck.appendChild(btn);
      return btn;
    });

    const years = [...new Set(ADS.map((a) => a.year))];
    marksEl.innerHTML = years
      .map(
        (y) =>
          `<button type="button" class="ad-timeline__year" data-year="${y}">${y}</button>`
      )
      .join("");
    marksEl.querySelectorAll("[data-year]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = ADS.findIndex((a) => a.year === Number(btn.dataset.year));
        if (idx >= 0) setTarget(idx);
      });
    });

    dotsEl.innerHTML = ADS.map(
      (ad, i) =>
        `<button type="button" class="ad-timeline__dot${
          ad.kind === "auto" ? " is-auto-dot" : ""
        }" data-index="${i}" title="${label(ad.title)}" aria-label="${label(
          ad.title
        )}"></button>`
    ).join("");
    dotsEl.querySelectorAll("[data-index]").forEach((btn) => {
      btn.addEventListener("click", () => setTarget(Number(btn.dataset.index)));
    });

    if (listEl) {
      listEl.innerHTML = ADS.map(
        (ad, i) => `
        <button type="button" class="ad-role-list__item${
          ad.kind === "auto" ? " is-auto-row" : ""
        }" data-index="${i}">
          <span class="ad-role-list__year">${ad.year}</span>
          <span class="ad-role-list__title">${titleWithFormat(ad)}</span>
          <span class="ad-role-list__role">${label(ad.role)}</span>
        </button>`
      ).join("");
      listEl.querySelectorAll("[data-index]").forEach((btn) => {
        btn.addEventListener("click", () => openPlayer(Number(btn.dataset.index)));
        btn.addEventListener("mouseenter", () => setTarget(Number(btn.dataset.index)));
      });
      const countEl = document.querySelector("[data-ad-role-count]");
      if (countEl) countEl.textContent = String(ADS.length);
    }
  }

  function layoutFan() {
    const n = cards.length;
    if (!n) return;

    cards.forEach((card, i) => {
      const offset = i - cursor;
      const abs = Math.abs(offset);
      const nearest = Math.round(Math.max(0, Math.min(n - 1, cursor)));
      const isFront = i === nearest;
      // Keep a readable fan: show nearby cards only
      const visible = abs <= 4.5;

      card.classList.toggle("is-active", isFront);
      card.hidden = !visible && abs > 6;

      const rot = offset * 6.5;
      const x = offset * 56;
      const y = Math.abs(offset) * 14 + (isFront ? 0 : 16);
      const scale = isFront ? 1.08 : Math.max(0.78, 1 - abs * 0.06);
      const z = 100 - Math.round(abs * 2);
      const opacity = visible ? (isFront ? 1 : Math.max(0.45, 1 - abs * 0.12)) : 0;

      card.style.zIndex = String(z);
      card.style.opacity = String(opacity);
      card.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`;
      card.style.pointerEvents = isFront || abs < 1.2 ? "auto" : "none";
    });
  }

  function syncMeta() {
    const i = activeIndex();
    const ad = ADS[i];
    if (!ad || !yearEl) return;
    yearEl.textContent = String(ad.year);
    titleEl.innerHTML = titleWithFormat(ad);
    metaEl.textContent = label(ad.role);

    const isAuto = ad.kind === "auto";
    document.getElementById("fanNow")?.classList.toggle("is-auto-now", isAuto);

    dotsEl?.querySelectorAll(".ad-timeline__dot").forEach((d, idx) => {
      d.classList.toggle("is-active", idx === i);
    });
    marksEl?.querySelectorAll("[data-year]").forEach((m) => {
      m.classList.toggle("is-active", Number(m.dataset.year) === ad.year);
    });
    listEl?.querySelectorAll("[data-index]").forEach((item, idx) => {
      item.classList.toggle("is-active", idx === i);
    });
    autoRail?.querySelectorAll("[data-index]").forEach((card) => {
      card.classList.toggle("is-active", Number(card.dataset.index) === i);
    });

    const pct = ADS.length <= 1 ? 0 : (i / (ADS.length - 1)) * 100;
    if (progressEl) progressEl.style.width = `${pct}%`;

    zoneLeft?.classList.toggle("is-hot", scrubbing && target < cursor - 0.15);
    zoneRight?.classList.toggle("is-hot", scrubbing && target > cursor + 0.15);
  }

  function setTarget(index) {
    if (!Number.isFinite(index)) return;
    target = Math.max(0, Math.min(ADS.length - 1, index));
  }

  function tick() {
    if (!Number.isFinite(cursor) || !Number.isFinite(target)) {
      cursor = 0;
      target = 0;
    }
    cursor += (target - cursor) * 0.14;
    if (Math.abs(target - cursor) < 0.002) cursor = target;
    layoutFan();
    syncMeta();
    rafId = requestAnimationFrame(tick);
  }

  function mapPointerToIndex(clientX) {
    const rect = deck.getBoundingClientRect();
    if (!rect.width || rect.width < 40) return activeIndex();
    const pad = Math.min(48, rect.width * 0.1);
    const usable = rect.width - pad * 2;
    if (usable <= 0) return activeIndex();
    const x = Math.min(Math.max(clientX - rect.left, pad), rect.width - pad);
    const t = (x - pad) / usable;
    return t * (ADS.length - 1);
  }

  function onPointerMove(e) {
    if (player?.classList.contains("is-open")) return;
    scrubbing = true;
    target = mapPointerToIndex(e.clientX);
  }

  function onPointerLeave() {
    scrubbing = false;
    target = activeIndex();
    zoneLeft?.classList.remove("is-hot");
    zoneRight?.classList.remove("is-hot");
  }

  function openPlayer(index) {
    setTarget(index);
    cursor = index;
    const ad = ADS[index];
    playerYear.textContent = String(ad.year);
    playerTitle.innerHTML = titleWithFormat(ad);
    playerRole.textContent = label(ad.role);
    delete playerRole?.dataset.errShown;

    // Show shell first — some browsers defer media load while visibility:hidden
    player.classList.add("is-open");
    player.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const src = withVer(ad.video); // cache-bust so shared links get the latest encode
    const poster = withVer(ad.poster);

    playerVideo.pause();
    playerVideo.controls = true;
    playerVideo.setAttribute("playsinline", "");
    playerVideo.setAttribute("webkit-playsinline", "");
    playerVideo.poster = poster;
    // Direct src is more reliable than <source> swaps across browsers
    playerVideo.src = src;

    const onError = () => {
      console.error("[ad player]", src, playerVideo.error);
      if (playerRole && !playerRole.dataset.errShown) {
        playerRole.dataset.errShown = "1";
        playerRole.textContent =
          (document.body.dataset.lang === "en"
            ? "Video failed to load. "
            : "成片加载失败。 ") + label(ad.role);
      }
    };
    playerVideo.addEventListener("error", onError, { once: true });

    const tryPlay = () => {
      // Muted autoplay is allowed; unmute after play starts so sound returns
      const wasMuted = playerVideo.muted;
      playerVideo.muted = true;
      playerVideo
        .play()
        .then(() => {
          playerVideo.muted = wasMuted;
        })
        .catch(() => {
          playerVideo.muted = wasMuted;
          // User can still press native controls
        });
    };

    if (playerVideo.readyState >= 2) tryPlay();
    else {
      playerVideo.addEventListener("loadeddata", tryPlay, { once: true });
      playerVideo.addEventListener("canplay", tryPlay, { once: true });
    }
  }

  function closePlayer() {
    player.classList.remove("is-open");
    player.setAttribute("aria-hidden", "true");
    playerVideo.pause();
    playerVideo.removeAttribute("src");
    playerVideo.load();
    delete playerRole?.dataset.errShown;
    document.body.style.overflow = "";
  }

  prevBtn?.addEventListener("click", () => setTarget(activeIndex() - 1));
  nextBtn?.addEventListener("click", () => setTarget(activeIndex() + 1));
  playBtn?.addEventListener("click", () => openPlayer(activeIndex()));

  player?.querySelectorAll("[data-player-close]").forEach((el) => {
    el.addEventListener("click", closePlayer);
  });

  deck.addEventListener("pointermove", onPointerMove);
  deck.addEventListener("pointerenter", onPointerMove);
  deck.addEventListener("pointerleave", onPointerLeave);

  // Also allow scrubbing on the whole stage for larger hit area
  stage?.addEventListener("pointermove", (e) => {
    if (e.target.closest(".ad-role-list, .auto-rail, .fan-now, .fan-stage__hint, .ad-timeline")) {
      return;
    }
    if (e.target.closest(".fan-deck") || e.target === stage) onPointerMove(e);
  });

  document.addEventListener("keydown", (e) => {
    if (player?.classList.contains("is-open") && e.key === "Escape") {
      closePlayer();
      return;
    }
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView || player?.classList.contains("is-open")) return;
    if (e.key === "ArrowLeft") setTarget(activeIndex() - 1);
    if (e.key === "ArrowRight") setTarget(activeIndex() + 1);
    if (e.key === "Enter") openPlayer(activeIndex());
  });

  window.addEventListener("crj:langchange", () => {
    buildAutoRail();
    cards.forEach((card, i) => {
      const roleEl = card.querySelector(".fan-card__role");
      if (roleEl) roleEl.textContent = label(ADS[i].role);
    });
    if (listEl) {
      listEl.querySelectorAll("[data-index]").forEach((btn, i) => {
        btn.querySelector(".ad-role-list__title").innerHTML = titleWithFormat(ADS[i]);
        btn.querySelector(".ad-role-list__role").textContent = label(ADS[i].role);
      });
    }
    syncMeta();
    if (player?.classList.contains("is-open")) {
      const ad = ADS[activeIndex()];
      playerTitle.innerHTML = titleWithFormat(ad);
      playerRole.textContent = label(ad.role);
    }
  });

  window.addEventListener("resize", layoutFan);

  buildAutoRail();
  buildFan();
  layoutFan();
  syncMeta();
  tick();

  return { ADS, openPlayer, setTarget };
})();
