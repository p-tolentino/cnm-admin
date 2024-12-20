"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User as UserIcon, Menu, Moon, Sun, PcCaseIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import { PiSignOut as SignOut } from "react-icons/pi";
import { Separator } from "./ui/separator";
import { toast } from "sonner";

import { useAuth } from "@/hooks/use-auth";

const NAV_LINKS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
];

export const Header = () => {
  const pathname = usePathname();
  const { setTheme, theme, systemTheme } = useTheme();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const supabase = createClient();

  const user = useAuth();

  const logoSrc =
    theme === "dark" || (theme === "system" && systemTheme === "dark")
      ? "/cover-dark.png"
      : "/cover.png";

  const handleLogout = async () => {
    await supabase.auth.signOut().then(() => {
      const loadingToast = toast.loading("Logging out...");
      setTimeout(() => router.push("/"), 2000);
      setTimeout(() => toast.dismiss(loadingToast), 2000);
    });
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 p-4">
        <Link
          href="/"
          className="flex text-lg font-semibold md:text-base relative flex-shrink-0"
        >
          <Image
            src={logoSrc}
            alt="Chicken Near Me Logo"
            height={48}
            width={160}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "transition-colors hover:text-foreground text-muted-foreground",
              {
                "text-[#c41b1b] font-bold": pathname === href,
              }
            )}
          >
            {label}
          </Link>
        ))}
      </div>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
              onClick={() => setIsOpen(false)}
            >
              <Image
                src={logoSrc}
                alt="Chicken Near Me Logo"
                height={48}
                width={160}
                className="h-10 md:h-14 lg:h-16 w-auto"
                priority
              />
            </Link>
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "hover:text-[#c41b1b] text-muted-foreground transition-colors",
                  {
                    "text-[#c41b1b] font-bold": pathname === href,
                  }
                )}
                onClick={() => setIsOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
        {/* <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form> */}
        <Button className="hover:bg-none rounded-xl" onClick={handleLogout}>
          Logout
          <SignOut className="w-4 h-4 " />
        </Button>{" "}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="hover:bg-none rounded-xl"
              variant="outline"
              size="icon"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Theme Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all " />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all " />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <PcCaseIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all " />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
