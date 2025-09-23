/** @format */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ProteinProvider } from "@/contexts/ProteinContext";
import Navigation from "@/components/Navigation";
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
  description:
    "Calculate quality-adjusted protein using DIAAS and PDCAAS scores for better nutrition planning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ProteinProvider>
          <div className="flex flex-col min-h-screen relative">
            <Navigation />
            <main className="flex-1 pb-20 md:pb-8 relative z-10">
              {children}
            </main>

            {/* Background decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 -left-4 w-72 h-72 bg-green-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
              <div className="absolute top-40 -right-4 w-72 h-72 bg-yellow-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
            </div>
          </div>
        </ProteinProvider>
      </body>
    </html>
  );
}
