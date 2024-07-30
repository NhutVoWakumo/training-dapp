import { chainData } from "@/app/constants";

export const getChainData = (chainId: string) => {
  const currentChainData = chainData.find(
    (chain) => chain.chainId.toString() === chainId.toString(),
  );

  if (currentChainData) return currentChainData;

  return undefined;
};
