import { Button, ButtonProps } from "@nextui-org/react";

import React from "react";

export const LoadMoreButton = (props: Omit<ButtonProps, "children">) => {
  return (
    <div className="flex w-full justify-center">
      <Button variant="flat" {...props}>
        Load more
      </Button>
    </div>
  );
};
