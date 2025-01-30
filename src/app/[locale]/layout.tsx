import { League_Spartan } from "next/font/google";
import Navbar from "@/components/ui/navbar";
import "/styles/main.scss";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeContextProvider } from "@/context/ThemeContext";
import ThemeProvider from "@/providers/ThemeProvider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  const { children } = props;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  const messages = await getMessages();

  return (
    <html lang={locale}>
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
        <NextIntlClientProvider messages={messages}>
          <ThemeContextProvider>
            <ThemeProvider>
              <header>
                <Navbar></Navbar>
              </header>
              {children}
              <Analytics />
              <SpeedInsights />
            </ThemeProvider>
          </ThemeContextProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
