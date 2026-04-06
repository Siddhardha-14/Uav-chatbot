import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
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
    default: "UAV Mission Intent Analyzer",
    template: "%s · UAV Mission Intent Analyzer",
  },
  description:
    "BERT-based mission intent classification for agriculture, defence, surveillance, and rescue UAV operations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-dvh antialiased`}
      >
        <ThemeProvider>
          <SiteHeader />
          <main>{children}</main>
          <footer className="border-t border-card-border py-6 text-center text-xs text-muted">
            Academic demo · mission text is processed by your configured backend
            only.
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
