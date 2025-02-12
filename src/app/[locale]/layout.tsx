import { Chakra_Petch } from "next/font/google";
import Navbar from "@/components/custom/Navbar/Navbar";
import "../../app/globals.scss";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

const leagueSpartan = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
        <link rel="canonical" href="https://jeremdevx.com" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Jérémie Lavergnat",
              alternateName: "JeremDevX",
              jobTitle: "Front-End React / Next.js Developer",
              url: "https://jeremdevx.com",
              email: "jeremdev.contactpro@gmail.com",
              knowsAbout: [
                {
                  "@type": "Technology",
                  name: "React.js",
                },
                {
                  "@type": "Technology",
                  name: "Next.js",
                },
                {
                  "@type": "Technology",
                  name: "TypeScript",
                },
                {
                  "@type": "Technology",
                  name: "Prisma",
                },
                {
                  "@type": "Technology",
                  name: "Node.js",
                },
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
