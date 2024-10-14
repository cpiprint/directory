import { BentoDemo } from "@/components/bento-features";
import { Icons } from "@/components/icons";
import { Companies } from "@/components/social-proof";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "@/node_modules/next/link";
import React from "react";
import Safari from "@/components/magicui/safari";
import HeroFormCenterAlignedWithAForm from "@/components/ui/HeroForm";

function HeroPage() {
  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-20">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center sm:mb-10 lg:mb-20 md:sm-20">
         
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl mt-20">
          Launch Your SaaS in Minutes
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Get the ultimate Boilerplate to kickstart your SaaS journey.
          </p>
          <div className="flex space-x-4 mt-4 mb-4">
            <Link href="http://buy.thomasbres.com/" target="_blank" rel="noreferrer" className={cn(buttonVariants({ size: "lg" }))}>
            Get the Boilerplate Now!
            </Link>
            {/* <AvatarCirclesDemo /> */}
            
            {/* <a
              href="/#features"
              
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-sm-2")}
            >
              Let&apos;s Explore 👇🏻
            </a> */}
            
          </div>
        </div>

      <div className="relative mx-auto w-full max-w-[90vw] sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[1000px]">
        <Safari
          url="yourBoilerplate.com"
          className="w-full h-auto aspect-video"
          src="https://via.placeholder.com/1200x750"
        />
      </div>
      </section>

      <Companies />
      
      <section
        id="features"
        className="container space-y-6 bg-transparent py-8 dark:bg-transparent md:py-12 lg:py-10"
      >
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h3 className="text-center text-sm font-semibold text-gray-500 pb-2">
              FEATURES
            </h3>         
        </div>
        <BentoDemo />
      </section>
      <section id="hero-form" className="container md:py-12 lg:py-24">

        <HeroFormCenterAlignedWithAForm />
        
      </section>
    </>
  );
}

export default HeroPage;
