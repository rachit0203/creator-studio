import type { Metadata } from "next";
import { Geist, IBM_Plex_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { SignedIn } from "@clerk/nextjs";
import CustomCursor from "./components/CustomCursor";
import FloatingChatbotGuide from "./components/FloatingChatbotGuide";
import "./globals.css";

const display = Geist({
  variable: "--font-display",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Studio | Creative Digital Studio",
  description:
    "A creative digital studio building high-performance websites, brand systems, and asset pipelines for ambitious teams.",
  openGraph: {
    title: "Studio | Creative Digital Studio",
    description:
      "A creative digital studio building high-performance websites, brand systems, and asset pipelines for ambitious teams.",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@studio",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${mono.variable} antialiased`}>
        <ClerkProvider appearance={{
        layout: { unsafe_disableDevelopmentModeWarnings: true }
      }}>
          <CustomCursor />
          {children}
          <SignedIn>
            <FloatingChatbotGuide />
          </SignedIn>
        </ClerkProvider>
      </body>
    </html>
  );
}
