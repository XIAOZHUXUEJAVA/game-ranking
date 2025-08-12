import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";
import "nes.css/css/nes.min.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  title: "Rank Game",
  description: "游戏排名与梯队划分",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`crt-overlay ${geistSans.variable} ${geistMono.variable} ${pressStart.variable} antialiased`}
      >
        <header className="border-b bg-[#161a20]">
          <nav className="container mx-auto flex items-center justify-between p-4">
            <Link
              className="retro-title heading-8bit text-lg font-bold"
              href="/"
            >
              RANK GAME
            </Link>
            <div className="flex items-center gap-2">
              <Link className="nes-btn" href="/top">
                Top 排行
              </Link>
              <Link className="nes-btn" href="/tiers">
                梯队模式
              </Link>
            </div>
          </nav>
        </header>
        <main className="min-h-[calc(100vh-64px)]">{children}</main>
        <footer className="border-t mt-8 bg-[#161a20]">
          <div className="container mx-auto p-4 text-xs opacity-70">
            © 2025 Rank Game
          </div>
        </footer>
      </body>
    </html>
  );
}
