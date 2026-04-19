import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "QuickPayX — Smart Finance & Paper Trading",
    template: "%s | QuickPayX",
  },
  description:
    "Master your finances with realistic wallet management and practice investing with virtual money. No risk, real learning.",
  keywords: ["fintech", "paper trading", "digital wallet", "investment learning", "stock market"],
  authors: [{ name: "QuickPayX Team" }],
  openGraph: {
    title: "QuickPayX — Smart Finance & Paper Trading",
    description: "Manage your wallet and practice stock trading with virtual money.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#10b981",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
    >
      <body className="min-h-screen bg-[#0a0e27] text-white antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
