import { getTourDates } from "@/lib/data";

export default function TourPage() {
  const allDates = getTourDates();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = allDates.filter((d) => new Date(d.date) >= today);
  const past = allDates.filter((d) => new Date(d.date) < today);

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen bg-black">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-white mb-2 text-center">Tour Dates</h1>
        <div className="w-12 h-1 bg-yellow-400 mx-auto mb-12"></div>

        {/* Upcoming Shows */}
        {upcoming.length > 0 ? (
          <div className="mb-16">
            <h2 className="text-xl font-bold text-yellow-400 uppercase tracking-wider mb-6">
              Upcoming Shows
            </h2>
            <div className="flex flex-col gap-4">
              {upcoming.map((show) => (
                <ShowCard key={show.id} show={show} isPast={false} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No upcoming shows announced yet.</p>
            <p className="text-gray-600 text-sm mt-2">Check back soon!</p>
          </div>
        )}

        {/* Past Shows */}
        {past.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-600 uppercase tracking-wider mb-6">
              Past Shows
            </h2>
            <div className="flex flex-col gap-3 opacity-60">
              {[...past].reverse().map((show) => (
                <ShowCard key={show.id} show={show} isPast={true} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ShowCard({
  show,
  isPast,
}: {
  show: ReturnType<typeof getTourDates>[0];
  isPast: boolean;
}) {
  const dateObj = new Date(show.date);
  const day = dateObj.toLocaleDateString("en-US", { day: "numeric" });
  const month = dateObj.toLocaleDateString("en-US", { month: "short" });
  const year = dateObj.toLocaleDateString("en-US", { year: "numeric" });

  return (
    <div className="flex gap-5 items-start bg-zinc-900 rounded-xl p-5 border border-white/5">
      {/* Date Block */}
      <div className="flex-shrink-0 w-16 text-center">
        <p className="text-yellow-400 font-black text-2xl leading-none">{day}</p>
        <p className="text-gray-400 text-xs uppercase mt-1">{month}</p>
        <p className="text-gray-600 text-xs">{year}</p>
      </div>

      {/* Divider */}
      <div className="w-px bg-white/10 self-stretch"></div>

      {/* Details */}
      <div className="flex-1">
        <p className="text-white font-semibold text-lg leading-tight">{show.venue}</p>
        <p className="text-gray-400 text-sm">{show.city}</p>
        {show.notes && <p className="text-gray-500 text-xs mt-1">{show.notes}</p>}
      </div>

      {/* CTA */}
      <div className="flex-shrink-0 self-center">
        {isPast ? (
          <span className="text-xs text-gray-600 uppercase font-medium">Past</span>
        ) : show.soldOut ? (
          <span className="px-4 py-2 text-xs font-bold uppercase bg-red-900/40 text-red-400 rounded-full">
            Sold Out
          </span>
        ) : (
          <a
            href={show.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-400 text-black font-bold py-2 px-5 rounded-full text-sm hover:bg-yellow-300 transition-colors uppercase tracking-wider whitespace-nowrap"
          >
            Tickets
          </a>
        )}
      </div>
    </div>
  );
}
