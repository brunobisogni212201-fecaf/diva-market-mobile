import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/layout/Header";
import { ServiceWorkerCleanup } from "@/hooks/use-service-worker-cleanup";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Diva Market - Seu Marketplace Favorito",
  description: "Compre e venda produtos exclusivos na Diva Market",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#880e4f',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Diva Market" />
      </head>
      <body className={`${inter.className} bg-gray-50 text-slate-900 antialiased min-h-screen`}>
        <ServiceWorkerCleanup />
        {/* Main Wrapper with Mobile-First Logic */}
        <div className="flex min-h-screen flex-col max-w-md mx-auto bg-white relative shadow-xl">
          {/* 
              Safe Area Top for Notches 
              Sticky Header with high Z-index
            */}
          <div className="pt-[env(safe-area-inset-top)] bg-white sticky top-0 z-50 w-full">
            <Header className="bg-white/95 backdrop-blur-md border-b border-gray-100" />
          </div>

          {/* Main Content Area */}
          {/* pb-20 matches BottomNav height */}
          <main className="flex-1 px-4 pb-20 pt-4">
            {children}
          </main>

          <BottomNav />
        </div>
      </body>
    </html>
  );
}
