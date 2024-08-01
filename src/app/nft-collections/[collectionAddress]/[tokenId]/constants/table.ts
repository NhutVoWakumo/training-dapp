import { capitalizeFirstLetter } from "@/app/utils";

export enum EColumnKeys {
  TYPE = "type",
  FROM = "from",
  TO = "to",
  DATE = "date",
}

export const columns = Object.values(EColumnKeys).map((item) => ({
  key: item,
  name: capitalizeFirstLetter(item),
}));
