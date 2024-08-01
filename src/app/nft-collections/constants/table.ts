import { capitalizeFirstLetter } from "@/app/utils";

export enum EColumnKeys {
  NAME = "name",
  TYPE = "type",
  OWNED_NFTS = "owned NFTs",
}

export const columns = Object.values(EColumnKeys).map((item) => ({
  key: item,
  name: capitalizeFirstLetter(item),
}));
