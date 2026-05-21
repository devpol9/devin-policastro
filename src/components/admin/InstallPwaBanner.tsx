import { useEffect, useRef, useState } from "react";
import { Download, X, Share } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "devhq.installBanner.dismissedAt";
const COOLDOWN_DAYS = 14;

const InstallPwaBanner = () => {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [iosHint, setIosHint] = useState(false);
  const tracked = useRef(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    if (standalone) {
      trackEvent("pwa_already_installed", {});
      return;
    }

    try {
      const raw = localStorage.getItem(DISMISS_KEY);
      if (raw) {
        const ts = Number(raw);
        if (Date.now() - ts < COOLDOWN_DAYS * 86400_000) return;
      }
    } catch {}

    const ua = navigator.userAgent;
    const isIos = /iPhone|iPad|iPod/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
    if (isIos) {
      setIosHint(true);
      setShow(true);
      return;
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    const onInstalled = () => {
      trackEvent("pwa_installed", {});
      setShow(false);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    if (show && !tracked.current) {
      tracked.current = true;
      trackEvent("install_banner_shown", { platform: iosHint ? "ios" : "native" });
    }
  }, [show, iosHint]);

  const dismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch {}
    trackEvent("install_banner_dismissed", { platform: iosHint ? "ios" : "native" });
    setShow(false);
  };

  const install = async () => {
    if (!deferred) return;
    trackEvent("install_banner_clicked", {});
    await deferred.prompt();
    const choice = await deferred.userChoice;
    trackEvent(`install_banner_${choice.outcome}`, {});
    if (choice.outcome === "accepted") {
      setShow(false);
    } else {
      dismiss();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-3 right-3 md:left-auto md:right-4 md:w-80 z-50 panel p-3 shadow-elegant flex items-start gap-3 animate-in slide-in-from-bottom-2">
      <div className="rounded-md bg-accent/15 text-accent p-2 shrink-0">
        <Download size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-sm leading-tight">Install DevHQ</p>
        {iosHint ? (
          <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
            Tap <Share size={11} className="inline -mt-0.5" /> Share, then "Add to Home Screen".
          </p>
        ) : (
          <>
            <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
              One-tap access. Works offline.
            </p>
            <button
              onClick={install}
              className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-display font-semibold px-2.5 py-1 rounded bg-foreground text-background hover:opacity-90"
            >
              Install
            </button>
          </>
        )}
      </div>
      <button
        onClick={dismiss}
        className="shrink-0 text-muted-foreground hover:text-foreground p-1 -mt-1 -mr-1"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default InstallPwaBanner;
