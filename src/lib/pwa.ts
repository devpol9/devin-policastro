// PWA registration with strict guards: never register in iframes or on
// Lovable preview hosts to avoid stale-shell issues.
export function registerPwa() {
  if (typeof window === "undefined") return;

  const isInIframe = (() => {
    try { return window.self !== window.top; } catch { return true; }
  })();

  const host = window.location.hostname;
  const isPreviewHost =
    host.includes("id-preview--") ||
    host.includes("preview--") ||
    host.includes("lovableproject.com") ||
    host.includes("lovableproject-dev.com");

  // In preview/iframe contexts, proactively unregister any existing SWs and bail.
  if (isPreviewHost || isInIframe) {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.unregister());
      }).catch(() => {});
    }
    return;
  }

  if (!("serviceWorker" in navigator)) return;

  // Lazy-import the virtual module exposed by vite-plugin-pwa.
  import("virtual:pwa-register")
    .then(({ registerSW }) => {
      registerSW({ immediate: true });
    })
    .catch(() => {
      // No-op: plugin may not be present in this build.
    });
}
