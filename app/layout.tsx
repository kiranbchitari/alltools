import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StructuredData, { generateOrganizationSchema } from "./components/StructuredData";

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
  description: 'FormatMint is a collection of free developer tools including HTML Editor, JSON Formatter, AI Text Enhancer, and more. Fast, privacy-focused, and runs locally in your browser.',
  openGraph: {
    title: 'FormatMint - Free Developer Tools',
    description: 'FormatMint is a collection of free developer tools including HTML Editor, JSON Formatter, AI Text Enhancer, and more. Fast, privacy-focused, and runs locally in your browser.',
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
    description: 'FormatMint is a collection of free developer tools including HTML Editor, JSON Formatter, AI Text Enhancer, and more. Fast, privacy-focused, and runs locally in your browser.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
};

const organizationSchema = generateOrganizationSchema();

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
        <StructuredData data={organizationSchema} />
        {children}
      </body>
    </html>
  );
}
