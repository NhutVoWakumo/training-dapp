import { BiDotsVerticalRounded, BiImport, BiTransfer } from "react-icons/bi";
import {
  Button,
  ButtonProps,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
} from "@nextui-org/react";
import React, { useMemo } from "react";

interface TokenActionCellProps {
  isDisabled?: boolean;
  isLoading?: boolean;
  onTransferClick: () => void;
  onImportClick: () => void;
}

interface ButtonItem extends Record<string, any> {
  onClick: () => void;
  color: ButtonProps["color"];
  key: string;
  label: React.ReactNode;
  icon: React.ReactNode;
}

export const TokenActionCell = ({
  isDisabled,
  isLoading,
  onImportClick,
  onTransferClick,
}: TokenActionCellProps) => {
  const items: ButtonItem[] = useMemo(
    () => [
      {
        key: "transfer-button",
        color: "warning",
        onClick: onTransferClick,
        label: "Transfer token",
        icon: <BiTransfer size={22} />,
      },
      {
        key: "import-button",
        color: "secondary",
        onClick: onImportClick,
        label: "Import token to wallet",
        icon: <BiImport size={22} />,
      },
    ],
    [onImportClick, onTransferClick],
  );
  return (
    <>
      <div className="relative items-center gap-2 hidden md:flex">
        {items.map((item) => (
          <Tooltip key={item.key} content={item.label}>
            <Button
              className="bg-transparent"
              isIconOnly
              isDisabled={isDisabled}
              isLoading={isLoading}
              variant="faded"
              color={item.color}
              onClick={item.onClick}
            >
              {item.icon}
            </Button>
          </Tooltip>
        ))}
      </div>
      <div className="md:hidden flex size-full justify-center">
        <Dropdown>
          <DropdownTrigger>
            <Button
              variant="light"
              isIconOnly
              size="sm"
              isDisabled={isDisabled}
              isLoading={isLoading}
            >
              <BiDotsVerticalRounded size={22} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Dynamic Actions" items={items}>
            {(item) => (
              <DropdownItem
                key={item.key}
                onClick={item.onClick}
                startContent={item.icon}
              >
                {item.label}
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      </div>
    </>
  );
};
