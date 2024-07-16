import { Contract } from "ethers";
import { ethers } from "ethers";

export interface ITokenData {
  symbol: string;
  balance: string;
  decimals: string;
  address: string;
  contract: ethers.Contract;
}

export interface NFTAttribute {
  trait_type: string;
  value: string;
}

export interface NFTData extends Record<any, any> {
  name: string;
  description: string;
  attributes: NFTAttribute[];
  image: string;
  address: string;
  tokenId: number;
  contract?: Contract;
}
