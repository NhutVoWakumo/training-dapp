import { parseUnits, toBeHex } from "ethers";

export const formatBalance = (rawBalance: string) => {
  const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2);
  return balance;
};

export const formatChainAsNum = (chainIdHex: string) => {
  const chainIdNum = parseInt(chainIdHex);
  return chainIdNum;
};

export const formatAddress = (addr: string) => {
  const upperAfterLastTwo = addr.slice(0, 2) + addr.slice(2);
  return `${upperAfterLastTwo.substring(0, 5)}...${upperAfterLastTwo.substring(
    39
  )}`;
};

export const formatChainAsHex = (chainId: number) => {
  return `0x${chainId.toString(16)}`;
};

export const formatValueToHexWei = (value: string) => {
  return toBeHex(parseUnits(value, "ether"));
};

export const formatHexEncodedMessage = (message: string) => {
  return `0x${Buffer.from(message, "utf8").toString("hex")}`;
};