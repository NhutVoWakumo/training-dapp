import { Space } from "antd";
import {
  SignMessage,
  SwitchChain,
  Transfer,
  WalletError,
  WalletList,
} from "./components";
import { SelectedWallet } from "./components/SelectedWallet";
import { AppContext } from "./contexts";

export default function Home() {
  return (
    <AppContext>
      <main className="flex min-h-screen flex-col items-center p-24 gap-10">
        <WalletList />
        <hr />
        <SelectedWallet />
        <Space>
          <SwitchChain />
          <Transfer />
          <SignMessage />
        </Space>
        <WalletError />
      </main>
    </AppContext>
  );
}
