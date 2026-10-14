import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <head>
        <link rel="icon" href="/logo.png" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
