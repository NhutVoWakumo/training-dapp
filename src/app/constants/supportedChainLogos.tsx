import { ChainLogo } from "@api3/logos";
import { Image } from "@nextui-org/react";
import { ReactNode } from "react";
import { chainData } from "./chain";

interface ISupportedChainLogos {
  key: string;
  logo: ReactNode;
}

export const supportedChainLogos: ISupportedChainLogos[] = chainData.map(
  (chain) => ({
    key: chain.chainId.toString(),
    logo: (
      <div className="flex items-center gap-3">
        <Image
          loading="lazy"
          radius="full"
          src={(ChainLogo(chain.chainId.toString()) as any).src}
          className="size-10"
          alt={chain.name}
        />

        <p className="text-lg">{chain.name}</p>
      </div>
    ),
  }),
);
