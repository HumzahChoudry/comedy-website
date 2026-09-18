"use client";

import { useState } from "react";
import { EmailSignup } from "@/types";
import { US_STATES } from "@/lib/us-states";

function stateName(code: string): string {
  return US_STATES.find((s) => s.code === code)?.name || code;
}

export default function SubscribersAdmin({
  initialSignups,
}: {
  initialSignups: EmailSignup[];
}) {
  const [signups, setSignups] = useState<EmailSignup[]>(initialSignups);

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return;
    const res = await fetch(`/api/admin/subscribers/${id}`, { method: "DELETE" });
    if (res.ok) setSignups((prev) => prev.filter((s) => s.id !== id));
  };

  const exportCsv = () => {
    // Wrap each field in quotes and escape embedded quotes so values containing
    // commas (e.g. "New York, NY") don't break the CSV columns.
    const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const header = "email,city,state,signed_up\n";
    const rows = signups
      .map((s) =>
        [esc(s.email), esc(s.city), esc(s.state), esc(new Date(s.createdAt).toISOString())].join(",")
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `email-list-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          Email Subscribers ({signups.length})
        </h2>
        {signups.length > 0 && (
          <button
            onClick={exportCsv}
            className="bg-yellow-400 text-black font-bold py-2 px-5 rounded-full text-sm hover:bg-yellow-300 transition-colors"
          >
            Export CSV
          </button>
        )}
      </div>

      {signups.length === 0 ? (
        <p className="text-gray-500">
          No subscribers yet. When fans sign up via the email list form, they&apos;ll appear here.
        </p>
      ) : (
        <div className="bg-zinc-900 rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-gray-400">
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">State</th>
                <th className="px-4 py-3 font-medium">Signed Up</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {signups.map((s) => (
                <tr key={s.id} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-3 text-white">{s.email}</td>
                  <td className="px-4 py-3 text-gray-400">{s.city || "—"}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {s.state ? stateName(s.state) : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(s.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-gray-600 hover:text-red-400 transition-colors"
                      title="Remove subscriber"
                    >
                      <svg className="w-5 h-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
