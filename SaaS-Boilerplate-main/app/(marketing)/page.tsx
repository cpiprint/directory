import { MainNav } from "@/components/main-nav";
import { ModeToggle } from "@/components/toggle";
import { Button } from "@/components/ui/button";
import HeroPage from "./hero/page";

export default function Home() {
  return (
    <>
    <HeroPage />
    <div className="fixed left-0 top-0 -z-10 h-full w-full">
      <div className="absolute inset-0 -z-10 h-full w-full 
      bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] 
      dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"
      ></div>
    </div>
  </>
  );
}
