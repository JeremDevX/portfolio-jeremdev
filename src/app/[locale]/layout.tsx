import { Chakra_Petch } from "next/font/google";
import Navbar from "@/components/custom/Navbar/Navbar";
import "../../app/globals.scss";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import {
  PERSONAL_INFO,
  SITE_CONFIG,
  SOCIAL_LINKS,
  TECH_STACK,
} from "@/lib/constants";

const leagueSpartan = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="google-site-verification"
          content="xT3V4j3e8lf5TmhLOSlWycOJiDbSXt_LpW_c2GR0oRI"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: PERSONAL_INFO.name,
              alternateName: PERSONAL_INFO.alternateName,
              jobTitle: PERSONAL_INFO.jobTitle,
              url: SITE_CONFIG.baseUrl,
              email: PERSONAL_INFO.email,
              knowsAbout: [
                ...TECH_STACK.main.map((tech) => ({
                  "@type": "Technology",
                  name: tech,
                })),
                ...TECH_STACK.secondary.map((tech) => ({
                  "@type": "Technology",
                  name: tech,
                })),
              ],
              workLocation: [
                {
                  "@type": "LocationFeatureSpecification",
                  name: "Remote",
                },
                {
                  "@type": "LocationFeatureSpecification",
                  name: "Hybrid",
                },
                {
                  "@type": "LocationFeatureSpecification",
                  name: "On-site",
                },
              ],
              availableForHire: true,
              seekingWork: {
                "@type": "EmploymentType",
                employmentTypes: ["FULL_TIME", "CONTRACTOR", "FREELANCE"],
              },
              sameAs: [
                SOCIAL_LINKS.github,
                SOCIAL_LINKS.twitter,
                SOCIAL_LINKS.linkedin,
              ],
            }),
          }}
        />
      </head>

      <body className={`${leagueSpartan.className}`}>
        <NextIntlClientProvider messages={messages}>
          <div className="light"></div>
          <header>
            <Navbar></Navbar>
          </header>
          {children}
          <Analytics />
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
