import { getPhotos, getVideos, getTourDates } from "@/lib/data";
import Link from "next/link";

export default async function AdminDashboard() {
  const photos = await getPhotos();
  const videos = await getVideos();
  const tourDates = await getTourDates();
  const upcoming = tourDates.filter((d) => new Date(d.date) >= new Date());

  const stats = [
    { label: "Photos", value: photos.length, href: "/admin/photos", color: "text-blue-400" },
    { label: "Videos", value: videos.length, href: "/admin/videos", color: "text-red-400" },
    { label: "Tour Dates", value: tourDates.length, href: "/admin/tour", color: "text-yellow-400" },
    { label: "Upcoming Shows", value: upcoming.length, href: "/admin/tour", color: "text-green-400" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-zinc-900 rounded-xl p-5 border border-white/5 hover:border-yellow-400/30 transition-colors"
          >
            <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { href: "/admin/photos", label: "Upload Photos", desc: "Add new photos to the gallery", icon: "📷" },
          { href: "/admin/videos", label: "Add Video", desc: "Add a YouTube video to the site", icon: "🎬" },
          { href: "/admin/tour", label: "Add Tour Date", desc: "Schedule a new show date", icon: "📅" },
          { href: "/admin/settings", label: "Edit Site Info", desc: "Update bio, name, social links", icon: "⚙️" },
          { href: "/", label: "View Public Site", desc: "See how the site looks to visitors", icon: "🌐" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            target={action.href === "/" ? "_blank" : undefined}
            className="flex gap-4 items-start bg-zinc-900 rounded-xl p-5 border border-white/5 hover:border-yellow-400/30 transition-colors"
          >
            <span className="text-2xl">{action.icon}</span>
            <div>
              <p className="text-white font-semibold text-sm">{action.label}</p>
              <p className="text-gray-500 text-xs mt-0.5">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
