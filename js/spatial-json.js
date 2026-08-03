/**
 * Block B — redacted AIGC spatial routing cards (internal company docs).
 * Real JSON is no longer loaded or expanded.
 */
window.CRJ_SPATIAL_JSON = (() => {
  function init() {
    document.querySelectorAll(".spatial-json--redacted").forEach((card) => {
      card.querySelectorAll(".spatial-json__pre").forEach((pre) => {
        pre.addEventListener("copy", (e) => e.preventDefault());
        pre.addEventListener("cut", (e) => e.preventDefault());
        pre.addEventListener("contextmenu", (e) => e.preventDefault());
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  return { init };
})();
