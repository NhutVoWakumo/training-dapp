import {
  LoadingWrapper,
  SignMessage,
  SwitchChain,
  TokenList,
  Transfer,
  WalletList,
} from "./components";

import { AppContext } from "./contexts";
import { SelectedWallet } from "./components/SelectedWallet";
import { Space } from "antd";

export default function Home() {
  return (
    <AppContext>
      <LoadingWrapper>
        <main className="flex min-h-screen flex-col items-center gap-10 bg-white">
          <WalletList />
          <hr />
          <SelectedWallet />
          <Space>
            <SwitchChain />
            <Transfer />
            <SignMessage />
          </Space>
          <TokenList />
        </main>
      </LoadingWrapper>
    </AppContext>
  );
}
