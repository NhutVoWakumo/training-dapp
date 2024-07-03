import { SwitchChain, WalletError, WalletList } from "./components";
import { SelectedWallet } from "./components/SelectedWallet";
import { AppContext } from "./contexts";

export default function Home() {
  return (
    <AppContext>
      <main className="flex min-h-screen flex-col items-center p-24 gap-10">
        <WalletList />
        <hr />
        <SelectedWallet />
        <SwitchChain />
        <WalletError />
      </main>
    </AppContext>
  );
}
