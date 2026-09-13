import { getVideos, getYouTubeEmbedUrl, getYouTubeThumbnail } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function VideosPage() {
  const videos = await getVideos();
  const featured = videos.filter((v) => v.featured);
  const rest = videos.filter((v) => !v.featured);

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen bg-black">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-white mb-2 text-center">Videos</h1>
        <div className="w-12 h-1 bg-yellow-400 mx-auto mb-12"></div>

        {videos.length === 0 ? (
          <p className="text-center text-gray-500">No videos yet. Check back soon!</p>
        ) : (
          <>
            {/* Featured Videos */}
            {featured.length > 0 && (
              <div className="mb-16">
                <h2 className="text-xl font-bold text-yellow-400 uppercase tracking-wider mb-6">
                  Featured
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featured.map((video) => (
                    <div key={video.id}>
                      <div className="aspect-video rounded-xl overflow-hidden bg-zinc-900 mb-3">
                        <iframe
                          src={getYouTubeEmbedUrl(video.youtubeUrl)}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                      <h3 className="text-white font-semibold text-lg">{video.title}</h3>
                      {video.description && (
                        <p className="text-gray-400 text-sm mt-1">{video.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Other Videos */}
            {rest.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-400 uppercase tracking-wider mb-6">
                  More Videos
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {rest.map((video) => {
                    const thumb =
                      video.thumbnailUrl || getYouTubeThumbnail(video.youtubeUrl);
                    return (
                      <a
                        key={video.id}
                        href={video.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block bg-zinc-900 rounded-xl overflow-hidden hover:ring-2 hover:ring-yellow-400 transition-all"
                      >
                        {thumb && (
                          <div className="aspect-video relative overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={thumb}
                              alt={video.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="text-white font-semibold text-sm">{video.title}</h3>
                          {video.description && (
                            <p className="text-gray-500 text-xs mt-1 line-clamp-2">{video.description}</p>
                          )}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
