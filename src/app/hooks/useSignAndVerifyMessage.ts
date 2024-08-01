import { ethers } from "ethers";
import { useCallback } from "react";
import { useWalletProvider } from "./useWalletProvider";

export const useSignAndVerifyMessage = () => {
  const { processErrorMessage, triggerLoading, currentProvider } =
    useWalletProvider();

  const signMessage = useCallback(
    async (message: string) => {
      if (!currentProvider) return undefined;

      triggerLoading(true);
      try {
        const signer = await currentProvider.getSigner();
        const signature = await signer.signMessage(message);
        const address = await signer.getAddress();

        return { signature, address };
      } catch (err) {
        console.error(err);
        processErrorMessage(err);
      } finally {
        triggerLoading(false);
      }
    },
    [currentProvider, processErrorMessage, triggerLoading],
  );

  const verifyMessage = useCallback((message: string, signature: string) => {
    return ethers.verifyMessage(message, signature);
  }, []);

  return { signMessage, verifyMessage };
};
