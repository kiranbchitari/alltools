import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL('https://formatmint.com'),
  title: {
    default: 'FormatMint - Free Developer Tools',
    template: '%s | FormatMint',
  },
  description: 'Free, fast, and privacy-focused developer tools. No server-side processing for most tools.',
  openGraph: {
    title: 'FormatMint - Free Developer Tools',
    description: 'Free, fast, and privacy-focused developer tools. No server-side processing for most tools.',
    url: 'https://formatmint.com',
    siteName: 'FormatMint',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FormatMint - Free Developer Tools',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FormatMint - Free Developer Tools',
    description: 'Free, fast, and privacy-focused developer tools. No server-side processing for most tools.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
