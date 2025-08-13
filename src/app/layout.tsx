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
        <header className="retro-header">
          <nav className="container mx-auto flex items-center justify-between py-3">
            <Link href="/" className="retro-brand">
              <i className="nes-icon  is-small pixel-icons" aria-hidden />
              <span className="brand-text">RANK GAME</span>
            </Link>
            <div className="retro-nav">
              <Link href="/top" className="nav-link nes-btn pixel-rounded">
                <i className="nes-icon star is-small pixel-icons" aria-hidden />
                <span>首页</span>
              </Link>

              <span className="nav-dot rounded-[2px] hidden sm:inline-block" />
              <Link href="/top" className="nav-link nes-btn pixel-rounded">
                <i
                  className="nes-icon heart is-small pixel-icons"
                  aria-hidden
                />
                <span>排行模式</span>
              </Link>
              <span className="nav-dot rounded-[2px] hidden sm:inline-block" />
              <Link href="/tiers" className="nav-link nes-btn pixel-rounded">
                <i
                  className="nes-icon trophy is-small pixel-icons"
                  aria-hidden
                />
                <span>梯队模式</span>
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
