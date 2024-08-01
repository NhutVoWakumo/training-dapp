import { Button, ButtonProps } from "@nextui-org/react";

import { BiRefresh } from "react-icons/bi";
import React from "react";

interface ReloadButtonProps
  extends Omit<ButtonProps, "onClick" | "children" | "isIconOnly"> {
  onReload: () => void | Promise<void>;
}

export const ReloadButton = ({ onReload, ...props }: ReloadButtonProps) => {
  return (
    <Button {...props} isIconOnly onClick={onReload}>
      <BiRefresh size={28} />
    </Button>
  );
};
