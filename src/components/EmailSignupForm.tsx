"use client";

import { useState } from "react";
import { US_STATES } from "@/lib/us-states";

export default function EmailSignupForm() {
  const [form, setForm] = useState({ email: "", city: "", state: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ email: "", city: "", state: "" });
      } else {
        const data = (await res.json()) as { error?: string };
        setError(data.error || "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-6 text-center">
        <p className="text-green-400 font-semibold text-lg">You&apos;re on the list! 🎉</p>
        <p className="text-gray-400 text-sm mt-2">
          Thanks for signing up. Keep an eye on your inbox for show announcements.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-[var(--accent)] text-sm hover:underline"
        >
          Sign up another email
        </button>
      </div>
    );
  }

  return (
    // autoComplete="on" + per-field autocomplete tokens let browsers/password
    // managers autofill the visitor's saved contact/address details.
    <form onSubmit={handleSubmit} autoComplete="on" className="flex flex-col gap-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1" htmlFor="signup-email">
          Email *
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--accent)] transition-colors"
          placeholder="you@email.com"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1" htmlFor="signup-city">
            City <span className="text-gray-600">(optional)</span>
          </label>
          <input
            id="signup-city"
            name="city"
            type="text"
            autoComplete="address-level2"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--accent)] transition-colors"
            placeholder="Your city"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1" htmlFor="signup-state">
            State <span className="text-gray-600">(optional)</span>
          </label>
          <select
            id="signup-state"
            name="state"
            autoComplete="address-level1"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--accent)] transition-colors"
          >
            <option value="">Select a state</option>
            {US_STATES.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {status === "error" && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-[var(--accent)] text-[var(--accent-text)] font-bold py-3 px-8 rounded-full hover:bg-[var(--accent-hover)] transition-colors text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading" ? "Signing up..." : "Join the Email List"}
      </button>
    </form>
  );
}
