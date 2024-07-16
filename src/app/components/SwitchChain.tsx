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
      if (!selectedWallet?.provider) return;

      triggerLoading(true);
      try {
        await selectedWallet?.provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: formatChainAsHex(chain.chainId) }],
        });
      } catch (switchError) {
        const error = switchError as WalletError;
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
    [processErrorMessage, selectedWallet?.provider, triggerLoading]
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
