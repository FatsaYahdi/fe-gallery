import { ThemeToggle } from "@/components/theme-toggle";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <ThemeToggle className="absolute top-10 right-10" />
      {children}
    </div>
  );
}
