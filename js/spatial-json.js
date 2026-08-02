/**
 * Block B — display-only AIGC spatial routing JSON (not for reuse).
 */
window.CRJ_SPATIAL_JSON = (() => {
  function t(zh, en) {
    return document.body.dataset.lang === "en" ? en : zh;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function highlight(jsonText) {
    return escapeHtml(jsonText).replace(
      /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g,
      (m, str, colon, lit) => {
        if (str != null) {
          if (colon) {
            return `<span class="tok-key">${str}</span>${colon}`;
          }
          return `<span class="tok-str">${str}</span>`;
        }
        if (lit) return `<span class="tok-lit">${lit}</span>`;
        return `<span class="tok-num">${m}</span>`;
      }
    );
  }

  function blockExport(el) {
    const stop = (e) => e.preventDefault();
    el.addEventListener("copy", stop);
    el.addEventListener("cut", stop);
    el.addEventListener("contextmenu", stop);
    el.addEventListener("dragstart", stop);
  }

  async function mountCard(card) {
    const src = card.getAttribute("data-json-src");
    const code = card.querySelector("[data-json-code]");
    const pre = card.querySelector(".spatial-json__pre");
    const toggle = card.querySelector("[data-json-toggle]");
    if (!src || !code) return;

    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      code.innerHTML = highlight(JSON.stringify(data, null, 2));
      card.dataset.ready = "1";
    } catch (err) {
      code.textContent = t("无法加载 JSON", "Failed to load JSON");
      console.warn("[spatial-json]", src, err);
      return;
    }

    if (pre) blockExport(pre);

    function syncToggleLabel() {
      if (!toggle) return;
      const open = card.classList.contains("is-open");
      toggle.textContent = open
        ? t("收起", "Collapse")
        : t("展开", "Expand");
    }

    toggle?.addEventListener("click", () => {
      card.classList.toggle("is-open");
      syncToggleLabel();
    });

    syncToggleLabel();
  }

  function refreshLabels() {
    document.querySelectorAll(".spatial-json").forEach((card) => {
      const toggle = card.querySelector("[data-json-toggle]");
      if (!toggle) return;
      toggle.textContent = card.classList.contains("is-open")
        ? t("收起", "Collapse")
        : t("展开", "Expand");
    });
  }

  function init() {
    document.querySelectorAll(".spatial-json[data-json-src]").forEach(mountCard);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.addEventListener("crj:langchange", refreshLabels);

  return { init, refreshLabels };
})();
