"use client";

import { ThemeProvider } from "next-themes";
import { AppProvider } from "@/contexts/app-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppProvider>{children}</AppProvider>
    </ThemeProvider>
  );
}
