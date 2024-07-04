import { Space } from "antd";
import { SwitchChain, Transfer, WalletError, WalletList } from "./components";
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
        </Space>
        <WalletError />
      </main>
    </AppContext>
  );
}
