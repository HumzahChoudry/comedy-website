"use client";

import { useState } from "react";
import { TourDate } from "@/types";

const emptyForm = {
  date: "",
  venue: "",
  city: "",
  ticketUrl: "",
  soldOut: false,
  notes: "",
};

export default function TourAdmin({ initialDates }: { initialDates: TourDate[] }) {
  const [dates, setDates] = useState<TourDate[]>(initialDates);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");

    const res = await fetch("/api/admin/tour", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const data = await res.json();
      setDates((prev) =>
        [...prev, data.tourDate].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
      );
      setForm(emptyForm);
      setMsg("Tour date added!");
    } else {
      setMsg("Failed to add tour date.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this show date?")) return;
    const res = await fetch(`/api/admin/tour/${id}`, { method: "DELETE" });
    if (res.ok) setDates((prev) => prev.filter((d) => d.id !== id));
  };

  const toggleSoldOut = async (id: string, soldOut: boolean) => {
    const res = await fetch(`/api/admin/tour/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ soldOut: !soldOut }),
    });
    if (res.ok) {
      setDates((prev) =>
        prev.map((d) => (d.id === id ? { ...d, soldOut: !soldOut } : d))
      );
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Manage Tour Dates</h2>

      {/* Add Form */}
      <div className="bg-zinc-900 rounded-xl p-6 border border-white/5 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Add New Show</h3>
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Date *</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Venue *</label>
              <input
                type="text"
                required
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400 text-sm"
                placeholder="The Comedy Store"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">City *</label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400 text-sm"
                placeholder="Los Angeles, CA"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Ticket URL</label>
              <input
                type="url"
                value={form.ticketUrl}
                onChange={(e) => setForm({ ...form, ticketUrl: e.target.value })}
                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400 text-sm"
                placeholder="https://tickets.example.com/..."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Notes (optional)</label>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-yellow-400 text-sm"
              placeholder="e.g. Two shows — 7pm & 9pm"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="soldOut"
              checked={form.soldOut}
              onChange={(e) => setForm({ ...form, soldOut: e.target.checked })}
              className="w-4 h-4 accent-yellow-400"
            />
            <label htmlFor="soldOut" className="text-sm text-gray-400">Mark as sold out</label>
          </div>
          {msg && <p className={`text-sm ${msg.includes("Failed") ? "text-red-400" : "text-green-400"}`}>{msg}</p>}
          <div>
            <button
              type="submit"
              disabled={saving}
              className="bg-yellow-400 text-black font-bold py-2 px-6 rounded-full text-sm hover:bg-yellow-300 transition-colors disabled:opacity-50"
            >
              {saving ? "Adding..." : "Add Show"}
            </button>
          </div>
        </form>
      </div>

      {/* Tour Dates List */}
      <h3 className="text-lg font-semibold text-white mb-4">All Dates ({dates.length})</h3>
      {dates.length === 0 ? (
        <p className="text-gray-500">No tour dates yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {dates.map((show) => {
            const isPast = new Date(show.date) < new Date();
            return (
              <div
                key={show.id}
                className={`flex gap-4 items-center bg-zinc-900 rounded-xl p-4 border border-white/5 ${isPast ? "opacity-50" : ""}`}
              >
                <div className="flex-1">
                  <p className="text-yellow-400 font-mono text-sm">
                    {new Date(show.date).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
                    {isPast && <span className="ml-2 text-gray-600 text-xs">(past)</span>}
                  </p>
                  <p className="text-white font-semibold text-sm">{show.venue}</p>
                  <p className="text-gray-400 text-xs">{show.city}</p>
                  {show.notes && <p className="text-gray-500 text-xs">{show.notes}</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleSoldOut(show.id, show.soldOut)}
                    className={`text-xs px-3 py-1 rounded-full transition-colors ${
                      show.soldOut
                        ? "bg-red-900/40 text-red-400 hover:bg-red-900/60"
                        : "bg-zinc-700 text-gray-400 hover:text-white"
                    }`}
                  >
                    {show.soldOut ? "Sold Out" : "Available"}
                  </button>
                  <button
                    onClick={() => handleDelete(show.id)}
                    className="text-gray-600 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
