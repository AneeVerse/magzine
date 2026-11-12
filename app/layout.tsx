import type { Metadata, Viewport } from "next";
import { VisitorTracker } from "@/components/VisitorTracker";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://rise.nmbts.co.in"),
  title:
    "BNI RISE | Navi Mumbai Business Magazine — 12th Anniversary Edition",
  description:
    "The business story of Navi Mumbai, told by the people building it. 48 pages on the new airport, data centre corridor, and ₹3,000+ Cr referral economy. Free WhatsApp delivery.",
  keywords: [
    "BNI Navi Mumbai",
    "RISE Magazine",
    "Navi Mumbai Business",
    "NMIA Airport Business",
    "Data Centre Corridor Navi Mumbai",
    "BNI Referrals",
    "Navi Mumbai Entrepreneurs",
    "Pankaj Harwansh",
  ],
  authors: [{ name: "BNI Navi Mumbai / YBOUNCE Ventures LLP" }],
  openGraph: {
    title: "BNI RISE | The Business Story of Navi Mumbai",
    description:
      "48 pages of regional economic intelligence. Free copy delivered straight to your WhatsApp in 2 minutes.",
    url: "https://rise.nmbts.co.in",
    siteName: "BNI RISE Magazine",
    images: [
      {
        url: "/assets/rise-cover.jpg",
        width: 910,
        height: 1287,
        alt: "BNI RISE 12th Anniversary Edition Cover",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BNI RISE | Navi Mumbai Business Magazine",
    description:
      "48 pages on the new airport, data centre boom, and ₹3,000+ Cr in business referrals.",
    images: ["/assets/rise-cover.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#60182b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Schibsted+Grotesk:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}
