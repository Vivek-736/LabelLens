import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LabelLens - Consumer Health Co-pilot",
  description: "LabelLens is an AI-native consumer health co-pilot that helps users understand food ingredients at the moment decisions matter. By interpreting ingredient labels through reasoning, context, and uncertainty-aware explanations, LabelLens reduces cognitive load and transforms complex food science into clear, human insight.",
  icons: {
    icon: "/favicon.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        }
      }}
    >
      <html 
        lang="en" 
        suppressHydrationWarning
      >
        <body 
          className={`${outfit.className} antialiased`}
        >
          <Provider>
            {children}
          </Provider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}