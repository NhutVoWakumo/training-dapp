import "./globals.css";

import { AppContext, Web3Modal } from "./contexts";

import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { Navbar } from "./components";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Training DApp",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark text-foreground bg-background">
      <body>
        <AppContext>
          <Web3Modal>
            <div>
              <Navbar />
              {children}
            </div>
          </Web3Modal>
        </AppContext>
      </body>
    </html>
  );
}
