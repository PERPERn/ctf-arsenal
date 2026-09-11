import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "CTF Arsenal — Cybersecurity & CTF Toolbox",
  description:
    "A curated arsenal of cybersecurity & CTF tools with bilingual (TH/EN) guides, live terminal demos, and an in-browser identifier.",
  keywords: ["CTF", "cybersecurity", "hacking tools", "pentest", "forensics", "crypto", "reverse engineering"],
  openGraph: { title: "CTF Arsenal", description: "Cybersecurity & CTF tools with bilingual guides and live demos.", type: "website" },
};

export const viewport = { themeColor: "#0a0b0d", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`dark ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');document.documentElement.classList.toggle('dark',t!=='light');var l=localStorage.getItem('lang');if(l)document.documentElement.lang=l;}catch(e){}`,
          }}
        />
        <Providers>
          <Nav />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
