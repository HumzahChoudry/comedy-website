import { getPhotos } from "@/lib/data";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function PhotosPage() {
  const photos = await getPhotos();

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen bg-black">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-white mb-2 text-center">Photos</h1>
        <div className="w-12 h-1 bg-yellow-400 mx-auto mb-12"></div>

        {photos.length === 0 ? (
          <p className="text-center text-gray-500">No photos yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-900"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {photo.caption && (
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-white text-sm font-medium">{photo.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
