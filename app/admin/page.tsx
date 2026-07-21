"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import type { CustomItem } from "@/lib/custom-items";
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
  Boxes,
  Plus,
  Trash2,
  UtensilsCrossed,
  Flame,
} from "lucide-react";
import { menuItems, formatPrice } from "@/lib/menu-data";
import {
  hireItems,
  HIRE_CATEGORY_LABELS,
  HIRE_CATEGORY_ORDER,
} from "@/lib/hire-data";

import type { Category } from "@/lib/types";

type Tab = "photos" | "hire-photos" | "pricing" | "availability" | "hire-stock" | "menu";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("photos");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Verify the password up front so a wrong (or whitespace-padded) one is caught
  // here — where the field is — instead of letting the user in to fail later on
  // every action with a confusing "Invalid password".
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setPassword(password.trim()); // send the clean value to later actions
        setAuthenticated(true);
      } else {
        setLoginError(data.message || "Invalid password");
      }
    } catch {
      setLoginError("Couldn't verify password — check your connection and try again.");
    } finally {
      setLoggingIn(false);
    }
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
            onChange={(e) => { setPassword(e.target.value); setLoginError(null); }}
            placeholder="Enter admin password"
            aria-label="Admin password"
            autoComplete="current-password"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className="w-full rounded-lg border border-stone-700 bg-stone-800 px-4 py-3 text-white placeholder:text-stone-500 focus:border-orange-500 focus:outline-none"
            required
          />
          {loginError && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-900/30 border border-red-800 px-4 py-2.5 text-sm text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {loginError}
            </div>
          )}
          <button
            type="submit"
            disabled={loggingIn}
            className="mt-4 w-full rounded-lg bg-orange-600 py-3 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-50 transition-colors"
          >
            {loggingIn ? "Verifying…" : "Sign In"}
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

        {/* Tabs — two rows on mobile for legibility */}
        <div className="flex flex-wrap gap-1 mb-8 bg-stone-900 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("menu")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-colors ${
              activeTab === "menu"
                ? "bg-orange-600 text-white"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <UtensilsCrossed className="h-4 w-4" />
            Menu
          </button>
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
          <button
            onClick={() => setActiveTab("hire-stock")}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-colors ${
              activeTab === "hire-stock"
                ? "bg-orange-600 text-white"
                : "text-stone-400 hover:text-white"
            }`}
          >
            <Boxes className="h-4 w-4" />
            Hire stock
          </button>
        </div>

        {activeTab === "menu" && <CustomItemsTab password={password} />}
        {activeTab === "photos" && <PhotosTab password={password} items={menuItems} type="meals" />}
        {activeTab === "hire-photos" && <PhotosTab password={password} items={hireItems} type="hire" />}
        {activeTab === "pricing" && <PricingTab password={password} />}
        {activeTab === "availability" && <AvailabilityTab password={password} />}
        {activeTab === "hire-stock" && <HireStockTab password={password} />}
      </div>
    </div>
  );
}

// ── Custom Menu Items Tab ──────────────────────────────────
const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: "rice-dishes", label: "Rice Dishes" },
  { value: "soups-swallows", label: "Soups & Swallows" },
  { value: "grills-proteins", label: "Grills & Proteins" },
  { value: "sides", label: "Sides" },
  { value: "snacks", label: "Snacks" },
  { value: "drinks", label: "Drinks" },
  { value: "party-packs", label: "Party Packs" },
];

// CustomItem now comes from the shared data layer (@/lib/custom-items).

function CustomItemsTab({ password }: { password: string }) {
  const [items, setItems] = useState<CustomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<Category>("rice-dishes");
  const [spicy, setSpicy] = useState(false);
  const [servings, setServings] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function loadItems() {
    setLoading(true);
    fetch("/api/custom-items")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setItems(data.items || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { loadItems(); }, []);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Please select an image file" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image too large (max 10 MB)" });
      return;
    }
    setPreview(URL.createObjectURL(file));
    setMessage(null);
  }

  function resetForm() {
    setName("");
    setDescription("");
    setPrice("");
    setCategory("rice-dishes");
    setSpicy(false);
    setServings("");
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !price) return;
    setSaving(true);
    setMessage(null);

    const form = new FormData();
    form.append("password", password);
    form.append("name", name.trim());
    form.append("description", description.trim());
    form.append("price", price);
    form.append("category", category);
    form.append("spicy", String(spicy));
    if (servings.trim()) form.append("servings", servings.trim());
    const file = fileRef.current?.files?.[0];
    if (file) form.append("image", file);

    try {
      const res = await fetch("/api/custom-items", { method: "POST", body: form });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: data.message });
        resetForm();
        loadItems();
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to add item" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(itemId: string, itemName: string) {
    if (!confirm(`Remove "${itemName}" from the menu?`)) return;
    setDeleting(itemId);
    setMessage(null);
    try {
      const res = await fetch("/api/custom-items", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, itemId }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: data.message });
        setItems((prev) => prev.filter((i) => i.id !== itemId));
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to remove item" });
    } finally {
      setDeleting(null);
    }
  }

  const catLabel = (val: string) =>
    CATEGORY_OPTIONS.find((c) => c.value === val)?.label ?? val;

  return (
    <div>
      <p className="text-stone-400 text-sm mb-6">
        Add your own dishes to the menu — they appear alongside the standard items
      </p>

      {/* ── Add Item Form ── */}
      <form onSubmit={handleAdd} className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 mb-8">
        <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add new item
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Name */}
          <div>
            <label htmlFor="ci-name" className="block text-xs font-medium text-stone-400 mb-1">
              Name *
            </label>
            <input
              id="ci-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chin Chin"
              required
              className="w-full rounded-lg border border-stone-700 bg-stone-800 px-4 py-2.5 text-sm text-white placeholder:text-stone-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="ci-price" className="block text-xs font-medium text-stone-400 mb-1">
              Price (£) *
            </label>
            <input
              id="ci-price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              required
              className="w-full rounded-lg border border-stone-700 bg-stone-800 px-4 py-2.5 text-sm text-white placeholder:text-stone-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="ci-category" className="block text-xs font-medium text-stone-400 mb-1">
              Category *
            </label>
            <select
              id="ci-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full rounded-lg border border-stone-700 bg-stone-800 px-4 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Servings */}
          <div>
            <label htmlFor="ci-servings" className="block text-xs font-medium text-stone-400 mb-1">
              Servings (optional)
            </label>
            <input
              id="ci-servings"
              type="text"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              placeholder="e.g. Small tray — serves 4-6"
              className="w-full rounded-lg border border-stone-700 bg-stone-800 px-4 py-2.5 text-sm text-white placeholder:text-stone-500 focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="ci-desc" className="block text-xs font-medium text-stone-400 mb-1">
            Description (optional)
          </label>
          <textarea
            id="ci-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Short description for the dish detail page"
            className="w-full rounded-lg border border-stone-700 bg-stone-800 px-4 py-2.5 text-sm text-white placeholder:text-stone-500 focus:border-orange-500 focus:outline-none resize-none"
          />
        </div>

        {/* Spicy + Image row */}
        <div className="flex flex-wrap items-end gap-4 mb-4">
          {/* Spicy toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={spicy}
              onChange={(e) => setSpicy(e.target.checked)}
              className="sr-only peer"
            />
            <div className={`w-9 h-5 rounded-full transition-colors ${spicy ? "bg-orange-600" : "bg-stone-700"} relative`}>
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${spicy ? "translate-x-4" : ""}`} />
            </div>
            <Flame className={`h-4 w-4 ${spicy ? "text-orange-400" : "text-stone-500"}`} />
            <span className="text-sm text-stone-300">Spicy</span>
          </label>

          {/* Image upload */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-stone-400 mb-1">
              Photo (optional)
            </label>
            <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-dashed border-stone-700 hover:border-orange-500 px-4 py-2.5 transition-colors w-fit">
              <Upload className="h-4 w-4 text-orange-400" />
              <span className="text-xs text-stone-300">
                {preview ? "Change image" : "Select image (max 10 MB)"}
              </span>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            </label>
          </div>

          {preview && (
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-800 border border-orange-500/30 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={saving || !name.trim() || !price}
          className="flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? (
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {saving ? "Adding…" : "Add to Menu"}
        </button>
      </form>

      {/* ── Existing Custom Items ── */}
      <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-3">
        Custom items ({items.length})
      </h3>

      {loading ? (
        <p className="text-sm text-stone-500">Loading…</p>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-stone-800 bg-stone-900/50 px-6 py-8 text-center">
          <UtensilsCrossed className="h-8 w-8 text-stone-700 mx-auto mb-2" />
          <p className="text-sm text-stone-500">No custom items yet — add one above</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-xl px-4 py-3 border border-stone-800 bg-stone-900"
            >
              {/* Thumbnail */}
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-800 relative shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UtensilsCrossed className="h-4 w-4 text-stone-600" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {item.name}
                  {item.spicy && <Flame className="inline h-3.5 w-3.5 text-orange-400 ml-1" />}
                </p>
                <p className="text-xs text-stone-500">
                  {formatPrice(item.price)} · {catLabel(item.category)}
                  {item.servings ? ` · ${item.servings}` : ""}
                </p>
              </div>

              {/* Delete */}
              <button
                onClick={() => handleDelete(item.id, item.name)}
                disabled={deleting === item.id}
                className="p-2 rounded-lg text-stone-500 hover:text-red-400 hover:bg-red-900/20 disabled:opacity-30 transition-colors"
                title={`Remove ${item.name}`}
              >
                {deleting === item.id ? (
                  <span className="block animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {message && (
        <div className={`mt-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${message.type === "success" ? "bg-green-900/30 border border-green-800 text-green-300" : "bg-red-900/30 border border-red-800 text-red-300"}`}>
          {message.type === "success" ? <Check className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          {message.text}
        </div>
      )}

      <div className="mt-8 rounded-xl border border-stone-800 bg-stone-900/50 p-6 text-sm text-stone-400">
        <p className="font-medium text-stone-300 mb-2">How custom items work:</p>
        <ul className="space-y-1.5 list-disc list-inside">
          <li>Items you add here appear on the menu alongside the standard dishes</li>
          <li>Each item gets its own detail page at <strong className="text-stone-300">kokkitchens.com/menu/[name]</strong></li>
          <li>Upload a photo or leave blank — a placeholder will be shown</li>
          <li>To remove an item, click the <Trash2 className="h-3 w-3 inline" /> icon</li>
          <li>Changes are <strong className="text-stone-300">instant</strong> — no deploy needed</li>
        </ul>
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
              className="flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
  // Name overrides — the customer-facing name of any item can be renamed
  // without a code deploy (previously required editing lib/menu-data.ts).
  const [names, setNames] = useState<Record<string, string>>({});
  const [nameOverrides, setNameOverrides] = useState<Record<string, string>>({});
  const [changedNames, setChangedNames] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [search, setSearch] = useState("");

  // Load current overrides on mount — fetch prices and names in parallel.
  useEffect(() => {
    const priceMap: Record<string, number> = {};
    const nameMap: Record<string, string> = {};
    menuItems.forEach((item) => {
      priceMap[item.id] = item.price;
      nameMap[item.id] = item.name;
    });
    setPrices(priceMap);
    setNames(nameMap);

    Promise.all([
      fetch("/api/pricing").then((r) => r.json()).catch(() => null),
      fetch("/api/names").then((r) => r.json()).catch(() => null),
    ]).then(([priceData, nameData]) => {
      if (priceData?.success && priceData.overrides) {
        const ov: Record<string, number> = {};
        for (const row of priceData.overrides) {
          ov[row.menu_item_id] = Number(row.price);
          priceMap[row.menu_item_id] = Number(row.price);
        }
        setOverrides(ov);
        setPrices({ ...priceMap });
      }
      if (nameData?.success && nameData.overrides) {
        const ov: Record<string, string> = {};
        for (const row of nameData.overrides) {
          ov[row.menu_item_id] = String(row.name);
          nameMap[row.menu_item_id] = String(row.name);
        }
        setNameOverrides(ov);
        setNames({ ...nameMap });
      }
    });
  }, []);

  function handlePriceChange(itemId: string, value: string) {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) return;
    setPrices((prev) => ({ ...prev, [itemId]: num }));
    setChanged((prev) => new Set(prev).add(itemId));
    setMessage(null);
  }

  function handleNameChange(itemId: string, value: string) {
    setNames((prev) => ({ ...prev, [itemId]: value }));
    setChangedNames((prev) => new Set(prev).add(itemId));
    setMessage(null);
  }

  async function handleSave() {
    if (changed.size === 0 && changedNames.size === 0) return;
    setSaving(true);
    setMessage(null);

    const priceUpdates = Array.from(changed).map((id) => ({
      menuItemId: id,
      price: prices[id],
    }));
    const nameUpdates = Array.from(changedNames)
      .map((id) => ({ menuItemId: id, name: names[id]?.trim() ?? "" }))
      .filter((u) => u.name.length > 0);

    try {
      const calls: Promise<Response>[] = [];
      if (priceUpdates.length > 0) {
        calls.push(
          fetch("/api/pricing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password, updates: priceUpdates }),
          }),
        );
      }
      if (nameUpdates.length > 0) {
        calls.push(
          fetch("/api/names", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password, updates: nameUpdates }),
          }),
        );
      }
      const responses = await Promise.all(calls);
      const results = await Promise.all(responses.map((r) => r.json()));
      const allOk = results.every((d) => d.success);
      if (allOk) {
        setMessage({
          type: "success",
          text: results.map((d) => d.message).join(" · "),
        });
        const newPriceOverrides = { ...overrides };
        for (const u of priceUpdates) newPriceOverrides[u.menuItemId] = u.price;
        setOverrides(newPriceOverrides);
        const newNameOverrides = { ...nameOverrides };
        for (const u of nameUpdates) newNameOverrides[u.menuItemId] = u.name;
        setNameOverrides(newNameOverrides);
        setChanged(new Set());
        setChangedNames(new Set());
      } else {
        const failing = results.find((d) => !d.success);
        setMessage({ type: "error", text: failing?.message || "Save failed" });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to save changes" });
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

  async function handleNameReset(itemId: string) {
    try {
      const res = await fetch("/api/names", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, menuItemId: itemId }),
      });
      const data = await res.json();
      if (data.success) {
        const original = menuItems.find((m) => m.id === itemId)?.name || "";
        setNames((prev) => ({ ...prev, [itemId]: original }));
        setNameOverrides((prev) => {
          const next = { ...prev };
          delete next[itemId];
          return next;
        });
        setChangedNames((prev) => {
          const next = new Set(prev);
          next.delete(itemId);
          return next;
        });
        setMessage({ type: "success", text: `Reset ${itemId} name to default` });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to reset name" });
    }
  }

  const filtered = menuItems.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const currentName = names[item.id] ?? item.name;
    return (
      item.name.toLowerCase().includes(q) ||
      currentName.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  // Group by category
  const categories = Array.from(new Set(filtered.map((i) => i.category)));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-stone-400 text-sm">
          Rename dishes and edit prices live — changes apply immediately
        </p>
        <button
          onClick={handleSave}
          disabled={(changed.size === 0 && changedNames.size === 0) || saving}
          className="flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? (
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving
            ? "Saving..."
            : `Save ${changed.size + changedNames.size > 0 ? `(${changed.size + changedNames.size})` : ""}`}
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
                const isNameOverridden = item.id in nameOverrides;
                const isNameChanged = changedNames.has(item.id);
                const currentName = names[item.id] ?? item.name;
                const rowHighlight = isChanged || isNameChanged;

                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                      rowHighlight
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

                    {/* Name (editable) */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={currentName}
                          onChange={(e) => handleNameChange(item.id, e.target.value)}
                          aria-label={`Name for ${item.name}`}
                          className={`w-full rounded-lg border px-3 py-1.5 text-sm text-white focus:outline-none transition-colors ${
                            isNameChanged
                              ? "border-orange-500 bg-orange-950/50"
                              : "border-stone-700 bg-stone-800 focus:border-orange-500"
                          }`}
                        />
                        {isNameOverridden && (
                          <button
                            onClick={() => handleNameReset(item.id)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-orange-400 hover:bg-stone-800 transition-colors shrink-0"
                            title="Reset to default name"
                          >
                            <Undo2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                      {isOverridden && !isChanged && (
                        <p className="mt-1 text-xs text-orange-400">
                          Custom price (default: {formatPrice(menuItems.find((m) => m.id === item.id)?.price || 0)})
                        </p>
                      )}
                      {isNameOverridden && !isNameChanged && (
                        <p className="mt-1 text-xs text-orange-400">
                          Custom name (default: {menuItems.find((m) => m.id === item.id)?.name})
                        </p>
                      )}
                      {item.servings && (
                        <p className="mt-1 text-xs text-stone-500">{item.servings}</p>
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
        <p className="font-medium text-stone-300 mb-2">How this tab works:</p>
        <ul className="space-y-1.5 list-disc list-inside">
          <li>Edit any <strong className="text-stone-300">name</strong> or <strong className="text-stone-300">price</strong> and click <strong className="text-stone-300">Save</strong> — changes are live immediately</li>
          <li>Changed rows are highlighted in orange until saved</li>
          <li>Custom names or prices show a <strong className="text-stone-300">reset</strong> button to revert to the default</li>
          <li>Both are stored in the database — no code changes needed</li>
          <li>The menu page automatically shows the updated names and prices</li>
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

// ── Hire Stock Tab (inventory counts + bookings) ───────────
interface HireBookingAdmin {
  id: number;
  ref: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  hireOutDate: string;
  returnDate: string;
  items: { item_id: string; quantity: number }[];
  status: string;
  holdExpiresAt: string | null;
  createdAt: string | null;
}

const BOOKING_STATUSES = ["enquiry", "confirmed", "out", "returned", "closed", "cancelled"];

function HireStockTab({ password }: { password: string }) {
  const [inventory, setInventory] = useState<Record<string, number>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [bookings, setBookings] = useState<HireBookingAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingItem, setSavingItem] = useState<string | null>(null);
  const [savingBooking, setSavingBooking] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const nameById = useMemo(
    () => Object.fromEntries(hireItems.map((i) => [i.id, i.name])) as Record<string, string>,
    []
  );

  function reload() {
    setLoading(true);
    fetch("/api/hire-admin", { headers: { "x-admin-password": password } })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setInventory(d.inventory || {});
          setBookings(d.bookings || []);
          if (d.warning) setMessage({ type: "error", text: d.warning });
        } else {
          setMessage({ type: "error", text: d.message || "Failed to load" });
        }
      })
      .catch(() => setMessage({ type: "error", text: "Failed to load hire data" }))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  const draftFor = (id: string) => drafts[id] ?? String(inventory[id] ?? 0);
  const isChanged = (id: string) => draftFor(id) !== String(inventory[id] ?? 0);

  async function saveStock(itemId: string) {
    const totalQty = Math.max(0, Math.floor(Number(draftFor(itemId)) || 0));
    setSavingItem(itemId);
    setMessage(null);
    try {
      const res = await fetch("/api/hire-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, op: "setStock", itemId, totalQty }),
      });
      const data = await res.json();
      if (data.success) {
        setInventory((p) => ({ ...p, [itemId]: totalQty }));
        setDrafts((p) => {
          const c = { ...p };
          delete c[itemId];
          return c;
        });
        setMessage({ type: "success", text: `${nameById[itemId]} stock set to ${totalQty}` });
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to save stock" });
    } finally {
      setSavingItem(null);
    }
  }

  async function clearStock(itemId: string) {
    setSavingItem(itemId);
    setMessage(null);
    try {
      const res = await fetch("/api/hire-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, op: "deleteStock", itemId }),
      });
      const data = await res.json();
      if (data.success) {
        setInventory((p) => {
          const c = { ...p };
          delete c[itemId];
          return c;
        });
        setDrafts((p) => {
          const c = { ...p };
          delete c[itemId];
          return c;
        });
        setMessage({ type: "success", text: `${nameById[itemId]} is no longer stock-managed` });
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to clear stock" });
    } finally {
      setSavingItem(null);
    }
  }

  async function setBookingStatus(id: number, status: string) {
    setSavingBooking(id);
    setMessage(null);
    try {
      const res = await fetch("/api/hire-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, op: "setStatus", id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
        setMessage({ type: "success", text: `Booking ${data.id} updated to ${status}` });
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to update booking" });
    } finally {
      setSavingBooking(null);
    }
  }

  const totalUnits = Object.values(inventory).reduce((s, n) => s + n, 0);
  const activeBookings = bookings.filter(
    (b) => !["closed", "cancelled"].includes(b.status)
  ).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <p className="text-stone-400 text-sm">
          Set how many of each item you own — availability is worked out automatically per event date.
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-stone-400 bg-stone-800 px-3 py-1.5 rounded-full">
            {totalUnits} units owned
          </span>
          <button onClick={reload} className="text-xs text-stone-500 hover:text-white">
            Refresh
          </button>
        </div>
      </div>

      {HIRE_CATEGORY_ORDER.map((cat) => {
        const items = hireItems.filter((i) => i.category === cat);
        if (items.length === 0) return null;
        return (
          <div key={cat} className="mb-6">
            <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-3">
              {HIRE_CATEGORY_LABELS[cat]}
            </h3>
            <div className="space-y-2">
              {items.map((item) => {
                const changed = isChanged(item.id);
                const saving = savingItem === item.id;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 border border-stone-800 bg-stone-900/40"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.name}</p>
                      <p className="text-xs text-stone-500">
                        {formatPrice(item.price)}
                        {item.unit ? ` / ${item.unit}` : ""}
                      </p>
                    </div>
                    <label className="sr-only" htmlFor={`stock-${item.id}`}>
                      {item.name} stock
                    </label>
                    <input
                      id={`stock-${item.id}`}
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={draftFor(item.id)}
                      onChange={(e) =>
                        setDrafts((p) => ({ ...p, [item.id]: e.target.value }))
                      }
                      className="w-20 rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-sm text-right text-white focus:border-orange-500 focus:outline-none"
                    />
                    <button
                      onClick={() => saveStock(item.id)}
                      disabled={!changed || saving}
                      className="rounded-lg px-3 py-2 text-xs font-medium transition-colors disabled:opacity-30 bg-orange-600 text-white hover:bg-orange-700"
                    >
                      {saving ? "…" : "Save"}
                    </button>
                    {item.id in inventory && (
                      <button
                        onClick={() => clearStock(item.id)}
                        disabled={saving}
                        title="Stop managing stock for this item"
                        className="rounded-lg px-2 py-2 text-xs font-medium text-stone-500 hover:text-red-400 disabled:opacity-30"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider">Bookings</h3>
          <span className="text-xs text-stone-500">{activeBookings} active</span>
        </div>
        {loading ? (
          <p className="text-sm text-stone-500">Loading…</p>
        ) : bookings.length === 0 ? (
          <p className="text-sm text-stone-500">No hire bookings yet.</p>
        ) : (
          <div className="space-y-2">
            {bookings.map((b) => (
              <div key={b.id} className="rounded-xl px-4 py-3 border border-stone-800 bg-stone-900/40">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">
                      {b.customerName}{" "}
                      <span className="text-stone-500 font-normal">· {b.ref}</span>
                    </p>
                    <p className="text-xs text-stone-500">
                      {b.hireOutDate}
                      {b.returnDate !== b.hireOutDate ? ` → ${b.returnDate}` : ""} ·{" "}
                      <a href={`tel:${b.customerPhone}`} className="hover:text-stone-300">
                        {b.customerPhone}
                      </a>
                    </p>
                  </div>
                  <select
                    value={b.status}
                    disabled={savingBooking === b.id}
                    onChange={(e) => setBookingStatus(b.id, e.target.value)}
                    aria-label={`Status for ${b.ref}`}
                    className="rounded-lg border border-stone-700 bg-stone-900 px-2 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                  >
                    {BOOKING_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-stone-400 mt-1.5">
                  {b.items
                    .map((it) => `${it.quantity}× ${nameById[it.item_id] || it.item_id}`)
                    .join(", ")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {message && (
        <div
          className={`mt-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-green-900/30 border border-green-800 text-green-300"
              : "bg-red-900/30 border border-red-800 text-red-300"
          }`}
        >
          {message.type === "success" ? (
            <Check className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          {message.text}
        </div>
      )}

      <div className="mt-8 rounded-xl border border-stone-800 bg-stone-900/50 p-6 text-sm text-stone-400">
        <p className="font-medium text-stone-300 mb-2">How hire stock works:</p>
        <ul className="space-y-1.5 list-disc list-inside">
          <li>Set how many of each item you own. Customers see live availability for their chosen date.</li>
          <li>Items with no count set are <strong className="text-stone-300">unmanaged</strong> — shown without a stock cap.</li>
          <li>A booking holds stock while it&apos;s <strong className="text-green-400">enquiry</strong> (48h hold), <strong className="text-blue-400">confirmed</strong>, <strong className="text-purple-400">out</strong> or <strong className="text-teal-400">returned</strong>.</li>
          <li>Mark <strong className="text-stone-300">closed</strong> once items are cleaned and restocked; <strong className="text-red-400">cancelled</strong> releases them immediately.</li>
        </ul>
      </div>
    </div>
  );
}
