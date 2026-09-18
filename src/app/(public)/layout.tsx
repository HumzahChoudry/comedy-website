import { getSiteConfig } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeStyle from "@/components/ThemeStyle";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const config = await getSiteConfig();
  return (
    <div style={{ backgroundColor: config.theme.backgroundColor }}>
      <ThemeStyle theme={config.theme} />
      <Navbar siteName={config.name} />
      <main className="min-h-screen">{children}</main>
      <Footer config={config} />
    </div>
  );
}
