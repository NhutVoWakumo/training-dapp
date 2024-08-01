import { SymbolLogo } from "@api3/logos";

export const getTokenLogo = (tokenSymbol: string, tokenUrl?: string) => {
  if (tokenUrl) return tokenUrl;

  const alternativeUrl = (SymbolLogo(tokenSymbol) as any).src as string;

  if (!alternativeUrl.includes("Placeholder")) return alternativeUrl;

  return "";
};
