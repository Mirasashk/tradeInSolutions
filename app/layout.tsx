import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Analytics } from "@/components/shared/Analytics";
import { FirebaseInit } from "@/components/shared/FirebaseInit";
import { ThemeProvider } from "@/components/shared/ThemeProvider";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Trade-In Solutions Irvine",
  description:
    "Sell your car for cash in Irvine and Orange County. Free appraisal, same-day payment.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Analytics />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider>
          <FirebaseInit />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
