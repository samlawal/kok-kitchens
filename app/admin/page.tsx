"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Upload,
  RotateCcw,
  Check,
  AlertCircle,
  Lock,
  Camera,
  PoundSterling,
  Save,
  Undo2,
} from "lucide-react";
import { menuItems, formatPrice } from "@/lib/menu-data";

type Tab = "photos" | "pricing";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("photos");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthenticated(true);
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-stone-900 rounded-2xl border border-stone-800 p-8"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Lock className="h-5 w-5 text-orange-400" />
            <h1 className="text-lg font-bold text-white">KOK Kitchen Admin</h1>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full rounded-lg border border-stone-700 bg-stone-800 px-4 py-3 text-white placeholder:text-stone-500 focus:border-orange-500 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-orange-600 py-3 text-sm font-semibold text-white hover:bg-orange-500 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-white">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">KOK Kitchen Admin</h1>
          <button
            onClick={() => setAuthenticated(false)}
            className="text-xs text-stone-500 hover:text-stone-300"
          >
            Sign out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-stone-900 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("photos")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-colors ${
              activeTab === "photos"
                ? "bg-orange-600 text-white"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <Camera className="h-4 w-4" />
            Photos
          </button>
          <button
            onClick={() => setActiveTab("pricing")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-colors ${
              activeTab === "pricing"
                ? "bg-orange-600 text-white"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <PoundSterling className="h-4 w-4" />
            Pricing
          </button>
        </div>

        {activeTab === "photos" && <PhotosTab password={password} />}
        {activeTab === "pricing" && <PricingTab password={password} />}
      </div>
    </div>
  );
}

// ── Photos Tab ─────────────────────────────────────────────
function PhotosTab({ password }: { password: string }) {
  const [selectedItem, setSelectedItem] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please select an image file" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: "error", text: "File too large (max 10MB)" });
      return;
    }
    setPreview(URL.createObjectURL(file));
    setMessage(null);
  }

  async function handleUpload() {
    const file = fileRef.current?.files?.[0];
    if (!file || !selectedItem) return;
    setUploading(true);
    setMessage(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("menuItemId", selectedItem);
    formData.append("password", password);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: data.message });
        setUploadedUrl(data.url);
        setPreview(null);
        if (fileRef.current) fileRef.current.value = "";
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch {
      setMessage({ type: "error", text: "Upload failed. Please try again." });
    } finally {
      setUploading(false);
    }
  }

  async function handleRollback() {
    if (!selectedItem) return;
    setUploading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/upload", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, menuItemId: selectedItem }),
      });
      const data = await res.json();
      setMessage({
        type: data.success ? "success" : "error",
        text: data.message,
      });
    } catch {
      setMessage({ type: "error", text: "Rollback failed." });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <p className="text-stone-400 text-sm mb-6">
        Upload new dish photos — auto-optimized to WebP
      </p>

      <div className="mb-6">
        <label className="block text-sm font-medium text-stone-300 mb-2">
          Select dish to update
        </label>
        <select
          value={selectedItem}
          onChange={(e) => {
            setSelectedItem(e.target.value);
            setMessage(null);
            setPreview(null);
            setUploadedUrl(null);
          }}
          className="w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
        >
          <option value="">Choose a dish...</option>
          {menuItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} — {item.category}
            </option>
          ))}
        </select>
      </div>

      {selectedItem && (
        <>
          <div className="mb-6">
            <p className="text-sm font-medium text-stone-300 mb-2">Current photo</p>
            <div className="w-40 h-40 rounded-xl overflow-hidden bg-stone-900 border border-stone-800 relative">
              <Image
                src={uploadedUrl || menuItems.find((m) => m.id === selectedItem)?.image || "/meals/placeholder.webp"}
                alt="Current"
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
            {uploadedUrl && <p className="text-xs text-green-400 mt-1">New photo live!</p>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-stone-300 mb-2">Choose new photo</label>
            <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-dashed border-stone-700 hover:border-orange-500 px-6 py-4 transition-colors w-fit">
              <Upload className="h-5 w-5 text-orange-400" />
              <span className="text-sm text-stone-300">Select image (max 10MB)</span>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </label>
            {preview && (
              <div className="mt-4">
                <p className="text-xs text-stone-500 mb-2">Preview:</p>
                <div className="w-40 h-40 rounded-xl overflow-hidden bg-stone-900 border border-orange-500/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleUpload}
              disabled={!preview || uploading}
              className="flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> : <Upload className="h-4 w-4" />}
              {uploading ? "Uploading..." : "Upload & Replace"}
            </button>
            <button
              onClick={handleRollback}
              disabled={uploading}
              className="flex items-center gap-2 rounded-lg border border-stone-700 px-6 py-3 text-sm font-medium text-stone-300 hover:border-orange-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Undo Last Change
            </button>
          </div>
        </>
      )}

      {message && (
        <div className={`mt-6 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${message.type === "success" ? "bg-green-900/30 border border-green-800 text-green-300" : "bg-red-900/30 border border-red-800 text-red-300"}`}>
          {message.type === "success" ? <Check className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          {message.text}
        </div>
      )}
    </div>
  );
}

// ── Pricing Tab ────────────────────────────────────────────
function PricingTab({ password }: { password: string }) {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [changed, setChanged] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [search, setSearch] = useState("");

  // Load current overrides on mount
  useEffect(() => {
    const priceMap: Record<string, number> = {};
    menuItems.forEach((item) => {
      priceMap[item.id] = item.price;
    });
    setPrices(priceMap);

    fetch("/api/pricing")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.overrides) {
          const ov: Record<string, number> = {};
          for (const row of data.overrides) {
            ov[row.menu_item_id] = Number(row.price);
            priceMap[row.menu_item_id] = Number(row.price);
          }
          setOverrides(ov);
          setPrices({ ...priceMap });
        }
      })
      .catch(() => {});
  }, []);

  function handlePriceChange(itemId: string, value: string) {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) return;
    setPrices((prev) => ({ ...prev, [itemId]: num }));
    setChanged((prev) => new Set(prev).add(itemId));
    setMessage(null);
  }

  async function handleSave() {
    if (changed.size === 0) return;
    setSaving(true);
    setMessage(null);

    const updates = Array.from(changed).map((id) => ({
      menuItemId: id,
      price: prices[id],
    }));

    try {
      const res = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, updates }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: data.message });
        // Update overrides state
        const newOverrides = { ...overrides };
        for (const u of updates) {
          newOverrides[u.menuItemId] = u.price;
        }
        setOverrides(newOverrides);
        setChanged(new Set());
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to save prices" });
    } finally {
      setSaving(false);
    }
  }

  async function handleReset(itemId: string) {
    try {
      const res = await fetch("/api/pricing", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, menuItemId: itemId }),
      });
      const data = await res.json();
      if (data.success) {
        // Revert to static price
        const original = menuItems.find((m) => m.id === itemId)?.price || 0;
        setPrices((prev) => ({ ...prev, [itemId]: original }));
        setOverrides((prev) => {
          const next = { ...prev };
          delete next[itemId];
          return next;
        });
        setChanged((prev) => {
          const next = new Set(prev);
          next.delete(itemId);
          return next;
        });
        setMessage({ type: "success", text: `Reset ${itemId} to default` });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to reset price" });
    }
  }

  const filtered = menuItems.filter(
    (item) =>
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  // Group by category
  const categories = Array.from(new Set(filtered.map((i) => i.category)));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-stone-400 text-sm">
          Edit prices live — changes apply immediately
        </p>
        <button
          onClick={handleSave}
          disabled={changed.size === 0 || saving}
          className="flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? (
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : `Save ${changed.size > 0 ? `(${changed.size})` : ""}`}
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search dishes..."
        className="w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-2.5 text-sm text-white placeholder:text-stone-500 focus:border-orange-500 focus:outline-none mb-6"
      />

      {/* Price list by category */}
      {categories.map((cat) => (
        <div key={cat} className="mb-6">
          <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-3">
            {cat.replace("-", " & ").replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}
          </h3>
          <div className="space-y-2">
            {filtered
              .filter((item) => item.category === cat)
              .map((item) => {
                const isOverridden = item.id in overrides;
                const isChanged = changed.has(item.id);
                const currentPrice = prices[item.id] ?? item.price;

                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                      isChanged
                        ? "bg-orange-900/20 border border-orange-800/50"
                        : "bg-stone-900 border border-stone-800"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-800 relative shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {item.name}
                      </p>
                      {isOverridden && !isChanged && (
                        <p className="text-xs text-orange-400">
                          Custom price (default: {formatPrice(menuItems.find((m) => m.id === item.id)?.price || 0)})
                        </p>
                      )}
                      {item.servings && (
                        <p className="text-xs text-stone-500">{item.servings}</p>
                      )}
                    </div>

                    {/* Price input */}
                    <div className="flex items-center gap-2">
                      <span className="text-stone-400 text-sm">£</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={currentPrice}
                        onChange={(e) =>
                          handlePriceChange(item.id, e.target.value)
                        }
                        className={`w-20 rounded-lg border px-3 py-2 text-sm text-right font-mono focus:outline-none transition-colors ${
                          isChanged
                            ? "border-orange-500 bg-orange-950/50 text-orange-300"
                            : "border-stone-700 bg-stone-800 text-white focus:border-orange-500"
                        }`}
                      />
                      {isOverridden && (
                        <button
                          onClick={() => handleReset(item.id)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-orange-400 hover:bg-stone-800 transition-colors"
                          title="Reset to default price"
                        >
                          <Undo2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}

      {message && (
        <div className={`mt-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${message.type === "success" ? "bg-green-900/30 border border-green-800 text-green-300" : "bg-red-900/30 border border-red-800 text-red-300"}`}>
          {message.type === "success" ? <Check className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          {message.text}
        </div>
      )}

      <div className="mt-8 rounded-xl border border-stone-800 bg-stone-900/50 p-6 text-sm text-stone-400">
        <p className="font-medium text-stone-300 mb-2">How pricing works:</p>
        <ul className="space-y-1.5 list-disc list-inside">
          <li>Edit any price and click <strong className="text-stone-300">Save</strong> — changes are live immediately</li>
          <li>Changed prices are highlighted in orange until saved</li>
          <li>Custom prices show a <strong className="text-stone-300">reset</strong> button to revert to the default</li>
          <li>Prices are stored in the database — no code changes needed</li>
          <li>The menu page automatically shows updated prices</li>
        </ul>
      </div>
    </div>
  );
}
