import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

// Orshot dynamic URL — the OG card renders from studio template 20197.
// No API key and no route of our own: the signature is per-template.
const OG_IMAGE =
  "https://api.orshot.com/v1/studio/dynamic-url/instant-polaroid-og.png?templateId=20197&sign=041e8e4d1fe5a550";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Instant Polaroid — No Signup Polaroid Photo Maker",
  description:
    "Instantly convert photos to Polaroid prints. Free online tool to add captions and retro frames. No signup required. Perfect for social media & printing.",
  alternates: {
    canonical: "https://instantpolaroid.com",
  },
  openGraph: {
    title: "Instant Polaroid — No Signup Polaroid Photo Maker",
    description:
      "Instantly convert photos to Polaroid prints. Free online tool to add captions and retro frames. No signup required. Perfect for social media & printing.",
    url: "https://instantpolaroid.com",
    siteName: "Instant Polaroid",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Instant Polaroid — No Signup Polaroid Photo Maker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Polaroid Frame Generator — Turn Photos into Polaroids Online",
    description:
      "Instantly convert photos to aesthetic Polaroid prints. Free online tool to add captions, backgrounds & retro frames.",
    images: [OG_IMAGE],
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
      <Script
        defer
        src="https://api.pirsch.io/pa.js"
        id="pianjs"
        data-code="VuiH6R3Gz9iiXssX0VZRAJlvpCJ91Udp"
      />

      <Script
        defer
        src="https://datafa.st/js/script.js"
        data-website-id="dfid_He6CTN6ei8Ws09nIq1V9p"
        data-domain="instantpolaroid.com"
      />
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
