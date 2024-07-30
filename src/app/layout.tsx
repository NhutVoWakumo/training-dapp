import "./globals.css";

import { AppContext, Web3Modal } from "./contexts";

import { MESSAGE_DURATION } from "./constants";
import type { Metadata } from "next";
import { Navbar } from "./components";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: { default: "HEHE DApp", template: "%s | HEHE DApp" },
  description: "Manage Tokens and NFTs of your accounts",
  openGraph: {
    title: { default: "HEHE DApp", template: "%s | HEHE DApp" },
    description: "Manage Tokens and NFTs of your accounts",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background text-foreground dark">
      <body>
        <Web3Modal>
          <AppContext>
            <div>
              <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={8}
                toastOptions={{
                  duration: MESSAGE_DURATION,
                  style: {
                    background: "black",
                    color: "white",
                  },
                }}
              />
              <Navbar />
              {children}
            </div>
          </AppContext>
        </Web3Modal>
      </body>
    </html>
  );
}
