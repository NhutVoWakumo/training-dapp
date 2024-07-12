"use client";

import React, { useCallback, useState } from "react";

import { Button } from "antd";
import { ChainList } from "./ChainList";
import { IChainData } from "../interfaces";
import { formatChainAsHex } from "../utils";
import { useWalletProvider } from "../hooks";

export const SwitchChain = () => {
  const [openSelectChainModal, setOpenSelectChainModal] =
    useState<boolean>(false);
  const { triggerLoading, globalLoading, processErrorMessage, selectedWallet } =
    useWalletProvider();

  const switchChain = useCallback(
    async (chain: IChainData) => {
      triggerLoading(true);
      try {
        await selectedWallet?.provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: formatChainAsHex(chain.chainId) }],
        });
        window.location.reload();
      } catch (switchError) {
        const error = switchError as WalletError;
        // This error code indicates that the chain has not been added to MetaMask.
        if (Number(error.code) === 4902) {
          try {
            await selectedWallet?.provider.request({
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
            processErrorMessage(addError);
          }
        } else {
          // Handle other "switch" errors.
          console.error(switchError);
          processErrorMessage(switchError);
        }
      } finally {
        triggerLoading(false);
      }
    },
    [processErrorMessage, triggerLoading]
  );

  return (
    <div>
      {selectedWallet && (
        <>
          <Button
            onClick={() => setOpenSelectChainModal(true)}
            loading={globalLoading}
          >
            Switch Chain
          </Button>
          <ChainList
            open={openSelectChainModal}
            onCancel={() => setOpenSelectChainModal(false)}
            onSwitchChain={switchChain}
            loading={globalLoading}
          />
        </>
      )}
    </div>
  );
};
