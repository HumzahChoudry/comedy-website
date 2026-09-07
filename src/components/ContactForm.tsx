"use client";

import { useState } from "react";
import { getSiteConfig } from "@/lib/data";

// This is a client component - config must be passed as a prop
export default function ContactForm({ email }: { email: string }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <p className="text-gray-400 text-center mb-8">
        For bookings, press inquiries, or just to say hello, reach out below or email{" "}
        <a href={`mailto:${email}`} className="text-yellow-400 hover:underline">
          {email}
        </a>
        .
      </p>

      {status === "success" ? (
        <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-8 text-center">
          <p className="text-green-400 font-semibold text-lg">Message sent! ✓</p>
          <p className="text-gray-400 text-sm mt-2">Thanks for reaching out. I&apos;ll get back to you soon.</p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-4 text-yellow-400 text-sm hover:underline"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1" htmlFor="name">
                Name *
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1" htmlFor="email">
                Email *
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 transition-colors"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1" htmlFor="subject">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 transition-colors"
              placeholder="Booking, press, or other"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1" htmlFor="message">
              Message *
            </label>
            <textarea
              id="message"
              required
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 transition-colors resize-none"
              placeholder="Tell me about your inquiry..."
            />
          </div>

          {status === "error" && (
            <p className="text-red-400 text-sm text-center">
              Something went wrong. Please try again or email directly.
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-yellow-400 text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition-colors text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Sending..." : "Send Message"}
          </button>
        </form>
      )}
    </div>
  );
}
