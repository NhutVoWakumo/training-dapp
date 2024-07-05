"use client";

import React, { useCallback } from "react";
import { useWalletProvider } from "../hooks";
import { Button } from "antd";
import { formatHexEncodedMessage } from "../utils";

export const SignMessage = () => {
  const { selectedWallet, selectedAccount } = useWalletProvider();

  const signMessage = useCallback(
    async (message: string) => {
      try {
        const from = selectedAccount;
        const msg = formatHexEncodedMessage(message);
        const sign = await selectedWallet?.provider.request({
          method: "personal_sign",
          params: [msg, from],
        });

        console.log(sign);
      } catch (err) {
        console.error(err);
      }
    },
    [selectedAccount, selectedWallet?.provider]
  );

  return (
    <div>
      {selectedWallet && (
        <Button onClick={() => signMessage("This is a hello message")}>
          Sign hello message
        </Button>
      )}
    </div>
  );
};
