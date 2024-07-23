import { ITokenData } from "../../interfaces";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import React from "react";
import { User } from "@nextui-org/react";
import { formatAddress } from "@/app/utils";
import { jsNumberForAddress } from "react-jazzicon";

interface TokenDataCellProps {
  token: ITokenData;
}

export const TokenDataCell = ({ token }: TokenDataCellProps) => {
  return (
    <div>
      <User
        description={formatAddress(token.address)}
        name={
          <>
            <p className="hidden md:block">{token.name}</p>
            <p className="text-sm md:hidden">{token.symbol}</p>
          </>
        }
        avatarProps={{
          showFallback: true,
          radius: "full",
          src: token.logoUrl,
          color: "warning",
          isBordered: true,
          fallback: (
            <Jazzicon diameter={50} seed={jsNumberForAddress(token.address)} />
          ),
        }}
      >
        {token.decimals}
      </User>
    </div>
  );
};
