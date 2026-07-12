"use client";
import { useEffect, useState } from "react";

type PromptEvent = Event & { prompt: () => void; userChoice: Promise<unknown> };

const DISMISS_KEY = "kok_install_dismissed";

function isIOS() {
  const ua = navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isIOSSafari() {
  return (
    isIOS() &&
    /Safari/.test(navigator.userAgent) &&
    !/CriOS|FxiOS|EdgiOS|OPiOS/.test(navigator.userAgent)
  );
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export default function PWA() {
  const [deferred, setDeferred] = useState<PromptEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    if (sessionStorage.getItem(DISMISS_KEY)) {
      setDismissed(true);
      return;
    }

    if (isIOSSafari() && !isStandalone()) setIosHint(true);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as PromptEvent);
    };
    const onInstalled = () => {
      setDeferred(null);
      setIosHint(false);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
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
    setIosHint(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
  };

  const showChromium = !dismissed && Boolean(deferred);
  const showIOS = !dismissed && iosHint && !deferred;
  if (!showChromium && !showIOS) return null;

  return (
    <div className="fixed inset-x-3 bottom-24 z-[55] mx-auto max-w-sm rounded-2xl border border-orange-200 bg-white p-4 shadow-xl sm:bottom-5">
      <div className="flex items-center gap-3">
        <img src="/icon.png" alt="" className="h-11 w-11 rounded-xl" />
        <div className="flex-1">
          <p className="text-sm font-bold text-stone-900">Install KOK Kitchens</p>
          <p className="text-xs text-stone-500">
            {showIOS
              ? "Add the menu to your home screen for an app-like experience."
              : "Add the menu to your home screen — like an app."}
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

      {showChromium ? (
        <button
          onClick={install}
          className="mt-3 w-full rounded-lg bg-orange-600 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 active:scale-95"
        >
          Install app
        </button>
      ) : (
        <p className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-orange-50 py-2.5 text-center text-xs font-medium text-stone-700">
          Tap <ShareIcon /> Share, then{" "}
          <span className="font-semibold">&quot;Add to Home Screen&quot;</span>
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
