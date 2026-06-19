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
  Eye,
  EyeOff,
  ToggleLeft,
  Package,
} from "lucide-react";
import { menuItems, formatPrice } from "@/lib/menu-data";
import { hireItems } from "@/lib/hire-data";

type Tab = "photos" | "hire-photos" | "pricing" | "availability";

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
            <h1 className="text-lg font-bold text-white">KOK Kitchens Admin</h1>
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
          <h1 className="text-2xl font-bold">KOK Kitchens Admin</h1>
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
            onClick={() => setActiveTab("hire-photos")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-colors ${
              activeTab === "hire-photos"
                ? "bg-orange-600 text-white"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <Package className="h-4 w-4" />
            Hire
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
          <button
            onClick={() => setActiveTab("availability")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-colors ${
              activeTab === "availability"
                ? "bg-orange-600 text-white"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <ToggleLeft className="h-4 w-4" />
            Availability
          </button>
        </div>

        {activeTab === "photos" && <PhotosTab password={password} items={menuItems} type="meals" />}
        {activeTab === "hire-photos" && <PhotosTab password={password} items={hireItems} type="hire" />}
        {activeTab === "pricing" && <PricingTab password={password} />}
        {activeTab === "availability" && <AvailabilityTab password={password} />}
      </div>
    </div>
  );
}

// ── Photos Tab (menu dishes or hire items) ─────────────────
function PhotosTab({
  password,
  items,
  type,
}: {
  password: string;
  items: { id: string; name: string; category?: string; image?: string }[];
  type: "meals" | "hire";
}) {
  const noun = type === "hire" ? "hire item" : "dish";
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
    formData.append("type", type);
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
        body: JSON.stringify({ password, menuItemId: selectedItem, type }),
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
        Upload {noun} photos — auto-optimized to WebP
      </p>

      <div className="mb-6">
        <label className="block text-sm font-medium text-stone-300 mb-2">
          Select {noun} to update
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
          <option value="">Choose a {noun}...</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}{item.category ? ` — ${item.category}` : ""}
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
                src={uploadedUrl || items.find((m) => m.id === selectedItem)?.image || "/meals/placeholder.webp"}
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

// ── Availability Tab ──────────────────────────────────────
type ItemStatus = "available" | "unavailable" | "hidden";

const STATUS_CONFIG: Record<ItemStatus, { label: string; color: string; bgRow: string; icon: typeof Eye }> = {
  available: { label: "Available", color: "text-green-400", bgRow: "bg-stone-900 border-stone-800", icon: Eye },
  unavailable: { label: "Unavailable", color: "text-amber-400", bgRow: "bg-amber-950/20 border-amber-900/30", icon: EyeOff },
  hidden: { label: "Hidden", color: "text-red-400", bgRow: "bg-red-950/20 border-red-900/30", icon: EyeOff },
};

function AvailabilityTab({ password }: { password: string }) {
  const [statuses, setStatuses] = useState<Record<string, ItemStatus>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [search, setSearch] = useState("");

  // Load current availability on mount
  useEffect(() => {
    fetch("/api/availability")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.items) {
          const map: Record<string, ItemStatus> = {};
          for (const row of data.items) {
            map[row.menu_item_id as string] = row.status as ItemStatus;
          }
          setStatuses(map);
        }
      })
      .catch(() => {});
  }, []);

  function getStatus(itemId: string): ItemStatus {
    return statuses[itemId] || "available";
  }

  function nextStatus(current: ItemStatus): ItemStatus {
    // Cycle: available → unavailable → hidden → available
    if (current === "available") return "unavailable";
    if (current === "unavailable") return "hidden";
    return "available";
  }

  async function setItemStatus(itemId: string, newStatus: ItemStatus) {
    setSaving(itemId);
    setMessage(null);

    try {
      const res = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          updates: [{ menuItemId: itemId, status: newStatus }],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatuses((prev) => {
          const next = { ...prev };
          if (newStatus === "available") {
            delete next[itemId];
          } else {
            next[itemId] = newStatus;
          }
          return next;
        });
        const item = menuItems.find((m) => m.id === itemId);
        const labels: Record<ItemStatus, string> = {
          available: "available",
          unavailable: "temporarily unavailable (greyed out on menu)",
          hidden: "hidden (removed from menu)",
        };
        setMessage({
          type: "success",
          text: `${item?.name || itemId} is now ${labels[newStatus]}`,
        });
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to update availability" });
    } finally {
      setSaving(null);
    }
  }

  const filtered = menuItems.filter(
    (item) =>
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories = Array.from(new Set(filtered.map((i) => i.category)));
  const unavailableCount = Object.values(statuses).filter((s) => s === "unavailable").length;
  const hiddenCount = Object.values(statuses).filter((s) => s === "hidden").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <p className="text-stone-400 text-sm">
          Control which items customers can see and order
        </p>
        <div className="flex gap-2">
          {unavailableCount > 0 && (
            <span className="text-xs font-medium text-amber-400 bg-amber-900/30 border border-amber-800/50 px-3 py-1.5 rounded-full">
              {unavailableCount} unavailable
            </span>
          )}
          {hiddenCount > 0 && (
            <span className="text-xs font-medium text-red-400 bg-red-900/30 border border-red-800/50 px-3 py-1.5 rounded-full">
              {hiddenCount} hidden
            </span>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-xs text-stone-400">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /> Available — normal, orderable</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Unavailable — greyed out, visible but can&apos;t order</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Hidden — completely removed from menu</span>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search dishes..."
        className="w-full rounded-lg border border-stone-700 bg-stone-900 px-4 py-2.5 text-sm text-white placeholder:text-stone-500 focus:border-orange-500 focus:outline-none mb-6"
      />

      {/* Items by category */}
      {categories.map((cat) => (
        <div key={cat} className="mb-6">
          <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-3">
            {cat.replace("-", " & ").replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}
          </h3>
          <div className="space-y-2">
            {filtered
              .filter((item) => item.category === cat)
              .map((item) => {
                const status = getStatus(item.id);
                const config = STATUS_CONFIG[status];
                const isSaving = saving === item.id;

                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors border ${config.bgRow}`}
                  >
                    {/* Thumbnail */}
                    <div className={`w-10 h-10 rounded-lg overflow-hidden bg-stone-800 relative shrink-0 ${status !== "available" ? "grayscale opacity-50" : ""}`}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>

                    {/* Name & price */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${status !== "available" ? "text-stone-500" : "text-white"} ${status === "hidden" ? "line-through" : ""}`}>
                        {item.name}
                      </p>
                      <p className="text-xs text-stone-500">
                        {formatPrice(item.price)}
                        {item.servings ? ` · ${item.servings}` : ""}
                      </p>
                    </div>

                    {/* Status badge (desktop) */}
                    <span className={`hidden sm:inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${config.color} ${status === "available" ? "bg-green-900/30" : status === "unavailable" ? "bg-amber-900/30" : "bg-red-900/30"}`}>
                      <config.icon className="h-3 w-3" />
                      {config.label}
                    </span>

                    {/* Status dot (mobile) */}
                    <span className={`sm:hidden w-2.5 h-2.5 rounded-full shrink-0 ${status === "available" ? "bg-green-500" : status === "unavailable" ? "bg-amber-500" : "bg-red-500"}`} />

                    {/* 3-way toggle buttons */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => setItemStatus(item.id, "available")}
                        disabled={isSaving || status === "available"}
                        title="Make available"
                        className={`p-2 rounded-lg transition-colors disabled:opacity-30 ${status === "available" ? "bg-green-600/20 text-green-400" : "text-stone-500 hover:text-green-400 hover:bg-green-900/30"}`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setItemStatus(item.id, "unavailable")}
                        disabled={isSaving || status === "unavailable"}
                        title="Mark temporarily unavailable"
                        className={`p-2 rounded-lg transition-colors disabled:opacity-30 ${status === "unavailable" ? "bg-amber-600/20 text-amber-400" : "text-stone-500 hover:text-amber-400 hover:bg-amber-900/30"}`}
                      >
                        {isSaving && saving === item.id ? (
                          <span className="block animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => setItemStatus(item.id, "hidden")}
                        disabled={isSaving || status === "hidden"}
                        title="Hide from menu"
                        className={`p-2 rounded-lg transition-colors disabled:opacity-30 ${status === "hidden" ? "bg-red-600/20 text-red-400" : "text-stone-500 hover:text-red-400 hover:bg-red-900/30"}`}
                      >
                        <EyeOff className="h-4 w-4" />
                      </button>
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
        <p className="font-medium text-stone-300 mb-2">How availability works:</p>
        <ul className="space-y-1.5 list-disc list-inside">
          <li><strong className="text-green-400">Available</strong> — dish is on the menu and customers can order it (default)</li>
          <li><strong className="text-amber-400">Unavailable</strong> — dish stays on the menu but shows &quot;Temporarily Unavailable&quot; with a greyed-out photo. Customers can see it but can&apos;t add to cart. Use when you&apos;ve run out of an ingredient.</li>
          <li><strong className="text-red-400">Hidden</strong> — dish is completely removed from the menu. Customers won&apos;t see it at all. Use for seasonal items or dishes you&apos;ve discontinued.</li>
          <li>All changes are <strong className="text-stone-300">instant</strong> — no deploy or developer needed</li>
          <li>Tap the <Eye className="h-3 w-3 inline" /> icon to make available, <EyeOff className="h-3 w-3 inline" /> for unavailable or hidden</li>
        </ul>
      </div>
    </div>
  );
}
