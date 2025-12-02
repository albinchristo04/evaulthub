
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AlertTriangle, Info } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Watch Footy - Live Sports Streaming",
  description: "Watch live football, basketball, hockey, and more sports for free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="bg-blue-900 text-center py-2 text-xs font-medium text-white flex items-center justify-center gap-2" style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b' }}>
          <Info size={14} className="text-blue-400" />
          <span>Important: Make sure to bookmark our mirror links site (watchfty.link) so you can always find us!</span>
        </div>
        <div className="bg-yellow-900/20 text-center py-2 text-xs font-medium text-yellow-500 flex items-center justify-center gap-2" style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)', color: '#eab308', borderBottom: '1px solid rgba(234, 179, 8, 0.2)' }}>
          <AlertTriangle size={14} />
          <span>If having issues with streams, use a VPN or use https://1.1.1.1 DNS to bypass</span>
        </div>
        <Navbar />
        <main className="min-h-screen pb-10">
          {children}
        </main>
        <footer className="border-t border-gray-800 py-8 mt-10 text-center text-gray-500 text-sm">
          <div className="container">
            <p>&copy; 2025 Watch Footy. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
