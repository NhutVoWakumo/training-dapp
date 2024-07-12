import { PropsWithChildren } from "react";
import { WalletProvider } from "./WalletContext";

export const AppContext: React.FC<PropsWithChildren> = ({ children }) => {
  return <WalletProvider>{children}</WalletProvider>;
};

export * from "./web3modal";
