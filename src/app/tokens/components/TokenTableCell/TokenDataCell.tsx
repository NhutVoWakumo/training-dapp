import React, { useCallback } from "react";

import { ITokenData } from "../../interfaces";
import Jazzicon from "react-jazzicon/dist/Jazzicon";
import Link from "next/link";
import { SymbolLogo } from "@api3/logos";
import { User } from "@nextui-org/react";
import { formatAddress } from "@/app/utils";
import { jsNumberForAddress } from "react-jazzicon";

interface TokenDataCellProps {
  token: ITokenData;
}

export const TokenDataCell = ({ token }: TokenDataCellProps) => {
  const getTokenLogoSrc = useCallback((tokenSymbol: string) => {
    const thirdPartyLogo = SymbolLogo(tokenSymbol.toUpperCase()) as any;
    const logoSrc = thirdPartyLogo.src as string;

    if (logoSrc.includes("Placeholder")) return "";

    return logoSrc;
  }, []);
  return (
    <div>
      <Link href={`${window.location.pathname}/${token.address}`}>
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
            src: getTokenLogoSrc(token.symbol),
            color: "warning",
            isBordered: true,
            fallback: (
              <Jazzicon
                diameter={50}
                seed={jsNumberForAddress(token.address)}
              />
            ),
          }}
        >
          {token.decimals}
        </User>
      </Link>
    </div>
  );
};
