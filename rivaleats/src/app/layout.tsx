import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/cart/CartProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rival Eats | Home-cooked, rival-worthy meals",
  description:
    "Home-cooked, rival-worthy meals. Rival-Friendly Meals for Busy Weeks with delivery or pickup in Broward County.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} bg-cream text-charcoal antialiased`}
      >
        <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,rgba(193,18,31,0.09),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(47,143,47,0.08),transparent_25%)]">
          <CartProvider>
            <NavBar />
            <main className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-12">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </div>
      </body>
    </html>
  );
}
