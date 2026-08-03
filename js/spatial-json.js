/**
 * Block B — AIGC spatial routing JSON, shown blurred (internal company docs).
 */
window.CRJ_SPATIAL_JSON = (() => {
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
          if (colon) return `<span class="tok-key">${str}</span>${colon}`;
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
    if (!src || !code) return;

    try {
      const res = await fetch(src);
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      code.innerHTML = highlight(JSON.stringify(data, null, 2));
    } catch (err) {
      code.textContent = "{\n  /* … */\n}";
      console.warn("[spatial-json]", src, err);
    }

    if (pre) blockExport(pre);
  }

  function init() {
    document.querySelectorAll(".spatial-json[data-json-src]").forEach((card) => {
      mountCard(card);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.addEventListener("crj:langchange", () => {});

  return { init };
})();
