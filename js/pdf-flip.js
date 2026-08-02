/**
 * Lightweight image-page flip viewer for pre-rasterized PDF pages.
 * Usage:
 *   <div class="pdf-flip"
 *        data-pdf-pages='["a/page-01.jpg", ...]'
 *        data-pdf-title="..."
 *        data-pdf-ratio="portrait|landscape"
 *        data-i18n-attr-title="i18n.key"></div>
 */
window.CRJ_PDF_FLIP = (() => {
  function label(zh, en) {
    return document.body.dataset.lang === "en" ? en : zh;
  }

  function resolveTitle(el) {
    const key = el.getAttribute("data-i18n-attr-title");
    if (key && window.CRJ_I18N && typeof window.CRJ_I18N.t === "function") {
      const t = window.CRJ_I18N.t(key);
      if (t) return t;
    }
    return el.getAttribute("data-pdf-title") || "";
  }

  function mount(el) {
    let pages = [];
    try {
      pages = JSON.parse(el.getAttribute("data-pdf-pages") || "[]");
    } catch (_) {
      pages = [];
    }
    if (!pages.length) return;

    const ratio = el.getAttribute("data-pdf-ratio") || "portrait";
    let index = Number(el.dataset.pdfIndex) || 0;

    el.classList.add("pdf-flip");
    el.classList.toggle("pdf-flip--landscape", ratio === "landscape");
    el.classList.toggle("pdf-flip--portrait", ratio !== "landscape");
    el.innerHTML = `
      <div class="pdf-flip__chrome">
        <p class="pdf-flip__title"></p>
        <div class="pdf-flip__nav">
          <button type="button" class="pdf-flip__btn" data-act="prev" aria-label="上一页">‹</button>
          <span class="pdf-flip__count"></span>
          <button type="button" class="pdf-flip__btn" data-act="next" aria-label="下一页">›</button>
        </div>
      </div>
      <div class="pdf-flip__stage">
        <button type="button" class="pdf-flip__page-hit" data-act="zoom" aria-label="放大查看">
          <img class="pdf-flip__img" alt="" draggable="false" />
        </button>
      </div>
      <div class="pdf-flip__dots" role="tablist"></div>
      <p class="pdf-flip__hint"></p>
    `;

    const titleEl = el.querySelector(".pdf-flip__title");
    const countEl = el.querySelector(".pdf-flip__count");
    const imgEl = el.querySelector(".pdf-flip__img");
    const dotsEl = el.querySelector(".pdf-flip__dots");
    const hintEl = el.querySelector(".pdf-flip__hint");
    const prevBtn = el.querySelector('[data-act="prev"]');
    const nextBtn = el.querySelector('[data-act="next"]');
    const zoomBtn = el.querySelector('[data-act="zoom"]');

    const showDots = pages.length <= 14;
    if (showDots) {
      dotsEl.innerHTML = pages
        .map(
          (_, i) =>
            `<button type="button" class="pdf-flip__dot" data-page="${i}" aria-label="${label(
              `第 ${i + 1} 页`,
              `Page ${i + 1}`
            )}"></button>`
        )
        .join("");
    } else {
      dotsEl.hidden = true;
    }

    function syncCopy() {
      const title = resolveTitle(el);
      if (titleEl) titleEl.textContent = title;
      prevBtn.setAttribute("aria-label", label("上一页", "Previous page"));
      nextBtn.setAttribute("aria-label", label("下一页", "Next page"));
      zoomBtn.setAttribute("aria-label", label("放大查看", "Zoom page"));
      if (hintEl) {
        hintEl.textContent = label(
          "左右箭头 / 滑动翻页 · 点击页面放大",
          "Arrow keys / swipe · click to zoom"
        );
      }
      return title;
    }

    function render() {
      index = Math.max(0, Math.min(pages.length - 1, index));
      el.dataset.pdfIndex = String(index);
      const title = syncCopy();
      imgEl.src = pages[index];
      imgEl.alt = `${title} · ${index + 1}/${pages.length}`;
      countEl.textContent = `${index + 1} / ${pages.length}`;
      prevBtn.disabled = index <= 0;
      nextBtn.disabled = index >= pages.length - 1;
      if (showDots) {
        dotsEl.querySelectorAll(".pdf-flip__dot").forEach((d, i) => {
          d.classList.toggle("is-active", i === index);
        });
      }
    }

    function go(delta) {
      index += delta;
      render();
    }

    prevBtn.addEventListener("click", () => go(-1));
    nextBtn.addEventListener("click", () => go(1));
    if (showDots) {
      dotsEl.querySelectorAll("[data-page]").forEach((btn) => {
        btn.addEventListener("click", () => {
          index = Number(btn.dataset.page) || 0;
          render();
        });
      });
    }

    el.tabIndex = 0;
    el.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
    });

    let sx = 0;
    const stage = el.querySelector(".pdf-flip__stage");
    stage.addEventListener("pointerdown", (e) => {
      sx = e.clientX;
    });
    stage.addEventListener("pointerup", (e) => {
      const dx = e.clientX - sx;
      if (Math.abs(dx) < 40) return;
      go(dx < 0 ? 1 : -1);
    });

    zoomBtn.addEventListener("click", () => {
      const box = document.getElementById("pageLightbox");
      const boxImg = document.getElementById("pageLightboxImg");
      if (box && boxImg) {
        boxImg.src = pages[index];
        box.hidden = false;
        return;
      }
      window.open(pages[index], "_blank", "noopener");
    });

    render();
    el._crjPdfFlip = {
      go,
      render,
      get index() {
        return index;
      },
    };
  }

  function init(root = document) {
    root.querySelectorAll("[data-pdf-pages]").forEach((el) => {
      if (el._crjPdfFlip) return;
      mount(el);
    });
  }

  function refreshTitles() {
    document.querySelectorAll(".pdf-flip[data-pdf-pages]").forEach((el) => {
      if (el._crjPdfFlip) el._crjPdfFlip.render();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => init());
  } else {
    init();
  }

  window.addEventListener("crj:langchange", refreshTitles);

  return { init, mount, refreshTitles };
})();
