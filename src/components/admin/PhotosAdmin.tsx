"use client";

import { useState, useRef } from "react";
import { Photo } from "@/types";
import Image from "next/image";

interface Props {
  initialPhotos: Photo[];
}

export default function PhotosAdmin({ initialPhotos }: Props) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const files = fileRef.current?.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadMsg("");

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("photos", files[i]);
    }
    // Get caption from form
    const captionInput = e.currentTarget.querySelector<HTMLInputElement>('[name="caption"]');
    if (captionInput?.value) formData.append("caption", captionInput.value);

    const res = await fetch("/api/admin/photos/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = (await res.json()) as { photos: Photo[] };
      setPhotos((prev) => [...data.photos, ...prev]);
      setUploadMsg(`${data.photos.length} photo(s) uploaded successfully!`);
      if (fileRef.current) fileRef.current.value = "";
      if (captionInput) captionInput.value = "";
    } else {
      setUploadMsg("Upload failed. Please try again.");
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this photo?")) return;
    const res = await fetch(`/api/admin/photos/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Manage Photos</h2>

      {/* Upload Form */}
      <div className="bg-zinc-900 rounded-xl p-6 border border-white/5 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Upload New Photos</h3>
        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Select Photos (JPG, PNG, WEBP — multiple allowed)
            </label>
            <input
              ref={fileRef}
              type="file"
              name="photos"
              accept="image/*"
              multiple
              required
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-400 file:text-black hover:file:bg-yellow-300 cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Caption (optional, applies to all selected)</label>
            <input
              type="text"
              name="caption"
              placeholder="e.g. Live at The Comedy Store"
              className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 text-sm"
            />
          </div>
          {uploadMsg && (
            <p className={`text-sm ${uploadMsg.includes("failed") ? "text-red-400" : "text-green-400"}`}>
              {uploadMsg}
            </p>
          )}
          <div>
            <button
              type="submit"
              disabled={uploading}
              className="bg-yellow-400 text-black font-bold py-2 px-6 rounded-full text-sm hover:bg-yellow-300 transition-colors disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload Photos"}
            </button>
          </div>
        </form>
      </div>

      {/* Photos Grid */}
      <h3 className="text-lg font-semibold text-white mb-4">
        Current Photos ({photos.length})
      </h3>
      {photos.length === 0 ? (
        <p className="text-gray-500">No photos yet. Upload some above!</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative aspect-square bg-zinc-900 rounded-xl overflow-hidden">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
                onError={() => {}}
              />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                <p className="text-white text-xs text-center line-clamp-2">{photo.caption || photo.alt}</p>
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-1.5 px-4 rounded-full transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
