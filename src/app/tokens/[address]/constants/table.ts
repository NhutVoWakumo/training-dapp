import { capitalizeFirstLetter } from "@/app/utils";

export enum EColumnKeys {
  TYPE = "type",
  VALUE = "value",
  FROM = "from",
  TO = "to",
}

export const columns = Object.values(EColumnKeys).map((item) => ({
  key: item,
  name: capitalizeFirstLetter(item),
}));
