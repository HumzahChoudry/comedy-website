import { getSiteConfig } from "@/lib/data";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  const config = getSiteConfig();

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen bg-black">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-white mb-2 text-center">Contact</h1>
        <div className="w-12 h-1 bg-yellow-400 mx-auto mb-12"></div>
        <ContactForm email={config.contactEmail} />
      </div>
    </div>
  );
}
