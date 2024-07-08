import {
  SignMessage,
  SwitchChain,
  TokenList,
  Transfer,
  WalletError,
  WalletList,
} from "./components";

import { AppContext } from "./contexts";
import { SelectedWallet } from "./components/SelectedWallet";
import { Space } from "antd";

export default function Home() {
  return (
    <AppContext>
      <main className="flex min-h-screen flex-col items-center p-24 gap-10 bg-white">
        <WalletList />
        <hr />
        <SelectedWallet />
        <Space>
          <SwitchChain />
          <Transfer />
          <SignMessage />
        </Space>
        <TokenList />
        <WalletError />
      </main>
    </AppContext>
  );
}
