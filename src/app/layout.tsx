import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ProteinProvider } from '@/contexts/ProteinContext';
import Navigation from '@/components/Navigation';
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
  title: "Protein Checker - Quality-Adjusted Protein Calculator",
  description: "Calculate quality-adjusted protein using DIAAS and PDCAAS scores for better nutrition planning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}
      >
        <ProteinProvider>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-1 pb-20 md:pb-8">
              {children}
            </main>
          </div>
        </ProteinProvider>
      </body>
    </html>
  );
}
