import { Avatar, Button } from "@nextui-org/react";

import { WalletConnectIcon } from "@/app/assets/icons";
import { useWeb3Modal } from "@web3modal/ethers/react";

export const WalletConnectButton = () => {
  const { open } = useWeb3Modal();
  return (
    <Button onClick={() => open()} color="primary" radius="full">
      <Avatar
        className="bg-transparent"
        showFallback
        fallback={<WalletConnectIcon />}
      />
      WalletConnect
    </Button>
  );
};
