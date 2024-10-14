import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function HeroFormCenterAlignedWithAForm() {
  return (
    <>
      {/* Hero */}
      <div className="relative w-full h-1/2 -top-10 flex items-center justify-center">
            {/* Contenu central */}
            <div className="relative z-10">
                <div className="overflow-hidden">
                <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="relative mx-auto max-w-4xl grid space-y-5 sm:space-y-10">
                    {/* Titre */}
                    <div className="text-center">
                        <p className="text-xs font-semibold text-muted-foreground tracking-wide uppercase mb-3">
                        Newsletter Section
                        </p>
                        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                        Stay Updated with Our Latest News!
                        </h1>
                    </div>
                    {/* Groupe d'avatars */}
                    <div className="sm:flex sm:justify-center sm:items-center text-center sm:text-start">
                        <div className="flex-shrink-0 pb-5 sm:flex sm:pb-0 sm:pe-5">
                        <div className="flex justify-center -space-x-3">
                            {/* Avatars */}
                            <Avatar className="h-8 w-8">
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                            <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <Avatar className="h-8 w-8">
                            <AvatarImage src="https://github.com/wcandillon.png" alt="@wcandillon" />
                            <AvatarFallback>WC</AvatarFallback>
                            </Avatar>
                            <Avatar className="h-8 w-8">
                            <AvatarImage src="https://github.com/BresThomas.png" alt="@BresThomas" />
                            <AvatarFallback>BT</AvatarFallback>
                            </Avatar>
                            <Avatar className="h-8 w-8">
                            <AvatarImage src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="@shadcn" />
                            <AvatarFallback>LD</AvatarFallback>
                            </Avatar>
                            <span className="z-10 inline-flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-muted-foreground bg-background">
                            <span className="text-xs font-medium leading-none uppercase">7k+</span>
                            </span>
                        </div>
                        </div>
                        <div className="border-t sm:border-t-0 sm:border-s w-32 h-px sm:w-auto sm:h-full mx-auto sm:mx-0"></div>
                        <div className="pt-5 sm:pt-0 sm:ps-5">
                        <div className="text-lg font-semibold">Join Our Community</div>
                            <div className="text-sm text-muted-foreground">
                                Over 7k subscribers trust us.
                            </div>

                        </div>
                    </div>
                    {/* Formulaire */}
                    <form>
                        <div className="mx-auto bg-white dark:bg-black max-w-2xl sm:flex sm:space-x-3 p-3 border rounded-lg shadow-lg shadow-primary-foreground ">
                        <div className="pb-2 sm:pb-0 sm:flex-[1_0_0%]">
                            <Label htmlFor="name">
                            <span className="sr-only">Your name</span>
                            </Label>
                            <Input type="text" id="name" placeholder="Your name" />
                        </div>
                        <div className="pt-2 sm:pt-0 sm:ps-3 border-t sm:border-t-0 sm:border-s sm:flex-[1_0_0%]">
                            <Label htmlFor="email" className="block text-sm font-medium dark:text-white">
                            <span className="sr-only">Your email address</span>
                            </Label>
                            <Input type="email" id="email" placeholder="Your email" />
                        </div>
                        <div className="pt-2 sm:pt-0 grid sm:block sm:flex-[0_0_auto]">
                            <Button>Subscribe Now</Button>
                        </div>
                        </div>
                    </form>
                    </div>
                </div>
                </div>
            </div>
       </div>
      {/* End Hero */}
    </>
  );
}
