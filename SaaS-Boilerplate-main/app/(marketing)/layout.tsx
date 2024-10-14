import { MainNav } from "@/components/main-nav";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { fontSans } from "@/lib/fonts";
import Link from "@/node_modules/next/link";
import { buttonVariants } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/toggle";

import { SiteFooter } from "@/components/site-footer";

import MobileNav from "@/components/mobile-nav";
import { getCurrentUser } from "@/lib/session";
import { getAuthSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import DashboardLayout from "../(dashboard)/layout";
import { useRouter } from "next/navigation";
import DashboardPage from "../(dashboard)/dashboard/page";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SaaS AI Boilerplate",
  description: "AI SaaS Boilerplate, including user authentication, billing, and subscription management. The tech stack includes Next.js, Tailwind CSS, Shadcn-ui, Magic-ui, Supabase, NextAuth, and Prisma.",
};

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const session = await getAuthSession();

  const isAuthenticated = !!user;

  return (
    <>
      {isAuthenticated ? (
        // User is authenticated, show dashboard layout
        <>
          <main className="flex w-full flex-col justify-center ">
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </main>
        </>
      ) : (
        <>
          <div className="flex min-h-screen flex-col">
            <header className="h-16 container sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                          buttonVariants({ variant: "default", size: "sm" }),
                          "px-4"
                        )}
                      >
                        Get Started
                      </Link>
                    </div>
                  </div>
                </nav>
              </div>
            </header>
            {/* <HeroPage /> */}

            <main className="flex-1">{children}</main>
          </div>

          {/* <SiteFooter /> */}
        </>
      )}
    </>
  );
}