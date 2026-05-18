import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import { Toaster } from "sonner";

import { Header } from "@/components/layouts/Header";

import "./globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Certalis Takehome",
  description: "Mini training marketplace",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="fr" className={publicSans.variable}>
    <body className="min-h-screen bg-background font-sans text-foreground antialiased">
      <Header />
      {children}
      <Toaster richColors position="top-right" />
    </body>
  </html>
);

export default RootLayout;
