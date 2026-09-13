"use client";

import { useState } from "react";
import { Video } from "@/types";

// Client-safe version of the thumbnail helper
function getThumb(url: string): string {
  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  const match = url.match(regex);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : "";
}

export default function VideosAdmin({ initialVideos }: { initialVideos: Video[] }) {
  const [videos, setVideos] = useState<Video[]>(initialVideos);
  const [form, setForm] = useState({
    title: "",
    description: "",
    youtubeUrl: "",
    featured: false,
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");

    const res = await fetch("/api/admin/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const data = (await res.json()) as { video: Video };
      setVideos((prev) => [data.video, ...prev]);
      setForm({ title: "", description: "", youtubeUrl: "", featured: false });
      setMsg("Video added successfully!");
    } else {
      setMsg("Failed to add video.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    const res = await fetch(`/api/admin/videos/${id}`, { method: "DELETE" });
    if (res.ok) setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    const res = await fetch(`/api/admin/videos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !featured }),
    });
    if (res.ok) {
      setVideos((prev) =>
        prev.map((v) => (v.id === id ? { ...v, featured: !featured } : v))
      );
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Manage Videos</h2>

      {/* Add Video Form */}
      <div className="bg-zinc-900 rounded-xl p-6 border border-white/5 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Add New Video</h3>
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400 text-sm"
                placeholder="Live at The Comedy Club"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">YouTube URL *</label>
              <input
                type="url"
                required
                value={form.youtubeUrl}
                onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400 text-sm"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400 text-sm resize-none"
              placeholder="Short description..."
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="w-4 h-4 accent-yellow-400"
            />
            <label htmlFor="featured" className="text-sm text-gray-400">
              Feature on homepage
            </label>
          </div>
          {msg && <p className={`text-sm ${msg.includes("Failed") ? "text-red-400" : "text-green-400"}`}>{msg}</p>}
          <div>
            <button
              type="submit"
              disabled={saving}
              className="bg-yellow-400 text-black font-bold py-2 px-6 rounded-full text-sm hover:bg-yellow-300 transition-colors disabled:opacity-50"
            >
              {saving ? "Adding..." : "Add Video"}
            </button>
          </div>
        </form>
      </div>

      {/* Video List */}
      <h3 className="text-lg font-semibold text-white mb-4">Current Videos ({videos.length})</h3>
      {videos.length === 0 ? (
        <p className="text-gray-500">No videos yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {videos.map((video) => {
            const thumb = video.thumbnailUrl || getThumb(video.youtubeUrl);
            return (
              <div key={video.id} className="flex gap-4 items-start bg-zinc-900 rounded-xl p-4 border border-white/5">
                {thumb && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt={video.title} className="w-24 h-14 object-cover rounded-lg flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{video.title}</p>
                  {video.description && <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{video.description}</p>}
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => toggleFeatured(video.id, video.featured)}
                      className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                        video.featured
                          ? "bg-yellow-400/20 text-yellow-400"
                          : "bg-zinc-700 text-gray-400 hover:text-white"
                      }`}
                    >
                      {video.featured ? "★ Featured" : "☆ Set Featured"}
                    </button>
                    <a
                      href={video.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:underline"
                    >
                      View on YouTube
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(video.id)}
                  className="flex-shrink-0 text-gray-600 hover:text-red-400 transition-colors"
                  title="Delete video"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
