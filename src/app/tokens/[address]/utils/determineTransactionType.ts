export enum ETransactionType {
  MINT = "Mint",
  RECEIVE = "Receive",
  SEND = "Send",
  UNKNOWN = "Unknown",
}

const ADDRESS_0X = "0x0000000000000000000000000000000000000000";

export const determineTransactionType = (
  from: string,
  to: string,
  currentAddress: string,
) => {
  if (from === ADDRESS_0X) return ETransactionType.MINT;
  if (currentAddress === from) return ETransactionType.SEND;
  if (currentAddress === to) return ETransactionType.RECEIVE;

  return ETransactionType.UNKNOWN;
};
