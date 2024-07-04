"use client";

import { toBeHex } from "ethers";
import React, { useCallback, useState } from "react";
import { useWalletProvider } from "../hooks";
import { Button } from "antd";
import { ChainList } from "./ChainList";
import { IChainData } from "../interfaces";
import { formatChainAsHex } from "../utils";

export const SwitchChain = () => {
  const [openSelectChainModal, setOpenSelectChainModal] =
    useState<boolean>(false);
  const { selectedWallet } = useWalletProvider();

  const switchChain = useCallback(
    async (provider: EIP1193Provider, chain: IChainData) => {
      console.log("hex chainID:", formatChainAsHex(chain.chainId));
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: formatChainAsHex(chain.chainId) }],
        });
        window.location.reload();
      } catch (switchError) {
        const error = switchError as WalletError;
        // This error code indicates that the chain has not been added to MetaMask.
        if (Number(error.code) === 4902) {
          try {
            await provider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: formatChainAsHex(chain.chainId),
                  chainName: chain.name,
                  rpcUrls: chain.rpc,
                  nativeCurrency: chain.nativeCurrency,
                },
              ],
            });
            window.location.reload();
          } catch (addError) {
            // Handle "add" error.
            console.error(addError);
          }
        } else {
          // Handle other "switch" errors.
          console.error(switchError);
        }
      }
    },
    []
  );

  return (
    <div>
      {selectedWallet && (
        <>
          <Button onClick={() => setOpenSelectChainModal(true)}>
            Switch Chain
          </Button>
          <ChainList
            open={openSelectChainModal}
            onCancel={() => setOpenSelectChainModal(false)}
            onSwitchChain={switchChain}
          />
        </>
      )}
    </div>
  );
};
