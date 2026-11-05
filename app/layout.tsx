import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { APP_NAME, APP_DESCRIPTION, SITE_URL } from "@/lib/constants";
import "./globals.css";

// Fonts are self-hosted (app/fonts, SIL Open Font License) so neither the
// build nor visitors' browsers depend on Google Fonts.
const jakarta = localFont({
  src: "./fonts/PlusJakartaSans-Variable-latin.woff2",
  weight: "200 800",
  variable: "--font-jakarta",
  display: "swap",
});

// Headings (the `font-display` utility, defined in globals.css)
const outfit = localFont({
  src: "./fonts/Outfit-Variable-latin.woff2",
  weight: "100 900",
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${APP_NAME} | Matric, Inter, O & A Level Coaching in Malir, Karachi`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "coaching centre Malir", "tuition centre Malir 15", "coaching in Malir Karachi", "Matric coaching Karachi",
    "Intermediate coaching Karachi", "O Level tuition Karachi", "A Level tuition Karachi", "IGCSE tuition Karachi",
    "BSEK", "BIEK", "AKU-EB", "FBISE", "Cambridge", "Edexcel", "Sir Wasi", "The Classes",
  ],
  applicationName: APP_NAME,
  formatDetection: { telephone: true, address: true, email: true },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    locale: "en_PK",
    images: [{ url: "/images/og-campus.jpg", width: 1200, height: 630, alt: "The Classes campus, Malir 15, Karachi" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/og-campus.jpg"] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${jakarta.variable}`}>
      <head>
        <link rel="icon" href="/logo.png" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="min-h-full flex flex-col antialiased font-sans">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
