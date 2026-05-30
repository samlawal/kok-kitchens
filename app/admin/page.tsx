"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, RotateCcw, Check, AlertCircle, Lock } from "lucide-react";
import { menuItems } from "@/lib/menu-data";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // Just store the password — the API validates it
    setAuthenticated(true);
  }

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

    const url = URL.createObjectURL(file);
    setPreview(url);
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
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message });
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

      if (data.success) {
        setMessage({ type: "success", text: data.message });
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch {
      setMessage({ type: "error", text: "Rollback failed." });
    } finally {
      setUploading(false);
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
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Photo Manager</h1>
            <p className="text-stone-400 text-sm mt-1">
              Upload new dish photos — auto-optimized to WebP
            </p>
          </div>
          <button
            onClick={() => setAuthenticated(false)}
            className="text-xs text-stone-500 hover:text-stone-300"
          >
            Sign out
          </button>
        </div>

        {/* Step 1: Select dish */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-stone-300 mb-2">
            1. Select dish to update
          </label>
          <select
            value={selectedItem}
            onChange={(e) => {
              setSelectedItem(e.target.value);
              setMessage(null);
              setPreview(null);
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
            {/* Current image */}
            <div className="mb-6">
              <p className="text-sm font-medium text-stone-300 mb-2">
                Current photo
              </p>
              <div className="w-40 h-40 rounded-xl overflow-hidden bg-stone-900 border border-stone-800 relative">
                <Image
                  src={
                    menuItems.find((m) => m.id === selectedItem)?.image ||
                    "/meals/placeholder.webp"
                  }
                  alt="Current"
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </div>
            </div>

            {/* Step 2: Upload new photo */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-300 mb-2">
                2. Choose new photo
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-dashed border-stone-700 hover:border-orange-500 px-6 py-4 transition-colors">
                  <Upload className="h-5 w-5 text-orange-400" />
                  <span className="text-sm text-stone-300">
                    Select image (max 10MB)
                  </span>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>
              </div>

              {preview && (
                <div className="mt-4">
                  <p className="text-xs text-stone-500 mb-2">Preview:</p>
                  <div className="w-40 h-40 rounded-xl overflow-hidden bg-stone-900 border border-orange-500/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Upload or Rollback */}
            <div className="flex gap-3">
              <button
                onClick={handleUpload}
                disabled={!preview || uploading}
                className="flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? (
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
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

        {/* Status message */}
        {message && (
          <div
            className={`mt-6 flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
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

        {/* Info box */}
        <div className="mt-10 rounded-xl border border-stone-800 bg-stone-900/50 p-6 text-sm text-stone-400">
          <p className="font-medium text-stone-300 mb-2">How it works:</p>
          <ul className="space-y-1.5 list-disc list-inside">
            <li>Select a dish, upload any image (JPG, PNG, HEIC from phone)</li>
            <li>
              Image is <strong className="text-stone-300">automatically</strong>{" "}
              resized to 800px and converted to WebP
            </li>
            <li>New photo appears on the website immediately — no deploy needed</li>
            <li>Made a mistake? Hit &quot;Undo Last Change&quot; to revert</li>
            <li>
              Photos are stored in the cloud — they won&apos;t be lost
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
