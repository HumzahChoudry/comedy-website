import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { getSiteConfig } from "@/lib/data";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const config = await getSiteConfig();
    return {
      title: config.name,
      description: config.seoDescription,
    };
  } catch {
    // D1 isn't available during build-time prerendering; fall back to defaults.
    return { title: "Comedy Website" };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased bg-black text-white`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
