import { Geist, Geist_Mono, Noto_Nastaliq_Urdu } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AppProviders } from "@/components/providers/app-providers";
import { SkipLink } from "@/components/layout/skip-link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const urdu = Noto_Nastaliq_Urdu({
  variable: "--font-noto-urdu",
  subsets: ["arabic"],
  weight: ["400", "600"],
  display: "swap",
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
      className={`${geistSans.variable} ${geistMono.variable} ${urdu.variable} h-full antialiased`}
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
