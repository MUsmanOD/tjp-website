import localFont from "next/font/local";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AppProviders } from "@/components/providers/app-providers";
import { SkipLink } from "@/components/layout/skip-link";
import "./globals.css";

const rajdhani = localFont({
  variable: "--font-rajdhani",
  src: [
    { path: "./fonts/rajdhani-400.woff2", weight: "400" },
    { path: "./fonts/rajdhani-500.woff2", weight: "500" },
    { path: "./fonts/rajdhani-600.woff2", weight: "600" },
    { path: "./fonts/rajdhani-700.woff2", weight: "700" },
  ],
  display: "swap",
});

const urdu = localFont({
  variable: "--font-noto-urdu",
  src: "./fonts/noto-nastaliq-urdu.woff2",
  weight: "400 700",
  display: "swap",
  adjustFontFallback: false,
  preload: false,
});

export const metadata = {
  title: "Tehreek Jawanan Pakistan | TJP",
  description: "Discover Tehreek Jawanan Pakistan (TJP). Explore ideas, community, and a shared future for Pakistan in English and Urdu.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${rajdhani.variable} ${urdu.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" cz-shortcut-listen="true">
        <AppProviders>
          <SkipLink />
          <Header />
          {children}
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
