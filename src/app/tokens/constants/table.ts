import { capitalizeFirstLetter } from "@/app/utils";

export enum EColumnKeys {
  TOKEN = "token",
  BALANCE = "balance",
  ACTIONS = "actions",
}

export const columns = Object.values(EColumnKeys).map((item) => ({
  key: item,
  name: capitalizeFirstLetter(item),
}));

export const PAGE_SIZES = [5, 10, 15, 20];
