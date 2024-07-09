"use client";

import React, { PropsWithChildren, useEffect } from "react";

import { message } from "antd";
import { truncateText } from "../utils";
import { useWalletProvider } from "../hooks";

export const ErrorMessageWrapper: React.FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const { errorMessage, clearError } = useWalletProvider();

  useEffect(() => {
    if (errorMessage)
      messageApi.open({
        type: "error",
        content: truncateText(errorMessage, 30),
        duration: 5,
        onClose: () => clearError(),
      });
  }, [clearError, errorMessage, messageApi]);

  return (
    <div>
      {contextHolder}
      {children}
    </div>
  );
};
