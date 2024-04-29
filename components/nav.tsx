"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUser } from "@/context/user";
import { cn } from "@/lib/utils";
import {
  CircleUser,
  Home,
  LogOutIcon,
  Menu,
  Mountain,
  Package2,
  FileUp,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function Navbar() {
  const user = useUser();
  const { setTheme, theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  let token: string | null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  async function handleLogout() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/sign-out`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
        }),
      }
    );
    const data = await response.json();
    if (data.status == "error") {
      toast.error(data.message);
    } else {
      toast.success(data.message);
      router.push("/auth/sign-in");
    }
  }

  function renderProfile() {
    return user ? (
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="w-full"></div>
        <div className="flex items-center gap-4">
          <Button size={"default"} asChild>
            <Link href={"/works/new"}>
              <FileUp className="size-4" />
              <span className="ml-2">Upload new work</span>
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  {/* <AvatarImage src="/next.svg" alt="@shadcn" /> */}
                  <AvatarFallback>
                    <CircleUser className="h-5 w-5 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.username}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <Link href={"/profile"}>
                  <DropdownMenuItem>
                    Profile
                    <DropdownMenuShortcut>
                      <UserIcon className="h-4 w-4" />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </Link>
                <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                  <Label
                    htmlFor="profile"
                    className="w-full cursor-pointer font-normal"
                  >
                    Dark Mode
                  </Label>
                  <Switch
                    id="profile"
                    checked={theme === "dark"}
                    onCheckedChange={(checked) =>
                      setTheme(checked ? "dark" : "light")
                    }
                  />
                </div>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
                <DropdownMenuShortcut>
                  <LogOutIcon className="h-4 w-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    ) : (
      <div className="flex w-full items-center justify-end gap-4">
        <Button size={"sm"} variant={"link"} asChild>
          <Link href={"/auth/sign-in"}>Login</Link>
        </Button>
        <Button size={"sm"} variant={"default"} asChild>
          <Link href={"/auth/sign-up"}>Register</Link>
        </Button>
      </div>
    );
  }

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(false);
    };

    fetchUser();
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 flex h-20 items-center gap-4 border-b bg-background px-4 md:px-6 w-full z-10",
        pathname.startsWith("/auth") && "hidden"
      )}
    >
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Mountain className="h-6 w-6" />
          <span>Landersaki</span>
          <span className="sr-only">Landersaki</span>
        </Link>
        <Link
          href="/"
          className="text-foreground transition-colors hover:text-foreground"
        >
          Home
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="max-w-sm">
          <nav className="grid gap-3 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold mb-4"
            >
              <Mountain className="h-6 w-6" />
              <span>Landersaki</span>
              <span className="sr-only">Landersaki</span>
            </Link>
            <Link
              href="/"
              className={cn(
                "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground",
                pathname === "/"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground"
              )}
            >
              <Home className="h-5 w-5" />
              Home
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      {renderProfile()}
    </header>
  );
}
