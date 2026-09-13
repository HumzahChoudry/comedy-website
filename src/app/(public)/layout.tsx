import { getSiteConfig } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const config = await getSiteConfig();
  return (
    <>
      <Navbar siteName={config.name} />
      <main className="min-h-screen">{children}</main>
      <Footer config={config} />
    </>
  );
}
