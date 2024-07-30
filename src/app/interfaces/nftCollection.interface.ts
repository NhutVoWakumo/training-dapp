export interface INFTCollection {
  tokenAddress: string;
  contractType: string;
  name: string;
  symbol: string;
  ownedNFTCount: number;
  collectionLogo?: string | undefined;
  collectionBannerImage?: string | undefined;
}
