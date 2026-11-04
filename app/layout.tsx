import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
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
  title: {
    default: `${APP_NAME} — Future of Learning Starts Here`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "education", "Pakistan", "coaching center", "online learning",
    "AKU-EB", "Cambridge", "Sindh Board", "AI learning",
  ],
  other: {
    "twitter:card": "summary_large_image",
  },
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
