"use client";

import { Alert } from "antd";
import { useWalletProvider } from "../hooks";

export const WalletError = () => {
  const { errorMessage, clearError } = useWalletProvider();
  const isError = !!errorMessage;

  return (
    <>
      {isError && (
        <Alert
          message={"Wallet connection error"}
          description={errorMessage}
          type={"error"}
          closable
          onClose={clearError}
        />
      )}
    </>
  );
};
