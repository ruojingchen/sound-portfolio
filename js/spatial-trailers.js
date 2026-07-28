/**
 * Spatial Block A — handcrafted Atmos trailer fan
 * Stereo preview in-browser; ADM download for multichannel playback.
 * Posters: replace assets/spatial/posters/{id}.svg with final art later.
 */
window.CRJ_SPATIAL_TRAILERS = (() => {
  const ASSET_VER = "20260728e";
  const withVer = (path) =>
    path.includes("?") ? `${path}&v=${ASSET_VER}` : `${path}?v=${ASSET_VER}`;

  const label = (v) => {
    if (!v) return "";
    if (typeof v === "string") return v;
    const lang = document.body.dataset.lang === "en" ? "en" : "zh";
    return v[lang] || v.zh || v.en || "";
  };

  const TRAILERS = [
    {
      id: "baima",
      duration: "2:01",
      title: { zh: "白马与天涯", en: "Horse and Skyline" },
      meta: {
        zh: "Atmos 预告 · 网页立体声折混",
        en: "Atmos trailer · web stereo fold-down",
      },
      audio: "assets/spatial/trailers/baima.m4a",
      adm: "assets/spatial/trailers/baima-atmos-adm.mp4",
      admName: "白马_预告_Atmos_ADM.mp4",
      poster: "assets/spatial/posters/baima.jpg",
    },
    {
      id: "huxiaojiu",
      duration: "2:21",
      title: { zh: "狐小九之江湖奇谭", en: "Fox Nine · Jianghu Tales" },
      meta: {
        zh: "Atmos 预告 · 网页立体声折混",
        en: "Atmos trailer · web stereo fold-down",
      },
      audio: "assets/spatial/trailers/huxiaojiu.m4a",
      adm: "assets/spatial/trailers/huxiaojiu-atmos-adm.mp4",
      admName: "狐小九_预告_Atmos_ADM.mp4",
      poster: "assets/spatial/posters/huxiaojiu.jpg",
    },
    {
      id: "zootopia",
      duration: "4:51",
      title: { zh: "疯狂动物城", en: "Zootopia" },
      meta: {
        zh: "Atmos 预告 · 网页立体声折混",
        en: "Atmos trailer · web stereo fold-down",
      },
      audio: "assets/spatial/trailers/zootopia.m4a",
      adm: "assets/spatial/trailers/zootopia-atmos-adm.mp4",
      admName: "疯狂动物城_预告_Atmos_ADM.mp4",
      poster: "assets/spatial/posters/zootopia.jpg",
    },
    {
      id: "mobile-court",
      duration: "2:51",
      title: { zh: "龙猫法官·白米拉", en: "Judge Baimila" },
      meta: {
        zh: "Atmos 试听 · 网页立体声折混（源文件：移动法庭）",
        en: "Atmos sample · web stereo fold-down (source: Mobile Court)",
      },
      audio: "assets/spatial/trailers/mobile-court.m4a",
      adm: "assets/spatial/trailers/mobile-court-atmos-adm.mp4",
      admName: "移动法庭_Atmos_ADM.mp4",
      poster: "assets/spatial/posters/mobile-court.jpg",
    },
    {
      id: "renshijian",
      duration: "7:08",
      title: { zh: "人世间", en: "A Lifetime" },
      meta: {
        zh: "Atmos 试听 · 网页立体声折混 · 海报待补",
        en: "Atmos sample · web stereo fold-down · poster pending",
      },
      audio: "assets/spatial/trailers/renshijian.m4a",
      adm: "assets/spatial/trailers/renshijian-atmos-adm.mp4",
      admName: "人世间_Atmos_ADM.mp4",
      poster: "assets/spatial/posters/renshijian.svg",
    },
    {
      id: "chongsheng",
      duration: "8:54",
      title: { zh: "重生回来", en: "Reborn" },
      meta: {
        zh: "Atmos 试听 · 网页立体声折混",
        en: "Atmos sample · web stereo fold-down",
      },
      audio: "assets/spatial/trailers/chongsheng.m4a",
      adm: "assets/spatial/trailers/chongsheng-atmos-adm.mp4",
      admName: "重生归来_Atmos_ADM.mp4",
      poster: "assets/spatial/posters/chongsheng.jpg",
    },
    {
      id: "qingrang",
      duration: "9:33",
      title: { zh: "枭起青壤", en: "The Rise of Qingrang" },
      meta: {
        zh: "Atmos 试听 · 网页立体声折混",
        en: "Atmos sample · web stereo fold-down",
      },
      audio: "assets/spatial/trailers/qingrang.m4a",
      adm: "assets/spatial/trailers/qingrang-atmos-adm.mp4",
      admName: "青壤_Atmos_ADM.mp4",
      poster: "assets/spatial/posters/qingrang.jpg",
    },
    {
      id: "wandering-earth",
      duration: "11:57",
      title: { zh: "流浪地球", en: "The Wandering Earth" },
      meta: {
        zh: "Atmos 试听 · 网页立体声折混",
        en: "Atmos sample · web stereo fold-down",
      },
      audio: "assets/spatial/trailers/wandering-earth.m4a",
      adm: "assets/spatial/trailers/wandering-earth-atmos-adm.mp4",
      admName: "流浪地球_Atmos_ADM.mp4",
      poster: "assets/spatial/posters/wandering-earth.jpg",
    },
    {
      id: "songci",
      duration: "12:50",
      title: { zh: "宋慈洗冤笔记", en: "Song Ci · Cold Cases" },
      meta: {
        zh: "Atmos 试听 · 网页立体声折混",
        en: "Atmos sample · web stereo fold-down",
      },
      audio: "assets/spatial/trailers/songci.m4a",
      adm: "assets/spatial/trailers/songci-atmos-adm.mp4",
      admName: "宋慈洗冤笔记_Atmos_ADM.mp4",
      poster: "assets/spatial/posters/songci.jpg",
    },
  ];

  const stage = document.getElementById("spatFanStage");
  const deck = document.getElementById("spatFanDeck");
  const dotsEl = document.getElementById("spatFanDots");
  const titleEl = document.getElementById("spatFanTitle");
  const metaEl = document.getElementById("spatFanMeta");
  const durEl = document.getElementById("spatFanDur");
  const audioEl = document.getElementById("spatFanAudio");
  const dlEl = document.getElementById("spatFanDl");
  const prevBtn = document.getElementById("spatFanPrev");
  const nextBtn = document.getElementById("spatFanNext");
  const playBtn = document.getElementById("spatFanPlay");

  if (!stage || !deck) return { TRAILERS };

  let cards = [];
  let cursor = 0;
  let target = 0;
  let lastSynced = -1;

  function activeIndex() {
    return Math.round(Math.max(0, Math.min(TRAILERS.length - 1, cursor)));
  }

  function build() {
    deck.innerHTML = "";
    cards = TRAILERS.map((t, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "spat-fan-card";
      btn.dataset.index = String(i);
      btn.setAttribute("aria-label", label(t.title));
      btn.innerHTML = `
        <img src="${withVer(t.poster)}" alt="" loading="lazy" />
        <span class="spat-fan-card__veil"></span>
        <span class="spat-fan-card__dur">${t.duration}</span>
        <span class="spat-fan-card__title">${label(t.title)}</span>
        <span class="spat-fan-card__play" aria-hidden="true">▶</span>
      `;
      btn.addEventListener("click", () => selectAndPlay(i));
      deck.appendChild(btn);
      return btn;
    });

    if (dotsEl) {
      dotsEl.innerHTML = TRAILERS.map(
        (t, i) =>
          `<button type="button" class="spat-fan__dot" data-index="${i}" title="${label(
            t.title
          )}" aria-label="${label(t.title)}"></button>`
      ).join("");
      dotsEl.querySelectorAll("[data-index]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const i = Number(btn.dataset.index);
          setTarget(i);
          syncNow(i, false);
        });
      });
    }
  }

  function layoutFan() {
    const n = cards.length;
    if (!n) return;
    cards.forEach((card, i) => {
      const offset = i - cursor;
      const abs = Math.abs(offset);
      const nearest = activeIndex();
      const isFront = i === nearest;
      const visible = abs <= 4.5;
      card.classList.toggle("is-active", isFront);
      card.hidden = !visible && abs > 6;
      const rot = offset * 6.2;
      const x = offset * 52;
      const y = Math.abs(offset) * 12 + (isFront ? 0 : 14);
      const scale = isFront ? 1.06 : Math.max(0.76, 1 - abs * 0.055);
      const z = 100 - Math.round(abs * 2);
      const opacity = visible ? (isFront ? 1 : Math.max(0.4, 1 - abs * 0.12)) : 0;
      card.style.zIndex = String(z);
      card.style.opacity = String(opacity);
      card.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale})`;
      card.style.pointerEvents = isFront || abs < 1.15 ? "auto" : "none";
    });
  }

  function syncNow(i = activeIndex(), loadAudio = true) {
    const t = TRAILERS[i];
    if (!t) return;
    lastSynced = i;
    if (durEl) durEl.textContent = t.duration;
    if (titleEl) titleEl.textContent = label(t.title);
    if (metaEl) metaEl.textContent = label(t.meta);
    if (dlEl) {
      dlEl.href = withVer(t.adm);
      dlEl.setAttribute("download", t.admName);
    }
    dotsEl?.querySelectorAll(".spat-fan__dot").forEach((d, idx) => {
      d.classList.toggle("is-active", idx === i);
    });
    if (loadAudio && audioEl) {
      const src = withVer(t.audio);
      if (audioEl.getAttribute("src") !== src) {
        audioEl.src = src;
      }
    }
  }

  function selectAndPlay(i) {
    setTarget(i);
    syncNow(i, true);
    audioEl?.play().catch(() => {});
  }

  function setTarget(index) {
    if (!Number.isFinite(index)) return;
    target = Math.max(0, Math.min(TRAILERS.length - 1, index));
  }

  function tick() {
    cursor += (target - cursor) * 0.14;
    if (Math.abs(target - cursor) < 0.002) cursor = target;
    layoutFan();
    const i = activeIndex();
    if (i !== lastSynced) syncNow(i, true);
    requestAnimationFrame(tick);
  }

  function mapPointerToIndex(clientX) {
    const rect = deck.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (clientX - rect.left) / Math.max(1, rect.width)));
    return Math.round(x * (TRAILERS.length - 1));
  }

  build();
  syncNow(0, true);
  requestAnimationFrame(tick);

  prevBtn?.addEventListener("click", () => {
    const i = Math.max(0, activeIndex() - 1);
    setTarget(i);
    syncNow(i, true);
  });
  nextBtn?.addEventListener("click", () => {
    const i = Math.min(TRAILERS.length - 1, activeIndex() + 1);
    setTarget(i);
    syncNow(i, true);
  });
  playBtn?.addEventListener("click", () => selectAndPlay(activeIndex()));

  deck.addEventListener("pointermove", (e) => {
    setTarget(mapPointerToIndex(e.clientX));
  });
  deck.addEventListener("pointerleave", () => {
    setTarget(activeIndex());
  });

  window.addEventListener("crj:langchange", () => {
    const i = activeIndex();
    build();
    syncNow(i, false);
    layoutFan();
  });

  return { TRAILERS, setTarget, selectAndPlay };
})();
