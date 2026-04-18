import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bullvora — Indian Market AI",
  description: "AI-powered stock analysis and scanner for Indian equity markets (NSE/BSE). Get real-time scores, technical signals, and smart recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(19, 28, 46, 0.95)",
              border: "1px solid rgba(42, 63, 95, 0.8)",
              color: "#e2e8f0",
              fontSize: "13px",
              backdropFilter: "blur(12px)",
            },
            success: { iconTheme: { primary: "#10b981", secondary: "#0a0e17" } },
            error: { iconTheme: { primary: "#ef4444", secondary: "#0a0e17" } },
          }}
        />
      </body>
    </html>
  );
}
