import { Inter, League_Spartan } from "next/font/google";
import Navbar from "@/components/ui/navbar";
import "../../styles/main.scss";
import { GoogleTagManager } from "@next/third-parties/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <meta
          name="google-site-verification"
          content="xT3V4j3e8lf5TmhLOSlWycOJiDbSXt_LpW_c2GR0oRI"
        />
        <meta
          property="og:image"
          content="https://jeremdevx.com/_next/image?url=/jeremdevx-logo.png&w=256&q=75"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <GoogleTagManager gtmId="GTM-PTVP83TL" />
        <Script
          id="cookieyes"
          type="text/javascript"
          src="https://cdn-cookieyes.com/client_data/aa43fadd42453bc455dee382/script.js"
        ></Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Jérémie Lavergnat",
              alternateName: "JeremDevX",
              jobTitle: "Développeur Web React",
              url: "https://jeremdevx.com",
              email: "jeremdev.contactpro@gmail.com",
              sameAs: [
                "https://github.com/JeremDevX",
                "https://x.com/JeremDevX",
                "https://www.linkedin.com/in/jeremie-lavergnat",
              ],
            }),
          }}
        />
      </head>

      <body className={`${leagueSpartan.className}`}>
        <header>
          <Navbar></Navbar>
        </header>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
