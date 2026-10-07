import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Orbitron, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const space = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stellar-portfolio.example.com"),
  title: {
    default: "Portfolio | Aristo Decky Susilo",
    template: "%s | Aristo Decky Susilo",
  },
  description:
    "Portfolio Aristo Decky Susilo — IT Support & Application Support. Menjaga sistem tetap menyala, tiket tetap bergerak, pengguna tetap tenang.",
  keywords: [
    "IT Support",
    "Application Support",
    "Portfolio",
    "Aristo Decky Susilo",
    "Service Desk",
    "ERP",
    "POS",
  ],
  authors: [{ name: "Aristo Decky Susilo" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    title: "Portfolio | Aristo Decky Susilo",
    description: "IT Support & Application Support Portfolio.",
    siteName: "Aristo Decky Susilo Portfolio",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#121212",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${orbitron.variable} ${space.variable} scroll-smooth`}
    >
      <body>
        <Script src="/click-sound.js" strategy="beforeInteractive" />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-[0_0_32px_-6px_rgba(203,162,255,0.5)]"
        >
          Skip to main content
        </a>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
              try {
                const adminTheme = localStorage.getItem('admin-theme');
                if (adminTheme === 'light' || adminTheme === 'dark' || adminTheme === 'system') {
                  document.documentElement.dataset.adminTheme = adminTheme;
                }
                const portfolioTheme = localStorage.getItem('portfolio-theme');
                if (portfolioTheme === 'light' || portfolioTheme === 'dark') {
                  if (window.location.pathname.startsWith('/admin')) {
                    delete document.documentElement.dataset.siteTheme;
                  } else {
                    document.documentElement.dataset.siteTheme = portfolioTheme;
                  }
                }
              } catch {}
            })();`,
          }}
        />
        {children}
        <Toaster richColors position="top-right" theme="dark" closeButton />
      </body>
    </html>
  );
}
