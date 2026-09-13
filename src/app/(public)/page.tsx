import { getSiteConfig, getVideos, getTourDates, getYouTubeEmbedUrl } from "@/lib/data";
import Link from "next/link";

export default function HomePage() {
  const config = getSiteConfig();
  const videos = getVideos().filter((v) => v.featured).slice(0, 1);
  const upcomingShows = getTourDates()
    .filter((d) => new Date(d.date) >= new Date())
    .slice(0, 3);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-4 bg-gradient-to-b from-black via-zinc-900 to-black">
        {/* Optional background image */}
        {config.heroImage && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${config.heroImage})` }}
            />
            {/* Dark overlay so text stays readable over the image */}
            <div className="absolute inset-0 bg-black/60" />
          </>
        )}
        <div className="relative max-w-3xl mx-auto">
          <p className="text-yellow-400 text-sm font-semibold uppercase tracking-[0.3em] mb-4">
            {config.tagline}
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-none">
            {config.heroHeading}
          </h1>
          <p className="text-xl text-gray-400 mb-10">{config.heroSubheading}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/tour"
              className="bg-yellow-400 text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors text-sm uppercase tracking-wider"
            >
              Get Tickets
            </Link>
            <Link
              href="/videos"
              className="border border-white/30 text-white font-semibold py-3 px-8 rounded-full hover:border-yellow-400 hover:text-yellow-400 transition-colors text-sm uppercase tracking-wider"
            >
              Watch Videos
            </Link>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-24 px-4 bg-zinc-950">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">About</h2>
          <div className="w-12 h-1 bg-yellow-400 mx-auto mb-8"></div>
          <p className="text-gray-300 text-lg leading-relaxed">{config.bio}</p>
          <Link href="/contact" className="inline-block mt-8 text-yellow-400 font-semibold hover:text-yellow-300 transition-colors">
            Book Me →
          </Link>
        </div>
      </section>

      {/* Featured Video */}
      {videos.length > 0 && (
        <section className="py-24 px-4 bg-black">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-2 text-center">Featured Video</h2>
            <div className="w-12 h-1 bg-yellow-400 mx-auto mb-10"></div>
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
              <iframe
                src={getYouTubeEmbedUrl(videos[0].youtubeUrl)}
                title={videos[0].title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <p className="text-center text-gray-400 mt-4">{videos[0].title}</p>
          </div>
          <div className="text-center mt-8">
            <Link href="/videos" className="text-yellow-400 font-semibold hover:text-yellow-300 transition-colors">
              Watch More Videos →
            </Link>
          </div>
        </section>
      )}

      {/* Upcoming Shows Preview */}
      {upcomingShows.length > 0 && (
        <section className="py-24 px-4 bg-zinc-950">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-2 text-center">Upcoming Shows</h2>
            <div className="w-12 h-1 bg-yellow-400 mx-auto mb-10"></div>
            <div className="flex flex-col gap-4">
              {upcomingShows.map((show) => (
                <div key={show.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-zinc-900 rounded-xl p-5 border border-white/5">
                  <div>
                    <p className="text-yellow-400 font-mono text-sm">
                      {new Date(show.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </p>
                    <p className="text-white font-semibold text-lg mt-1">{show.venue}</p>
                    <p className="text-gray-400 text-sm">{show.city}</p>
                    {show.notes && <p className="text-gray-500 text-xs mt-1">{show.notes}</p>}
                  </div>
                  {show.soldOut ? (
                    <span className="mt-3 sm:mt-0 px-4 py-2 text-xs font-bold uppercase bg-red-900/50 text-red-400 rounded-full">Sold Out</span>
                  ) : (
                    <a href={show.ticketUrl} target="_blank" rel="noopener noreferrer" className="mt-3 sm:mt-0 bg-yellow-400 text-black font-bold py-2 px-6 rounded-full text-sm hover:bg-yellow-300 transition-colors uppercase tracking-wider">
                      Tickets
                    </a>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/tour" className="text-yellow-400 font-semibold hover:text-yellow-300 transition-colors">View All Tour Dates →</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
