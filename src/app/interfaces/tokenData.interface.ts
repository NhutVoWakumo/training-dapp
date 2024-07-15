import { ethers } from "ethers";

export interface ITokenData {
  symbol: string;
  balance: string;
  decimals: string;
  address: string;
  contract: ethers.Contract;
}
