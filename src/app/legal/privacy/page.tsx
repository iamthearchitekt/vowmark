import { Header } from "@/components/layout/Header";
import { SITE_CONFIG } from "@/config/site";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-vow-bg flex flex-col font-sans">
      <Header />
      <main className="max-w-3xl mx-auto p-8 my-8 bg-vow-paper border border-vow-border rounded-xl">
        <h1 className="font-serif font-bold text-3xl text-vow-dark mb-4">Privacy Policy</h1>
        <p className="text-xs text-vow-muted leading-relaxed">
          At {SITE_CONFIG.name}, we prioritize the security and privacy of user design assets, couple content, and uploaded reference images. Reference uploads are never used for public model training without explicit consent.
        </p>
      </main>
    </div>
  );
}
