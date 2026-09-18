import { getSiteConfig } from "@/lib/data";
import ContactForm from "@/components/ContactForm";
import EmailSignupForm from "@/components/EmailSignupForm";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const config = await getSiteConfig();

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen bg-black">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-white mb-2 text-center">Contact</h1>
        <div className="w-12 h-1 bg-[var(--accent)] mx-auto mb-12"></div>
        <ContactForm email={config.contactEmail} />

        {/* Email list signup */}
        <div className="mt-20">
          <h2 className="text-3xl font-black text-white mb-2 text-center">
            Sign Up for My Email List
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Get show announcements and updates straight to your inbox.
          </p>
          <div className="w-12 h-1 bg-[var(--accent)] mx-auto mb-10"></div>
          <EmailSignupForm />
        </div>
      </div>
    </div>
  );
}
