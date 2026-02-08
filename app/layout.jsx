import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Instant Polaroid — Turn photos into polaroid prints",
  description:
    "Upload or capture a photo and instantly transform it into a beautiful polaroid-framed print. Built with Orshot API.",
  alternates: {
    canonical: "https://instantpolaroid.com",
  },
  openGraph: {
    title: "Instant Polaroid",
    description: "Turn your photos into polaroid prints instantly",
    url: "https://instantpolaroid.com",
    siteName: "Instant Polaroid",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Instant Polaroid — Turn photos into polaroid prints",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instant Polaroid",
    description: "Turn your photos into polaroid prints instantly",
    images: ["/og-image.png"],
    creator: "@thelifeofrishi",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
