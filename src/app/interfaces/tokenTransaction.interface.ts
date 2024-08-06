export interface TokenTransaction extends Record<string, any> {
  token_name: string;
  token_symbol: string;
  token_logo: string | null;
  token_decimals: string;
  from_address_entity: string | null;
  from_address_entity_logo: string | null;
  from_address: string;
  from_address_label: string | null;
  to_address_entity: string | null;
  to_address_entity_logo: string | null;
  to_address: string;
  to_address_label: string | null;
  address: string;
  block_hash: string;
  block_number: string;
  block_timestamp: string;
  transaction_hash: string;
  transaction_index: number;
  log_index: number;
  value: string;
  possible_spam: boolean;
  value_decimal: string;
  verified_contract: boolean;
}
