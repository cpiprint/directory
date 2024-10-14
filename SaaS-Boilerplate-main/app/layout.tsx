import { MainNav } from "@/components/main-nav";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { fontSans } from "@/lib/fonts";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/toggle";
import { SiteFooter } from "@/components/site-footer";
import MobileNav from "@/components/mobile-nav";
import { Toaster } from "@/components/ui/toaster";
import { getCurrentUser } from "@/lib/session";
import { getAuthSession } from "@/lib/auth";
import Head from "next/head";
import Script from 'next/script';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quote AI",
  description: "Generate Daily Quotes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        {/* Place meta tags and other elements in Head */}
        <title>Quote AI</title>
      </Head>
      <body
        className={cn(
          "relative flex min-h-screen w-full flex-col justify-center scroll-smooth bg-background font-sans antialiased"
        )}
      >
        {/* Move Script component outside of Head */}
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="540f945b-caa7-4b4d-974d-f6afe0811eb0"
        />

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Uncomment this block if you want to display the header */}
          {/* <header className="h-16 container sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between py-6 w-full">
              <MobileNav />
              <MainNav />
              <nav>
                <div className="md:flex">
                  <div className="flex gap-4">
                    <ModeToggle />
                    <Link
                      href="/login"
                      className={cn(
                        buttonVariants({ variant: "secondary", size: "sm" }),
                        "px-4"
                      )}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </nav>
            </div>
          </header> */}

          <main className="flex-1">{children}</main>
          <SiteFooter />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
