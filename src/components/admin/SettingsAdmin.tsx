"use client";

import { useState, useEffect } from "react";
import { SiteConfig } from "@/types";

// NOTE: Field and SocialField are declared OUTSIDE the parent component.
// Declaring them inside SettingsAdmin caused React to treat them as a *new*
// component type on every render (every keystroke), unmounting and remounting
// the inputs and stealing focus. Keeping them at module scope gives them a
// stable identity so the inputs persist across renders and keep focus.
function Field({
  label,
  field,
  placeholder,
  textarea,
  config,
  setConfig,
}: {
  label: string;
  field: keyof Omit<SiteConfig, "socialLinks">;
  placeholder?: string;
  textarea?: boolean;
  config: SiteConfig;
  setConfig: React.Dispatch<React.SetStateAction<SiteConfig | null>>;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      {textarea ? (
        <textarea
          rows={4}
          value={config[field] as string}
          onChange={(e) =>
            setConfig((prev) => (prev ? { ...prev, [field]: e.target.value } : prev))
          }
          className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400 text-sm resize-none"
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
          value={config[field] as string}
          onChange={(e) =>
            setConfig((prev) => (prev ? { ...prev, [field]: e.target.value } : prev))
          }
          className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400 text-sm"
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

function SocialField({
  label,
  field,
  config,
  setConfig,
}: {
  label: string;
  field: keyof SiteConfig["socialLinks"];
  config: SiteConfig;
  setConfig: React.Dispatch<React.SetStateAction<SiteConfig | null>>;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <input
        type="url"
        value={config.socialLinks[field]}
        onChange={(e) =>
          setConfig((prev) =>
            prev
              ? {
                  ...prev,
                  socialLinks: { ...prev.socialLinks, [field]: e.target.value },
                }
              : prev
          )
        }
        className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400 text-sm"
        placeholder={`https://...`}
      />
    </div>
  );
}

export default function SettingsAdmin() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => setConfig(data.config));
  }, []);

  if (!config) return <div>Loading...</div>;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });

    setSaving(false);
    setMsg(res.ok ? "Settings saved successfully!" : "Failed to save settings.");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Site Settings</h2>

      <form onSubmit={handleSave} className="flex flex-col gap-8">
        {/* Basic Info */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-white/5">
          <h3 className="text-lg font-semibold text-white mb-4">Basic Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Comedian Name" field="name" placeholder="Your Name" config={config} setConfig={setConfig} />
            <Field label="Tagline" field="tagline" placeholder="Comedian | Storyteller" config={config} setConfig={setConfig} />
            <Field label="Contact Email" field="contactEmail" placeholder="you@example.com" config={config} setConfig={setConfig} />
            <Field label="Footer Text" field="footerText" placeholder="© 2026 Your Name" config={config} setConfig={setConfig} />
          </div>
          <div className="mt-4">
            <Field label="SEO Description" field="seoDescription" placeholder="Official website of..." config={config} setConfig={setConfig} />
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-white/5">
          <h3 className="text-lg font-semibold text-white mb-4">Homepage Hero</h3>
          <div className="flex flex-col gap-4">
            <Field label="Hero Heading" field="heroHeading" placeholder="Laughs Guaranteed." config={config} setConfig={setConfig} />
            <Field label="Hero Subheading" field="heroSubheading" placeholder="Stand-up comedy that hits different." config={config} setConfig={setConfig} />
            <Field label="Bio / About Text" field="bio" placeholder="Your biography..." textarea config={config} setConfig={setConfig} />
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-white/5">
          <h3 className="text-lg font-semibold text-white mb-4">Social Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SocialField label="Instagram" field="instagram" config={config} setConfig={setConfig} />
            <SocialField label="Twitter / X" field="twitter" config={config} setConfig={setConfig} />
            <SocialField label="YouTube" field="youtube" config={config} setConfig={setConfig} />
            <SocialField label="TikTok" field="tiktok" config={config} setConfig={setConfig} />
            <SocialField label="Facebook" field="facebook" config={config} setConfig={setConfig} />
          </div>
        </div>

        {msg && (
          <p className={`text-sm ${msg.includes("Failed") ? "text-red-400" : "text-green-400"}`}>
            {msg}
          </p>
        )}

        <div>
          <button
            type="submit"
            disabled={saving}
            className="bg-yellow-400 text-black font-bold py-3 px-8 rounded-full text-sm hover:bg-yellow-300 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
