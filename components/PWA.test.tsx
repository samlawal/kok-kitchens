/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act, cleanup } from "@testing-library/react";
import PWA from "./PWA";

function setUA(ua: string) {
  Object.defineProperty(navigator, "userAgent", { value: ua, configurable: true });
}

function setPlatform(p: string) {
  Object.defineProperty(navigator, "platform", { value: p, configurable: true });
}

function setMaxTouchPoints(n: number) {
  Object.defineProperty(navigator, "maxTouchPoints", { value: n, configurable: true });
}

const IPHONE_SAFARI =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

const IPHONE_CHROME =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/119.0.6045.169 Mobile/15E148 Safari/604.1";

const ANDROID_CHROME =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6045.163 Mobile Safari/537.36";

const DESKTOP_CHROME =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36";

const originalUA = navigator.userAgent;
const originalPlatform = navigator.platform;
const originalMaxTouchPoints = navigator.maxTouchPoints;

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.useFakeTimers();

  Object.defineProperty(navigator, "serviceWorker", {
    value: { register: vi.fn(() => Promise.resolve()) },
    configurable: true,
  });

  window.matchMedia = vi.fn().mockReturnValue({ matches: false });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  setUA(originalUA);
  setPlatform(originalPlatform);
  setMaxTouchPoints(originalMaxTouchPoints);
});

describe("PWA banner", () => {
  it("shows banner with Share instructions on iOS Safari", () => {
    setUA(IPHONE_SAFARI);
    setPlatform("iPhone");
    setMaxTouchPoints(5);

    render(<PWA />);
    expect(screen.getByTestId("pwa-banner")).toBeTruthy();
    expect(screen.getByText(/Share/)).toBeTruthy();
    expect(screen.getByText(/Add to Home Screen/)).toBeTruthy();
  });

  it("shows banner with menu instructions on iOS Chrome", () => {
    setUA(IPHONE_CHROME);
    setPlatform("iPhone");
    setMaxTouchPoints(5);

    render(<PWA />);
    const banner = screen.getByTestId("pwa-banner");
    expect(banner).toBeTruthy();
    // THE BUG: iOS Chrome adds to home via the Share sheet, NOT the ⋮ menu.
    // Old copy sent them to "Tap ⋮ menu" → no such option on iOS. Pin the fix:
    // must show the Share instruction, never the Android "Install app" menu one.
    expect(banner.textContent).toContain("Share");
    expect(banner.textContent).toContain("Add to Home Screen");
    expect(banner.textContent).not.toContain("Install app");
  });

  it("shows banner with menu instructions on Android Chrome after timeout", () => {
    setUA(ANDROID_CHROME);
    setPlatform("Linux armv8l");
    setMaxTouchPoints(5);

    render(<PWA />);
    expect(screen.queryByTestId("pwa-banner")).toBeNull();

    // Manual fallback is deliberately delayed (10s) so the one-click native
    // prompt has time to win; still null before then.
    act(() => { vi.advanceTimersByTime(2500); });
    expect(screen.queryByTestId("pwa-banner")).toBeNull();

    act(() => { vi.advanceTimersByTime(8000); });
    const banner = screen.getByTestId("pwa-banner");
    expect(banner).toBeTruthy();
    expect(banner.textContent).toContain("Install app");
  });

  it("native install button wins the race over the manual fallback", () => {
    setUA(ANDROID_CHROME);
    setPlatform("Linux armv8l");
    setMaxTouchPoints(5);
    render(<PWA />);
    // Prompt fires at 3s — before the 10s fallback — so we show the button.
    act(() => { vi.advanceTimersByTime(3000); });
    act(() => {
      const e = new Event("beforeinstallprompt", { cancelable: true });
      Object.assign(e, { prompt: vi.fn(), userChoice: Promise.resolve() });
      window.dispatchEvent(e);
    });
    act(() => { vi.advanceTimersByTime(9000); });
    expect(screen.getByText("Install app")).toBeTruthy();
    expect(screen.queryByText(/Open the/)).toBeNull();
  });

  it("does not show banner on desktop without beforeinstallprompt", () => {
    setUA(DESKTOP_CHROME);
    setPlatform("MacIntel");
    setMaxTouchPoints(0);

    render(<PWA />);
    act(() => { vi.advanceTimersByTime(3000); });
    expect(screen.queryByTestId("pwa-banner")).toBeNull();
  });

  it("shows native install button when beforeinstallprompt fires", () => {
    setUA(DESKTOP_CHROME);
    setPlatform("MacIntel");
    setMaxTouchPoints(0);

    render(<PWA />);

    act(() => {
      const e = new Event("beforeinstallprompt", { cancelable: true });
      Object.assign(e, { prompt: vi.fn(), userChoice: Promise.resolve() });
      window.dispatchEvent(e);
    });

    expect(screen.getByTestId("pwa-banner")).toBeTruthy();
    expect(screen.getByText("Install app")).toBeTruthy();
  });

  it("hides banner after dismiss and persists for 30 days", () => {
    setUA(IPHONE_SAFARI);
    setPlatform("iPhone");
    setMaxTouchPoints(5);

    render(<PWA />);
    expect(screen.getByTestId("pwa-banner")).toBeTruthy();

    act(() => { screen.getByLabelText("Dismiss").click(); });
    expect(screen.queryByTestId("pwa-banner")).toBeNull();
    expect(localStorage.getItem("kok_install_dismissed")).toBeTruthy();
  });

  it("hides banner permanently after install", () => {
    setUA(IPHONE_SAFARI);
    setPlatform("iPhone");
    setMaxTouchPoints(5);

    render(<PWA />);

    act(() => { window.dispatchEvent(new Event("appinstalled")); });
    expect(screen.queryByTestId("pwa-banner")).toBeNull();
    expect(localStorage.getItem("kok_installed")).toBe("1");
  });

  it("does not show banner when already in standalone mode", () => {
    setUA(IPHONE_SAFARI);
    setPlatform("iPhone");
    setMaxTouchPoints(5);
    window.matchMedia = vi.fn().mockReturnValue({ matches: true });

    render(<PWA />);
    expect(screen.queryByTestId("pwa-banner")).toBeNull();
  });
});
