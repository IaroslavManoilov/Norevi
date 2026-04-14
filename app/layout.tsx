import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { DevCacheReset } from "@/components/pwa/dev-cache-reset";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: {
    default: "Norevi",
    template: "%s | Norevi",
  },
  description: "Norevi — умный ритм жизни",
  applicationName: "Norevi",
  icons: {
    icon: "/brand/favicon.png",
    apple: "/brand/apple-touch-icon.png",
    shortcut: "/brand/favicon.png",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ToastProvider>
            <DevCacheReset />
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
