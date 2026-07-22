import { Header } from "@/components/layout/Header";
import { SITE_CONFIG } from "@/config/site";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-vow-bg flex flex-col font-sans">
      <Header />
      <main className="max-w-3xl mx-auto p-8 my-8 bg-vow-paper border border-vow-border rounded-xl">
        <h1 className="font-serif font-bold text-3xl text-vow-dark mb-4">Terms of Service</h1>
        <p className="text-xs text-vow-muted leading-relaxed">
          {SITE_CONFIG.name} provides AI-assisted stationery identity tools. Generated assets are provided with full export permissions. Note that AI-generated artwork is not automatically trademarkable or guaranteed exclusive.
        </p>
      </main>
    </div>
  );
}
