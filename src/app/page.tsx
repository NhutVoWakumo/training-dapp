import {
  LoadingWrapper,
  NFTList,
  SignMessage,
  SwitchChain,
  TokenList,
  TransferNativeCoin,
  WalletList,
} from "./components";
import { Space, Tabs } from "antd";

import { AppContext } from "./contexts";
import { SelectedWallet } from "./components/SelectedWallet";

export default function Home() {
  return (
    <AppContext>
      <LoadingWrapper>
        <main className="flex min-h-screen flex-col items-center gap-10 bg-white p-5">
          <WalletList />
          <hr />
          <SelectedWallet />
          <Space>
            <SwitchChain />
            <TransferNativeCoin />
            <SignMessage />
          </Space>
          <Tabs
            style={{ minWidth: "15rem" }}
            centered
            items={[
              {
                key: "Tokens",
                label: "Tokens",
                children: <TokenList />,
              },
              {
                key: "NFTs",
                label: "NFTs",
                children: <NFTList />,
              },
            ]}
          />
        </main>
      </LoadingWrapper>
    </AppContext>
  );
}
