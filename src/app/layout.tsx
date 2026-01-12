import "@/app/global.css";
import { RootProvider } from "fumadocs-ui/provider";
import { IBM_Plex_Sans } from "next/font/google";

const ibmFlexSans = IBM_Plex_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ['latin']
})

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={ibmFlexSans.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
