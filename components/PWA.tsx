"use client";
import { useEffect, useState } from "react";

type PromptEvent = Event & { prompt: () => void; userChoice: Promise<unknown> };

const DISMISS_KEY = "kok_install_dismissed";
const INSTALLED_KEY = "kok_installed";
const DISMISS_DAYS = 30;

export function isIOS() {
  const ua = navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export function isIOSSafari() {
  return (
    isIOS() &&
    /Safari/.test(navigator.userAgent) &&
    !/CriOS|FxiOS|EdgiOS|OPiOS/.test(navigator.userAgent)
  );
}

export function isIOSChrome() {
  return isIOS() && /CriOS/.test(navigator.userAgent);
}

export function isAndroidChrome() {
  return /Android/.test(navigator.userAgent) && /Chrome\//.test(navigator.userAgent);
}

export function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export type HintMode = "chromium" | "ios-safari" | "ios-chrome" | "android" | null;

export default function PWA() {
  const [deferred, setDeferred] = useState<PromptEvent | null>(null);
  const [hint, setHint] = useState<HintMode>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    if (isStandalone()) return;

    if (localStorage.getItem(INSTALLED_KEY)) {
      setDismissed(true);
      return;
    }
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt && Date.now() - Number(dismissedAt) < DISMISS_DAYS * 86_400_000) {
      setDismissed(true);
      return;
    }

    if (isIOSSafari()) setHint("ios-safari");
    else if (isIOSChrome()) setHint("ios-chrome");

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as PromptEvent);
      setHint("chromium");
    };
    const onInstalled = () => {
      setDeferred(null);
      setHint(null);
      setDismissed(true);
      localStorage.setItem(INSTALLED_KEY, "1");
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);

    // Prefer the one-click native prompt: give beforeinstallprompt plenty of
    // time to fire (it can be delayed or gated on a gesture) before falling
    // back to manual instructions. 2s was too eager and showed the manual
    // hint over the button that was about to appear.
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isAndroidChrome()) {
      timer = setTimeout(() => {
        setHint((prev) => prev ?? "android");
      }, 10_000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  const dismiss = () => {
    setDismissed(true);
    setHint(null);
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  };

  if (dismissed || !hint) return null;

  return (
    <div
      data-testid="pwa-banner"
      className="fixed inset-x-3 bottom-24 z-[55] mx-auto max-w-sm rounded-2xl border border-orange-200 bg-white p-4 shadow-xl sm:bottom-5"
    >
      <div className="flex items-center gap-3">
        <img src="/icon.png" alt="" className="h-11 w-11 rounded-xl" />
        <div className="flex-1">
          <p className="text-sm font-bold text-stone-900">Install KOK Kitchens</p>
          <p className="text-xs text-stone-500">
            Add the menu to your home screen — like an app.
          </p>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 text-stone-400 hover:text-stone-700"
        >
          ✕
        </button>
      </div>

      {hint === "chromium" ? (
        <button
          onClick={install}
          className="mt-3 w-full rounded-lg bg-orange-600 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 active:scale-95"
        >
          Install app
        </button>
      ) : hint === "ios-safari" || hint === "ios-chrome" ? (
        <p className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-orange-50 py-2.5 text-center text-xs font-medium text-stone-700">
          Tap <ShareIcon /> Share, then{" "}
          <span className="font-semibold">&quot;Add to Home Screen&quot;</span>
        </p>
      ) : (
        <p className="mt-3 flex flex-wrap items-center justify-center gap-1.5 rounded-lg bg-orange-50 py-2.5 px-2 text-center text-xs font-medium text-stone-700">
          Open the <MenuDotsIcon /> menu (top-right), then tap{" "}
          <span className="font-semibold">&quot;Install app&quot;</span> or{" "}
          <span className="font-semibold">&quot;Add to Home screen&quot;</span>
        </p>
      )}
    </div>
  );
}

function ShareIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline-block shrink-0 text-orange-600"
      aria-hidden
    >
      <path d="M12 15V3" />
      <path d="m8 7 4-4 4 4" />
      <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
    </svg>
  );
}

function MenuDotsIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="inline-block shrink-0 text-orange-600"
      aria-hidden
    >
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="12" cy="19" r="2" />
    </svg>
  );
}
