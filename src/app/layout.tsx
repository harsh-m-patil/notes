import { RootProvider } from "fumadocs-ui/provider/next";
import { AISearchTrigger } from "@/components/search";

import "./global.css";
import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body className="flex flex-col min-h-screen">
        <AISearchTrigger />
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
