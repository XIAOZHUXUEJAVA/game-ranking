import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="border-b">
          <nav className="container mx-auto flex items-center justify-between p-4">
            <a className="nes-text is-primary text-lg font-bold" href="/">
              Rank Game
            </a>
            <div className="flex items-center gap-2">
              <a className="nes-btn" href="/top">
                Top 排行
              </a>
              <a className="nes-btn" href="/tiers">
                梯队模式
              </a>
              {/* <a className="nes-btn is-success" href="https://nostalgic-css.github.io/NES.css/" target="_blank" rel="noreferrer">NES.css</a> */}
            </div>
          </nav>
        </header>
        <main className="min-h-[calc(100vh-64px)]">{children}</main>
        <footer className="border-t mt-8">
          <div className="container mx-auto p-4 text-xs opacity-70">
            © 2025 Rank Game
          </div>
        </footer>
      </body>
    </html>
  );
}
