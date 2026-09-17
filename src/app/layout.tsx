import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileCTA from "@/components/layout/MobileCTA";
import { getSettings } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: { default: s.default_seo_title, template: `%s | ${s.business_name}` },
    description: s.default_seo_description,
    openGraph: {
      title: s.default_seo_title,
      description: s.default_seo_description,
      type: "website",
      locale: "id_ID",
    },
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  return (
    <html lang="id">
      <body>
        <Navbar businessName={settings.business_name} whatsapp={settings.whatsapp} />
        <main className="min-h-[60vh]">{children}</main>
        <Footer settings={settings} />
        <MobileCTA whatsapp={settings.whatsapp} />
        <Toaster position="top-center" richColors />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "AutoRepair",
              name: settings.business_name,
              address: settings.address,
              telephone: settings.phone,
              geo: { "@type": "GeoCoordinates", latitude: -6.253777, longitude: 107.140374 },
              hasMap: "https://www.google.com/maps/search/?api=1&query=-6.253777,107.140374",
            }),
          }}
        />
      </body>
    </html>
  );
}
